import dotenv from 'dotenv'

dotenv.config()

export async function message (req, res) {
    res.json({ message: 'message endpoint not implemented' })
}
