import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function authMiddleware (req, res, next) {
    try {
        const token = req.cookies?.accessToken

        if (!token) {
            return res.status(401).json({ message: 'Access token requerido' })
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(payload.userId)

        if (!user) {
            return res.status(403).json({ message: 'Usuario no encontrado' })
        }

        req.user = user
        next()
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error en el authMiddleware' })
    }
}
