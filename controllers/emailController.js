// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import Email from '../models/Email.js'
import User from '../models/User.js'
dotenv.config()

export async function save (req, res) {
    try {
        // Tenemos que mirar si existe el username al que va dirigido
        // Tenemos que mirar que ese usuario tenga habilitada la direccion de origen
        const { n8nKey, to, id, threadId, subject, from, compressed } = req.body

        if (!n8nKey || n8nKey !== process.env.N8N_KEY) {
            return res.status(401).json({ message: 'Clave de n8n inválida' })
        }

        const username = to
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        const email = new Email({
            to,
            id,
            threadId,
            from,
            subject: subject || '',
            compressed: compressed || ''
        })

        await email.save()
        res.status(201).json({ message: 'OK' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error' })
    }
}
