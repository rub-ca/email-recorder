import express from 'express'
import { register, login, refreshToken, logout } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/refresh', refreshToken)
authRouter.post('/logout', logout)

export default authRouter
