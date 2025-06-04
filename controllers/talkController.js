import dotenv from 'dotenv'
import { QdrantClient } from '@qdrant/js-client-rest'
import OpenAI from 'openai'

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
        const { message } = req.body
        if (!message) return res.status(400).json({ error: 'Falta el campo message' })

        // 1. Obtener embedding de la pregunta
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: message
        })

        const embedding = embeddingResponse.data[0].embedding

        // 2. Buscar los 3 textos más relevantes en Qdrant
        const result = await qdrantClient.search('emails', {
            vector: embedding,
            limit: 3,
            with_payload: true
        })

        const contexts = result.map(r => r.payload.text).filter(Boolean)

        if (contexts.length === 0) {
            return res.status(404).json({ message: 'No se encontraron resultados relevantes' })
        }

        // 3. Armar el contexto para el modelo
        const contextText = contexts.map((text, i) => `Correo ${i + 1}:\n${text}`).join('\n\n')

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
        return res.status(200).json({ answer: respuesta, contexts })
    } catch (error) {
        console.error('Error al procesar el mensaje:', error)
        return res.status(500).json({ error: 'Error al procesar el mensaje' })
    }
}
