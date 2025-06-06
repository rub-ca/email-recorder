import express from 'express'
import { getAllowed, postAllowed, deleteAllowed } from '../controllers/allowedController.js'

const allowedRouter = express.Router()

allowedRouter.get('/', getAllowed)
allowedRouter.post('/', postAllowed)
allowedRouter.delete('/', deleteAllowed)

export default allowedRouter
