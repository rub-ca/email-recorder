// routes/authRoutes.js
import express from 'express'
import { register, login, refreshToken } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/refresh', refreshToken)

export default authRouter
