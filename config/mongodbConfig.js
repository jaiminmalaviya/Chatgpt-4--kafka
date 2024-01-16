import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const connectToMongoDB = async () => {
   try {
      const url = process.env.MONGODB_URI

      await mongoose.connect(url, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      console.log('Connected to MongoDB')
   } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      process.exit(1)
   }
}

export { connectToMongoDB }
