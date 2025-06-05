import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

export async function register (req, res) {
    try {
        const { username, email, password } = req.body
        const emailsAllowed = [email]

        // Check if email or user already exists:
        const existing = await User.findOne({ $or: [{ username }, { email }] })
        if (existing) return res.status(400).json({ message: 'Usuario o email ya en uso' })

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ username, email, hashedPassword, emailsAllowed })
        await user.save()
        res.status(201).json({ message: 'OK' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error' })
    }
}

export async function login (req, res) {
    try {
        const { email, password } = req.body

        // Find user by email:
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' })
        }
        // Check password:
        const isMatch = await bcrypt.compare(password, user.hashedPassword)
        if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' })

        // Generate tokens:
        const payload = { userId: user._id, email: user.email, username: user.username }
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })

         res
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true, // Asegúrate de que el servidor esté usando HTTPS
                sameSite: 'None', // Para entornos con frontend en otro dominio
                maxAge: 15 * 60 * 1000 // 15 minutos
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
            })
            .status(200)
            .json({ message: 'Login exitoso' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error en el servidor' })
    }
}

export async function refreshToken (req, res) {
    const token = req.cookies?.refreshToken

    if (!token) {
        return res.status(401).json({ message: 'Refresh token requerido' })
    }

    try {
        const payloadRefresh = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        const user = await User.findById(payloadRefresh.userId)

        if (!user) {
            return res.status(403).json({ message: 'Refresh token inválido' })
        }

        const payload = {
            userId: user._id,
            email: user.email,
            username: user.username
        }

        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' })

        res
            .cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 15 * 60 * 1000 // 15 minutos
            })
            .status(200)
            .json({ username: user.username })
    } catch (err) {
        console.error(err)
        res.status(401).json({ message: 'Refresh token no válido o expirado' })
    }
}

export async function logout (req, res) {
    try {
        res
            .clearCookie('accessToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            })
            .clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            })
            .status(200)
            .json({ message: 'Logout exitoso' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al cerrar sesión' })
    }
}

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
