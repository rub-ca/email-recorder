import OpenAI from 'openai'
import { QdrantClient } from '@qdrant/js-client-rest'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
})

try {
    const result = await qdrantClient.getCollections()
    console.log('List of collections:', result.collections)
} catch (err) {
    console.error('Could not get collections:', err)
}

export async function saveVectorEmail (cleaned) {
    const embedding = await embedChunk(cleaned)
    console.dir(embedding)
}

async function embedChunk (text) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
    })
    return response.data[0].embedding
}

// const { QdrantClient } = require("@qdrant/js-client-rest");

// const client = new QdrantClient({ url: "http://localhost:6333" });

// async function uploadEmbedding(id, vector, payload) {
//   await client.upsert("emails", {
//     points: [
//       {
//         id,
//         vector,
//         payload // { subject: ..., date: ..., etc. }
//       }
//     ]
//   });
// }
