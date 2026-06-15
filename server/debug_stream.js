import https from 'https'
import http from 'http'
import crypto from 'crypto'

const SECRET_KEY = "nwS1u7oJW2Nvf1XIMEnaqSzYxF82HCAL"
const APP_VERSION_CODE = 33
const PLATFORM = "android"

function b64url_nopad(data) {
  return Buffer.from(data).toString('base64url')
}

function hashBody(body) {
  return crypto.createHash('sha256').update(body, 'utf8').digest('hex')
}

function getTimestamp() {
  return String(Date.now())
}

function getNonce() {
  return b64url_nopad(crypto.randomBytes(16))
}

function extractPathForSigning(url) {
  const parsed = new URL(url)
  const path = parsed.pathname || '/'
  const params = new URLSearchParams(parsed.search)
  const filtered = new URLSearchParams()
  for (const [k, v] of params.entries()) {
    if (!k.startsWith('_ap_')) filtered.append(k, v)
  }
  const query = filtered.toString()
  return query ? path + '?' + query : path
}

function signUrl(method, url, body = '', versionCode = APP_VERSION_CODE) {
  method = method.trim().toUpperCase()
  const path = extractPathForSigning(url)
  const bodyHash = hashBody(body)
  const timestamp = getTimestamp()
  const nonce = getNonce()
  const versionStr = String(versionCode)
  const payload = [method, path, bodyHash, timestamp, nonce, versionStr].join('\n')
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload, 'utf8').digest('base64url')
  const params = { _ap_platform: PLATFORM, _ap_ts: timestamp, _ap_nonce: nonce, _ap_v: versionStr, _ap_body: bodyHash, _ap_sig: signature }
  const parsed = new URL(url)
  for (const [k, v] of Object.entries(params)) parsed.searchParams.set(k, v)
  return parsed.toString()
}

function httpGet(url, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...extraHeaders
    }
    const req = mod.get(url, { headers }, (res) => {
      console.log(`  [${res.statusCode}] ${url.substring(0, 120)}`)
      console.log(`  Response headers:`, JSON.stringify(res.headers, null, 2))
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`  Redirect to: ${res.headers.location}`)
        return httpGet(res.headers.location, extraHeaders).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
  })
}

async function main() {
  // Step 1: Get the stream URL
  console.log('=== STEP 1: Get stream URL ===')
  const infoUrl = signUrl('GET', 'https://api.lateremb.ws/info/474')
  const infoData = await httpGet(infoUrl)
  const infoJson = JSON.parse(infoData)
  const iframeUri = infoJson.iframe_uri
  console.log('iframe_uri:', iframeUri.substring(0, 120))

  const html = await httpGet(iframeUri)
  console.log('HTML length:', html.length)

  // Extract makePlayer call
  let mpStart = -1
  let lastIdx = 0
  while (true) {
    const idx = html.indexOf('makePlayer(', lastIdx)
    if (idx === -1) break
    const before = html.substring(Math.max(0, idx - 10), idx)
    if (!before.includes('function ')) mpStart = idx
    lastIdx = idx + 10
  }

  // Extract HLS URL
  const hlsMatch = html.match(/hls\s*:\s*"(https?:\/\/[^"]+\.m3u8[^"]*)"/)
  const dashMatch = html.match(/dash\s*:\s*"(https?:\/\/[^"]+\.mpd[^"]*)"/)
  const tokenMatch = html.match(/var\s+\w+\s*=\s*\d+\s*,\s*\w+\s*=\s*"([^"]+)"/)

  let streamUrl = null
  let streamType = null
  if (hlsMatch) {
    streamUrl = hlsMatch[1]
    streamType = 'hls'
  } else if (dashMatch) {
    streamUrl = dashMatch[1]
    streamType = 'dash'
  }
  if (streamUrl && tokenMatch) {
    streamUrl += '&' + tokenMatch[1]
  }

  console.log('\nStream type:', streamType)
  console.log('Stream URL:', streamUrl)

  if (!streamUrl) {
    console.log('No stream URL found!')
    return
  }

  // Step 2: Download master.m3u8 WITHOUT any special headers
  console.log('\n=== STEP 2: Download master.m3u8 (no headers) ===')
  try {
    const master = await httpGet(streamUrl)
    console.log('Master playlist (' + master.length + ' chars):')
    console.log(master.substring(0, 3000))
  } catch (e) {
    console.log('FAILED:', e.message)
  }

  // Step 3: Download with Referer header
  console.log('\n=== STEP 3: Download master.m3u8 (with Referer) ===')
  try {
    const master = await httpGet(streamUrl, {
      'Referer': 'https://embed.lateremb.ws/',
      'Origin': 'https://embed.lateremb.ws'
    })
    console.log('Master playlist (' + master.length + ' chars):')
    console.log(master.substring(0, 3000))
  } catch (e) {
    console.log('FAILED:', e.message)
  }

  // Step 4: Check the cdn.js for request interception details
  console.log('\n=== STEP 4: Check cdn.js XMLHttpRequest interception ===')
  const cdnJs = await httpGet('https://embed.lateremb.ws/cdn.js')
  
  // Find the XMLHttpRequest.open interception
  const openIdx = cdnJs.indexOf('r.open=function')
  if (openIdx !== -1) {
    const start = Math.max(0, openIdx - 200)
    const end = Math.min(cdnJs.length, openIdx + 2000)
    console.log('XMLHttpRequest.open interception:')
    console.log(cdnJs.substring(start, end))
  }

  // Find fetch interception
  const fetchIdx = cdnJs.indexOf('fetch.polyfill')
  if (fetchIdx !== -1) {
    const start = Math.max(0, fetchIdx - 200)
    const end = Math.min(cdnJs.length, fetchIdx + 1000)
    console.log('\nFetch polyfill area:')
    console.log(cdnJs.substring(start, end))
  }

  // Look for headers being added
  console.log('\n=== Searching for header modifications in cdn.js ===')
  const headerTerms = ['setRequestHeader', 'headers', 'Authorization', 'Referer', 'Origin', 'X-Requested-With']
  for (const term of headerTerms) {
    let idx = 0
    while ((idx = cdnJs.indexOf(term, idx)) !== -1) {
      const start = Math.max(0, idx - 100)
      const end = Math.min(cdnJs.length, idx + 200)
      console.log(`\n"${term}" at ${idx}:`)
      console.log(cdnJs.substring(start, end))
      idx += term.length
    }
  }

  // Step 5: Look for how the stream URL is modified before actual requests
  console.log('\n=== STEP 5: Check if cdn.js modifies URLs ===')
  const urlModTerms = ['interceptor', 'transform', 'rewrite', 'proxy', ' cors', 'CORS']
  for (const term of urlModTerms) {
    let idx = cdnJs.indexOf(term)
    if (idx !== -1) {
      const start = Math.max(0, idx - 100)
      const end = Math.min(cdnJs.length, idx + 300)
      console.log(`"${term}" at ${idx}: ${cdnJs.substring(start, end)}`)
    }
  }

  // Step 6: Extract all inline script content that might modify requests
  console.log('\n=== STEP 6: Check embed HTML for fetch/XHR setup ===')
  const fetchIdx2 = html.indexOf('fetch(')
  if (fetchIdx2 !== -1) {
    const start = Math.max(0, fetchIdx2 - 200)
    const end = Math.min(html.length, fetchIdx2 + 500)
    console.log('fetch() in HTML:', html.substring(start, end))
  }

  // Step 7: Try different referer values
  console.log('\n=== STEP 7: Try different Referer values ===')
  const referers = [
    'https://embed.lateremb.ws/',
    'https://embed.lateremb.ws/embed/movie/474',
    'https://lateremb.ws/',
    '',
    streamUrl // Use the stream URL itself as referer
  ]
  
  const urlObj = new URL(streamUrl)
  const streamOrigin = urlObj.origin
  
  for (const ref of referers) {
    try {
      const headers = { 'Referer': ref }
      if (ref) headers['Origin'] = new URL(ref).origin
      const master = await httpGet(streamUrl, headers)
      const firstLines = master.split('\n').slice(0, 5).join('\n')
      console.log(`Referer="${ref.substring(0, 50)}" => ${master.length} chars, first lines: ${firstLines}`)
    } catch (e) {
      console.log(`Referer="${ref.substring(0, 50)}" => FAILED: ${e.message}`)
    }
  }

  // Step 8: Try the stream URL WITHOUT token
  console.log('\n=== STEP 8: Try URL without token ===')
  const rawUrl = hlsMatch[1] // without token
  try {
    const master = await httpGet(rawUrl)
    console.log('Without token:', master.length, 'chars')
    console.log(master.substring(0, 1000))
  } catch (e) {
    console.log('FAILED:', e.message)
  }

  // Step 9: Try URL with token appended differently
  console.log('\n=== STEP 9: Try different token formats ===')
  const rawUrl2 = hlsMatch[1]
  const token2 = tokenMatch ? tokenMatch[1] : ''
  const formats = [
    rawUrl2 + '&' + token2,
    rawUrl2 + '?' + token2,
    rawUrl2 + '&token=' + token2,
    rawUrl2 + '&key=' + token2,
  ]
  for (const fmt of formats) {
    try {
      const master = await httpGet(fmt)
      console.log(`Format "${fmt.substring(rawUrl2.length)}" => ${master.length} chars`)
      if (master.length > 0) console.log(master.substring(0, 300))
    } catch (e) {
      console.log(`Format => FAILED: ${e.message}`)
    }
  }

  // Step 10: Download the CDN config
  console.log('\n=== STEP 10: Check cdn.js for CDN configuration ===')
  const cdnCfg = html.match(/var cdn_cfg\s*=\s*\{[^}]+\}/)
  if (cdnCfg) {
    console.log('cdn_cfg:', cdnCfg[0])
  }

  // Check the WebSocket tracker in cdn.js
  console.log('\n=== STEP 11: Check WebSocket P2P config ===')
  const p2pIdx = cdnJs.indexOf('WebSocket')
  if (p2pIdx !== -1) {
    const start = Math.max(0, p2pIdx - 100)
    const end = Math.min(cdnJs.length, p2pIdx + 500)
    console.log(cdnJs.substring(start, end))
  }

  // Step 12: Check if there's a CDN proxy pattern
  console.log('\n=== STEP 12: Check for CDN/proxy patterns in cdn.js ===')
  const proxyTerms = ['proxy', 'cdn', 'relay', 'gateway', 'tunnel']
  for (const term of proxyTerms) {
    let idx = cdnJs.indexOf(term)
    if (idx !== -1) {
      const start = Math.max(0, idx - 50)
      const end = Math.min(cdnJs.length, idx + 200)
      console.log(`"${term}" at ${idx}: ${cdnJs.substring(start, end)}`)
    }
  }
}

main().catch(console.error)