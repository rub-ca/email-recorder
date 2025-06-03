import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { QdrantClient } from '@qdrant/js-client-rest'
dotenv.config()

export async function connectDB () {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('- Conexión a MongoDB establecida. ✅')
    console.log('\n')
  } catch (err) {
    console.error('Error conectando a MongoDB:', err)
    process.exit(1)
  }
}

export async function connectVectorDB () {
  const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
  })

  try {
    const result = await qdrantClient.getCollections()
    console.log('- Conexión a Qdrant establecida. ✅')
    console.log('       - List of collections:', result.collections)
    console.log('\n')
  } catch (err) {
    console.error('Could not get collections:', err)
    process.exit(1)
  }
  return qdrantClient
}
