import express from 'express'
import { message } from '../controllers/talkController.js'

const talkRouter = express.Router()

talkRouter.post('/message', message)

export default talkRouter
