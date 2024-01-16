import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
   {
      content: { type: String, required: true },
      answer: { type: String },
      uniqueId: { type: Number, unique: true, required: true },
   },
   {
      timestamps: true,
      versionKey: false,
   }
)

const Chat = mongoose.model('Chat', chatSchema)

export default Chat
