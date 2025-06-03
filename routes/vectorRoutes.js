import express from 'express'
import { save } from '../controllers/vectorController.js'

const vectorRouter = express.Router()

vectorRouter.post('/save', save)

export default vectorRouter
