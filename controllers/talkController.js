import dotenv from 'dotenv'
import { QdrantClient } from '@qdrant/js-client-rest'
import OpenAI from 'openai'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
})

export async function message (req, res) {
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
        const { message } = req.body
        if (!message) return res.status(400).json({ error: 'Falta el campo message' })

        // 1. Obtener embedding de la pregunta
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: message
        })

        const embedding = embeddingResponse.data[0].embedding

        const result = await qdrantClient.search('emails', {
            vector: embedding,
            limit: 1,
            with_payload: true,
            filter: {
                must: [
                    {
                        key: 'username',
                        match: {
                            value: user
                        }
                    }
                ]
            }
        })

        const contexts = result.map(r => r.payload.text).filter(Boolean)

        if (contexts.length === 0) {
            return res.status(404).json({ message: 'No se encontraron resultados relevantes' })
        }

        // 3. Armar el contexto para el modelo
        const contextText = contexts.map((text, i) => `Correo :\n${text}`).join('\n\n')

        const systemPrompt = 'Tienes acceso a fragmentos de correos electrónicos. Usa esta información para responder de forma precisa la pregunta del usuario.'

        const userPrompt = `Correos relevantes:\n${contextText}\n\nPregunta: ${message}`

        // 4. Generar respuesta con el modelo
        const chatResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })

        const respuesta = chatResponse.choices[0].message.content

        // 5. Enviar respuesta al cliente
        return res.status(200).json({ answer: respuesta, result })
    } catch (error) {
        console.error('Error al procesar el mensaje:', error)
        return res.status(500).json({ error: 'Error al procesar el mensaje' })
    }
}
