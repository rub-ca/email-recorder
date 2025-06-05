// routes/authRoutes.js
import express from 'express'
import { register, login, refreshToken, logout, getAllowed } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/refresh', refreshToken)
authRouter.post('/logout', logout)
authRouter.get('/allowed', getAllowed)

export default authRouter
