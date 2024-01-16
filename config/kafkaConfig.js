import { Kafka, logLevel } from 'kafkajs'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const kafka = new Kafka({
   clientId: process.env.KAFKA_CLIENT_ID,
   brokers: [process.env.KAFKA_BROKERS],
   ssl: process.env.KAFKA_SSL === 'true',
   sasl: {
      mechanism: process.env.KAFKA_SASL_MECHANISM,
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
   },
   logLevel: logLevel.ERROR,
})

export default kafka
