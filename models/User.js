import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    checkEmailsAllowed: { type: Boolean, default: true },
    emailsAllowed: [{ type: String, required: false }]
})

const User = mongoose.model('User', userSchema)
export default User
