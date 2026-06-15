import https from 'https'
import http from 'http'
import crypto from 'crypto'
import fs from 'fs'

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
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
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
  console.log('=== EXTRACTING PLAYER CONFIGURATION ===\n')
  
  const infoUrl = signUrl('GET', 'https://api.lateremb.ws/info/474')
  const infoData = await httpGet(infoUrl)
  const infoJson = JSON.parse(infoData)
  const iframeUri = infoJson.iframe_uri
  const html = await httpGet(iframeUri)
  
  console.log('1. Extracting makePlayer call...')
  
  // Find makePlayer call
  let mpStart = -1
  let lastIdx = 0
  while (true) {
    const idx = html.indexOf('makePlayer(', lastIdx)
    if (idx === -1) break
    const before = html.substring(Math.max(0, idx - 10), idx)
    if (!before.includes('function ')) mpStart = idx
    lastIdx = idx + 10
  }
  
  if (mpStart === -1) {
    console.log('makePlayer call not found')
    return
  }
  
  // Extract the full makePlayer call
  let depth = 0
  let inString = false
  let stringChar = ''
  let callStart = mpStart + 'makePlayer('.length
  let callEnd = -1
  
  for (let i = callStart; i < html.length; i++) {
    const ch = html[i]
    if (inString) {
      if (ch === stringChar && html[i-1] !== '\\') {
        inString = false
      }
      continue
    }
    if (ch === '"' || ch === "'") {
      inString = true
      stringChar = ch
      continue
    }
    if (ch === '{') {
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0) {
        callEnd = i + 1
        break
      }
    }
  }
  
  const makePlayerCall = html.substring(mpStart, callEnd)
  console.log('makePlayer call length:', makePlayerCall.length)
  
  // Extract the configuration object
  const configStart = makePlayerCall.indexOf('{')
  const configEnd = makePlayerCall.lastIndexOf('}') + 1
  const configStr = makePlayerCall.substring(configStart, configEnd)
  
  console.log('\n2. Player configuration:')
  console.log(configStr)
  
  // Save to file
  fs.writeFileSync('g:\\Blackroom\\server\\player_config.json', JSON.stringify({
    makePlayerCall: makePlayerCall,
    config: configStr,
    html: html
  }, null, 2))
  
  console.log('\n3. Saved to player_config.json')
  
  // Extract key variables
  console.log('\n4. Extracting key variables...')
  
  const cdnCfgMatch = html.match(/var cdn_cfg\s*=\s*\{[^}]+\}/)
  if (cdnCfgMatch) {
    console.log('cdn_cfg:', cdnCfgMatch[0])
  }
  
  const tokenMatch = html.match(/var\s+\w+\s*=\s*\d+\s*,\s*(\w+)\s*=\s*"([^"]+)"/)
  if (tokenMatch) {
    console.log('Token variable:', tokenMatch[1], '=', tokenMatch[2])
  }
  
  const playerBaseMatch = html.match(/var playerBase\s*=\s*"([^"]+)"/)
  if (playerBaseMatch) {
    console.log('playerBase:', playerBaseMatch[1])
  }
  
  console.log('\n=== EXTRACTION COMPLETE ===')
}

main().catch(console.error)
