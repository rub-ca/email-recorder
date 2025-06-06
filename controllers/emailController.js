import jwt from 'jsonwebtoken'
// import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import Email from '../models/Email.js'
import User from '../models/User.js'
import { saveVectorEmail } from '../models/VectorEmail.js'
dotenv.config()

export async function save (req, res) {
    try {
        const { n8nKey, to, id, threadId, subject, from, compressed, cleaned } = req.body

        if (!n8nKey || n8nKey !== process.env.N8N_KEY) {
            return res.status(401).json({ message: 'Clave de n8n inválida' })
        }

        const username = to
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        // Check if the email is allowed:
        if (user.checkEmailsAllowed && !user.emailsAllowed.includes(from)) {
            return res.status(403).json({ message: 'Email not allowed' })
        }

        // Check if there is an email with the same id:
        const existingEmail = await Email.findOne({ id })
        if (existingEmail) {
            return res.status(400).json({ message: 'Email with this ID already exists' })
        }

        // Check if the threadId is already used:
        const existingThread = await Email.findOne({ threadId })
        if (existingThread && compressed && existingThread.compressed) {
            if (compressed.length <= existingThread.compressed.length) {
                return res.status(400).json({ message: 'Compressed email is not longer than existing one' })
            } else {
                await Email.deleteOne({ threadId })
            }
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
        await saveVectorEmail(cleaned, id, username)
        return res.status(201).json({ message: 'OK' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Error' })
    }
}

export async function getAll (req, res) {
    const token = req.cookies.accessToken

    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        const username = req.user.username

        Email.find({ to: username })
            .then(emails => {
                if (emails.length === 0) {
                    return res.status(404).json({ message: 'No emails found' })
                }
                res.status(200).json({ emails })
            })
            .catch(err => {
                console.error('Error retrieving emails:', err)
                res.status(500).json({ message: 'Error retrieving emails' })
            })
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' })
    }
}
