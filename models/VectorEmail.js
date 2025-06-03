import OpenAI from 'openai'
import { connectVectorDB } from '../config/db.js'
import tokenizer from 'sbd'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const qdrantClient = connectVectorDB()

export async function saveVectorEmail (cleaned) {
    const sentences = tokenizer.sentences(cleaned, { newline_boundaries: false })
    console.log(sentences)
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
