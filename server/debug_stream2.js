import https from 'https'
import http from 'http'

function httpGet(url, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...extraHeaders
    }
    const req = mod.get(url, { headers }, (res) => {
      console.log(`  [${res.statusCode}] ${url.substring(0, 150)}`)
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
  // Get the master playlist
  const masterUrl = 'https://hye1eaipby4w.interkh.com/08_15_24/08/15/20/RWGT6MKR/UW7BFJL5.mp4/master.m3u8?fckz2=2a6de20292a1971&ha=f67866321f8734f&hc=05f2a1c56441521&hi=8a716311fba7e20&ht=c56f68bc506100d&hu=7804824179eebdd&hui=b1955afc43a2a74&t=1782329252&c33e240a'
  
  const master = await httpGet(masterUrl)
  
  // Extract first audio playlist URL
  const audioMatch = master.match(/URI="([^"]+index-a1\.m3u8[^"]*)"/)
  if (audioMatch) {
    const audioUrl = audioMatch[1]
    console.log('\n=== AUDIO PLAYLIST ===')
    console.log('URL:', audioUrl.substring(0, 150))
    try {
      const audio = await httpGet(audioUrl)
      console.log('Audio playlist (' + audio.length + ' chars):')
      console.log(audio.substring(0, 1000))
    } catch (e) {
      console.log('FAILED:', e.message)
    }
  }
  
  // Extract first video stream URL
  const videoMatch = master.match(/URI="([^"]+index-v\d+\.m3u8[^"]*)"/)
  if (videoMatch) {
    const videoUrl = videoMatch[1]
    console.log('\n=== VIDEO PLAYLIST ===')
    console.log('URL:', videoUrl.substring(0, 150))
    try {
      const video = await httpGet(videoUrl)
      console.log('Video playlist (' + video.length + ' chars):')
      console.log(video.substring(0, 1000))
      
      // Extract first .ts segment URL
      const tsMatch = video.match(/(https?:\/\/[^"]+\.ts[^"]*)/)
      if (tsMatch) {
        const tsUrl = tsMatch[1]
        console.log('\n=== .TS SEGMENT ===')
        console.log('URL:', tsUrl.substring(0, 150))
        try {
          const ts = await httpGet(tsUrl)
          console.log('TS segment (' + ts.length + ' chars)')
        } catch (e) {
          console.log('FAILED:', e.message)
        }
      }
    } catch (e) {
      console.log('FAILED:', e.message)
    }
  }
  
  // Check all unique domains in the master playlist
  console.log('\n=== UNIQUE DOMAINS ===')
  const domains = new Set()
  const urlRe = /https?:\/\/([^/]+)/g
  let m
  while ((m = urlRe.exec(master)) !== null) {
    domains.add(m[1])
  }
  for (const d of domains) {
    console.log('Domain:', d)
  }
  
  // Check if there are video stream URLs (not just audio)
  console.log('\n=== ALL STREAM URLs ===')
  const streamRe = /URI="([^"]+)"/g
  while ((m = streamRe.exec(master)) !== null) {
    console.log('Stream:', m[1].substring(0, 120))
  }
  
  // Check for EXT-X-STREAM-INF (video quality levels)
  console.log('\n=== VIDEO QUALITY LEVELS ===')
  const qualityRe = /#EXT-X-STREAM-INF:([^\n]+)\n([^\n]+)/g
  while ((m = qualityRe.exec(master)) !== null) {
    console.log('Quality:', m[1].substring(0, 100))
    console.log('URL:', m[2].substring(0, 120))
  }
}

main().catch(console.error)