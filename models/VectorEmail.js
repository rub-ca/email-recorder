import OpenAI from 'openai'
import { connectVectorDB } from '../config/db.js'
import { encoding_for_model as encoding } from '@dqbd/tiktoken'

const maxTokens = 800
const enc = await encoding('text-embedding-3-small')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const qdrantClient = connectVectorDB()

export async function saveVectorEmail (cleaned, emailId, username) {
    const sentences = chunkText(cleaned)

    for (const sentence of sentences) {
        console.dir(sentence)
        const embedding = await embedChunk(cleaned)
        console.dir(embedding)
        indexSentence('emails', sentence, embedding, emailId, username)
    }
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

async function indexSentence (collectionName, sentence, embedding, emailId, username) {
    const pointId = `${username}-${emailId}-${Math.random().toString(36).slice(2, 11)}`

    await qdrantClient.upsertPoints(collectionName, {
        wait: true,
        points: [
            {
                id: pointId,
                vector: embedding,
                payload: {
                    emailId,
                    username,
                    text: sentence
                }
            }
        ]
    })
    console.log(`Indexed sentence in Qdrant with ID ${pointId}.`)
}

function chunkText (text) {
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]

    const chunks = []
    let currentChunk = ''
    let currentTokenCount = 0

    for (const sentence of sentences) {
        const tokenCount = enc.encode(sentence).length

        if (currentTokenCount + tokenCount > maxTokens) {
            chunks.push(currentChunk.trim())
            currentChunk = sentence
            currentTokenCount = tokenCount
        } else {
            currentChunk += ' ' + sentence
            currentTokenCount += tokenCount
        }
    }

    if (currentChunk) chunks.push(currentChunk.trim())

    return chunks
}
