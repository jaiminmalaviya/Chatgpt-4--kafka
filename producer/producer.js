import kafka from '../config/kafkaConfig.js'

const producer = kafka.producer()

export const produceMessage = async (message, uniqueId) => {
   try {
      await producer.connect()

      await producer.send({
         topic: 'prompt',
         messages: [{ value: JSON.stringify({ message, uniqueId }) }],
      })

      console.log('Message sent successfully')
   } catch (error) {
      console.error('Error:', error)
   }
}
