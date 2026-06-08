import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

app.post('/story', async (req, res) => {

  try {

    const { prompt } = req.body

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash'
    })

    const result = await model.generateContent(prompt)

    const response = await result.response
    const text = response.text()

    res.json({
      text
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Ошибка Gemini'
    })

  }

})

app.listen(3001, () => {
  console.log('SERVER STARTED ON PORT 3001')
})
