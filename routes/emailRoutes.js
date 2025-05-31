import express from 'express'
import { save, getAll } from '../controllers/emailController.js'

const emailRouter = express.Router()

emailRouter.post('/save', save)
emailRouter.get('/all', getAll)

export default emailRouter
