import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
)

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

    console.log(text)

    try {

      const cleanText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

      const question = JSON.parse(cleanText)

      res.json(question)

    } catch (jsonError) {

      console.log('JSON PARSE ERROR')

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

app.listen(3001, () => {
  console.log('SERVER STARTED ON PORT 3001')
})