import express from 'express'
import { produceMessage } from '../producer/producer.js'
import { connectToMongoDB } from '../config/mongodbConfig.js'
import Chat from '../models/chatModel.js'

const app = express()
const port = 3000

app.use(express.json())

app.post('/sendMessage', async (req, res) => {
   try {
      const { message } = req.body

      if (!message) {
         return res.status(400).json({ error: 'Invalid request. Message are required.' })
      }

      await connectToMongoDB()

      const lastDocument = await Chat.findOne({}, {}, { sort: { uniqueId: -1 } })
      const uniqueId = lastDocument ? lastDocument.uniqueId + 1 : 0

      await produceMessage(message, uniqueId)

      return res.status(200).json({ success: true, message: 'Message sent to Kafka' })
   } catch (error) {
      console.error('Error sending message to Kafka:', error)
      return res.status(500).json({ success: false, error: 'Internal Server Error' })
   }
})

app.listen(port, () => {
   console.log(`API server listening at http://localhost:${port}`)
})
