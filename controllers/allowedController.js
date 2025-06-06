import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

export async function getAllowed (req, res) {
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

        res.status(200).json({ emailsAllowed: user.emailsAllowed })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener emails permitidos' })
    }
}

export async function postAllowed (req, res) {
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

        const { email } = req.body
        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Email inválido' })
        }

        // Add email to allowed list if not already present
        if (!user.emailsAllowed.includes(email)) {
            user.emailsAllowed.push(email)
            await user.save()
        }

        res.status(200).json({ emailsAllowed: user.emailsAllowed })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al agregar email permitido' })
    }
}

export async function deleteAllowed (req, res) {
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

        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: 'Email inválido' })
        }

        // Remove email from allowed list if present
        user.emailsAllowed = user.emailsAllowed.filter(e => e !== email)
        await user.save()

        res.status(200).json({ emailsAllowed: user.emailsAllowed })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al eliminar email permitido' })
    }
}
