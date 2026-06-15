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
  console.log('=== TESTING PROVIDER SEARCH API ===\n')
  
  // Test 1: Search for a specific movie
  const query = 'matrix'
  const searchUrl = signUrl('GET', `https://api.lateremb.ws/search?q=${query}`)
  console.log('Search URL:', searchUrl)
  console.log()
  
  try {
    const searchData = await httpGet(searchUrl)
    console.log('=== SEARCH RESPONSE (first 500 chars) ===')
    console.log(searchData.substring(0, 500))
    console.log('Total length:', searchData.length)
    console.log()
    
    const searchJson = JSON.parse(searchData)
    console.log('=== PARSED SEARCH TYPE ===')
    console.log('Type:', Array.isArray(searchJson) ? 'Array' : typeof searchJson)
    console.log('Keys:', Object.keys(searchJson))
    console.log()
    
    // API returns array directly or under items/results key
    const results = Array.isArray(searchJson) ? searchJson : (searchJson.items || searchJson.results || [])
    console.log('=== RESULTS ARRAY ===')
    console.log('Results type:', Array.isArray(results) ? 'Array' : typeof results)
    console.log('Results length:', results.length)
    console.log()
    
    if (results.length > 0) {
      console.log('=== FIRST RESULT ===')
      console.log(JSON.stringify(results[0], null, 2))
      console.log()
      
      const providerId = results[0].id
      console.log('Provider ID:', providerId)
      
      // Test 2: Get info using provider ID
      const infoUrl = signUrl('GET', `https://api.lateremb.ws/info/${providerId}`)
      console.log('\n=== TESTING INFO ENDPOINT WITH PROVIDER ID ===')
      console.log('Info URL:', infoUrl)
      
      const infoData = await httpGet(infoUrl)
      console.log('=== INFO RESPONSE (first 500 chars) ===')
      console.log(infoData.substring(0, 500))
      console.log()
      
      const infoJson = JSON.parse(infoData)
      console.log('=== PARSED INFO JSON ===')
      console.log(JSON.stringify(infoJson, null, 2))
      console.log()
      
      if (infoJson.iframe_uri) {
        console.log('✅ iframe_uri found:', infoJson.iframe_uri)
      } else {
        console.log('❌ iframe_uri not found')
      }
    } else {
      console.log('No search results found')
    }
  } catch (error) {
    console.error('Error:', error)
  }
  
  console.log('\n=== TESTING COMPLETE ===')
}

main().catch(console.error)
