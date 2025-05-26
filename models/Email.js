import mongoose from 'mongoose'

const emailSchema = new mongoose.Schema({
    to: { type: String, required: true },
    id: { type: String, required: true },
    threadId: { type: String, required: true },
    from: { type: String, required: true },
    subject: { type: String, required: false },
    compressed: { type: String, required: false }
})

const Email = mongoose.model('Email', emailSchema)
export default Email
