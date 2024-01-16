import OpenAI from 'openai'
import dot from 'dotenv'

dot.config({ path: '../.env' })

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function sendToOpenAI(messages) {
   try {
      const completion = await openai.chat.completions.create({
         messages: [
            {
               role: 'system',
               content: 'You are a helpful assistant designed to output text in correct format.',
            },
            { role: 'user', content: messages },
         ],
         model: 'gpt-4',
      })
      const responseContent = completion.choices[0].message.content
      return responseContent
   } catch (error) {
      throw error
   }
}
