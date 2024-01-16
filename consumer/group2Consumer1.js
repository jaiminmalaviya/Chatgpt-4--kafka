import kafka from '../config/kafkaConfig.js'
import { connectToMongoDB } from '../config/mongodbConfig.js'
import { sendToOpenAI } from '../integrations/openaiIntegration.js'
import Chat from '../models/chatModel.js'

const consumer = kafka.consumer({ groupId: 'openai-group' })

const runOpenAIConsumer = async () => {
   await connectToMongoDB()

   await consumer.connect()
   await consumer.subscribe({ topic: 'prompt', fromBeginning: true })

   await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
         try {
            const { message: messageContent, uniqueId } = JSON.parse(message.value.toString())

            const openAIResponse = await sendToOpenAI(messageContent)

            const chatDocument = await Chat.findOne({ uniqueId })
            if (chatDocument) {
               await Chat.updateOne({ _id: chatDocument._id }, { $set: { answer: openAIResponse } })
            } else {
               console.warn('Chat document not found for uniqueId:', uniqueId)
            }

            console.log({
               partition,
               offset: message.offset,
               messageContent,
               openAIResponse,
            })
         } catch (error) {
            console.error('Error:', error)
         }
      },
   })
}

runOpenAIConsumer().catch((error) => {
   console.error('Error starting OpenAI consumer:', error)
})
