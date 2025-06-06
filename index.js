import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import dotenv from 'dotenv'

import { connectDB } from './config/db.js'

import { authMiddleware } from './middlewares/authMiddleware.js'

import authRoutes from './routes/authRoutes.js'
import emailRoutes from './routes/emailRoutes.js'
import talkRoutes from './routes/talkRoutes.js'
import allowedRoutes from './routes/allowedRoutes.js'

import { logger } from './logs/logger.js'

dotenv.config()

const PORT = process.env.PORT

const app = express()

connectDB()

app.use(express.json())

app.disable('x-powered-by')

app.use(cors({
  origin: `http://localhost:${PORT}`,
  credentials: true
}))

app.use(cookieParser())

app.use(logger)

// Public routes
app.use(express.static('public'))
app.use('/api/auth', authRoutes)

app.use(authMiddleware)

// Private routes
app.use('/api/email', emailRoutes)
app.use('/api/talk', talkRoutes)
app.use('/api/allowed', allowedRoutes)

app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint no encontrado' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log('\n')
  console.log(`- Servidor en ejecución en puerto ${PORT} ✅`)
  console.log('\n')
})
