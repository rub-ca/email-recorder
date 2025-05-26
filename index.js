import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()
const app = express()
connectDB()

app.use(express.json())
app.disable('x-powered-by')

const PORT = process.env.PORT

app.use('/api/auth', authRoutes)

app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint no encontrado' })
})
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Error interno del servidor' })
})

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en puerto ${PORT}`)
})
