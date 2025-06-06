import mongoose from 'mongoose'
import dotenv from 'dotenv'
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
