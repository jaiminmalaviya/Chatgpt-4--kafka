import kafka from '../config/kafkaConfig.js'
import { connectToMongoDB } from '../config/mongodbConfig.js'
import Chat from '../models/chatModel.js'

const consumer = kafka.consumer({ groupId: 'mongo-group' })

const runMongoConsumer = async () => {
   await connectToMongoDB()

   await consumer.connect()
   await consumer.subscribe({ topic: 'prompt', fromBeginning: true })

   await consumer.run({
      eachMessage: async ({ message }) => {
         try {
            const { message: messageContent, uniqueId } = JSON.parse(message.value.toString())

            const newMessage = new Chat({ content: messageContent, uniqueId })
            await newMessage.save()

            console.log('Message saved to MongoDB:', messageContent)
         } catch (error) {
            console.error('Error processing message:', error)
         }
      },
   })
}

runMongoConsumer().catch((error) => {
   console.error('Error starting MongoDB consumer:', error)
})
