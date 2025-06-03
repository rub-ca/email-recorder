import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function save (req, res) {
    res.status(200).json({
        message: 'Vector guardado correctamente',
        data: req.body
    })
    const embedding = await embedChunk('Este es un texto de prueba')
    console.dir(embedding)
}

async function embedChunk (text) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
    })
    return response.data[0].embedding
}
