console.log("FILE REALLY RUNNING")

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import crypto from 'crypto'
import https from 'https'
import http from 'http'

dotenv.config()

const app = express()
console.log("MY SERVER VERSION")

app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
)

//
// MOVIE QUIZ
//
app.get('/movie-question', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash'
    })

    const prompt = `
Create ONE movie quiz question.

Return ONLY valid JSON.

Format:
{
  "description": "short movie description",
  "options": [
    "movie 1",
    "movie 2",
    "movie 3",
    "movie 4"
  ],
  "correctAnswer": "correct movie"
}

Rules:
- famous movies only
- short descriptions
- exactly 4 options
- only 1 correct answer
- no markdown
- no explanations
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      const cleanText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

      const question = JSON.parse(cleanText)
      res.json(question)

    } catch {
      res.json({
        description:
          'Фильм о человеке, который понял, что живёт в симуляции.',
        options: [
          'Интерстеллар',
          'Матрица',
          'Начало',
          'Бегущий по лезвию'
        ],
        correctAnswer: 'Матрица'
      })
    }

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Failed to generate movie question'
    })
  }
})

//
// SIGNING
//
const SECRET_KEY = "nwS1u7oJW2Nvf1XIMEnaqSzYxF82HCAL"
const APP_VERSION_CODE = 33
const PLATFORM = "android"

function b64url_nopad(data) {
  return Buffer.from(data).toString('base64url')
}

function hashBody(body) {
  return crypto
    .createHash('sha256')
    .update(body, 'utf8')
    .digest('hex')
}

function getTimestamp() {
  return String(Date.now())
}

function getNonce() {
  return b64url_nopad(
    crypto.randomBytes(16)
  )
}

function extractPathForSigning(url) {
  const parsed = new URL(url)

  const path = parsed.pathname || '/'

  const params = new URLSearchParams(
    parsed.search
  )

  const filtered = new URLSearchParams()

  for (const [k, v] of params.entries()) {
    if (!k.startsWith('_ap_')) {
      filtered.append(k, v)
    }
  }

  const query = filtered.toString()

  return query
    ? path + '?' + query
    : path
}

function buildPayload(
  method,
  path,
  bodyHash,
  timestamp,
  nonce,
  versionCode
) {
  return [
    method,
    path,
    bodyHash,
    timestamp,
    nonce,
    versionCode
  ].join('\n')
}

function computeSignature(payload) {
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload, 'utf8')
    .digest('base64url')
}

function signUrl(
  method,
  url,
  body = '',
  versionCode = APP_VERSION_CODE
) {
  method = method.trim().toUpperCase()

  const path = extractPathForSigning(url)
  const bodyHash = hashBody(body)
  const timestamp = getTimestamp()
  const nonce = getNonce()
  const versionStr = String(versionCode)

  const payload = buildPayload(
    method,
    path,
    bodyHash,
    timestamp,
    nonce,
    versionStr
  )

  const signature = computeSignature(payload)

  const params = {
    _ap_platform: PLATFORM,
    _ap_ts: timestamp,
    _ap_nonce: nonce,
    _ap_v: versionStr,
    _ap_body: bodyHash,
    _ap_sig: signature
  }

  const parsed = new URL(url)

  for (const [k, v] of Object.entries(params)) {
    parsed.searchParams.set(k, v)
  }

  return parsed.toString()
}

//
// HTTP GET
//
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https')
      ? https
      : http

    mod.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return httpGet(
            res.headers.location
          )
            .then(resolve)
            .catch(reject)
        }

        let data = ''

        res.on('data', chunk => {
          data += chunk
        })

        res.on('end', () => {
          resolve(data)
        })
      }
    ).on('error', reject)
  })
}

//
// SEARCH MOVIE BY TITLE
//
app.get('/search-movie', async (req, res) => {
  try {
    const { title } = req.query

    if (!title) {
      return res.status(400).json({
        error: 'title query parameter required'
      })
    }

    const searchUrl = signUrl(
      'GET',
      `https://api.lateremb.ws/search?q=${encodeURIComponent(title)}`
    )

    console.log('Search URL:', searchUrl)

    const searchData = await httpGet(searchUrl)
    const searchJson = JSON.parse(searchData)

    console.log('Search results count:', searchJson.totalCount)

    // API returns { totalCount, items: [...] }
    const items = searchJson.items || []

    if (items.length === 0) {
      return res.status(404).json({
        error: 'No results found'
      })
    }

    // Return first result with provider ID
    const firstResult = items[0]

    res.json({
      providerId: firstResult.id,
      title: firstResult.name,
      originalTitle: firstResult.origin_name,
      year: firstResult.year,
      poster: firstResult.poster,
      totalResults: searchJson.totalCount
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to search movie'
    })
  }
})

//
// WATCH STREAM
//
app.get('/watch-stream/:id', async (req, res) => {
  try {
    const { id } = req.params

    const infoUrl = signUrl(
      'GET',
      `https://api.lateremb.ws/info/${id}`
    )

    const infoData = await httpGet(infoUrl)

    console.log("=== RAW API RESPONSE ===")
    console.log(JSON.stringify(infoData, null, 2))
    console.log("========================")

    const infoJson = JSON.parse(infoData)

    console.log("=== PARSED JSON ===")
    console.log(JSON.stringify(infoJson, null, 2))
    console.log("===================")

    console.log("Available keys:", Object.keys(infoJson))

    const iframeUri = infoJson.iframe_uri

    if (!iframeUri) {
      console.log("iframe_uri not found in response")
      console.log("Checking for alternative field names...")
      
      // Check for common alternatives
      const alternatives = ['iframeUrl', 'embedUrl', 'embed_uri', 'url', 'stream_url', 'player_url']
      for (const alt of alternatives) {
        if (infoJson[alt]) {
          console.log(`Found alternative field: ${alt} = ${infoJson[alt]}`)
        }
      }
      
      return res.status(404).json({
        error: 'iframe_uri not found',
        availableKeys: Object.keys(infoJson),
        fullResponse: infoJson
      })
    }

    console.log("Returning embed URL:", iframeUri)

    res.json({
      embedUrl: iframeUri
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to get embed URL'
    })
  }
})

//
// TEST STREAM
//
app.get('/stream/:id', (req, res) => {
  res.json({
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  })
})

//
// START SERVER
//
console.log("BEFORE APP LISTEN")

app.listen(3001, () => {
  console.log(
    'SERVER STARTED ON PORT 3001'
  )
})