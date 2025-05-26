import express from 'express'
import { save } from '../controllers/emailController.js'

const emailRouter = express.Router()

emailRouter.post('/save', save)

export default emailRouter
