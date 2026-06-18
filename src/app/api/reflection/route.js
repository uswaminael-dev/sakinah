import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
)

export async function POST(req) {
  try {
    const { reflection } = await req.json()

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    })

    const result = await model.generateContent(`
You are a compassionate Islamic journaling companion.

Generate exactly 3 thoughtful reflection questions based on the journal entry below.

Journal Entry:
${reflection}
`)

    return Response.json({
      questions: result.response.text(),
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    )
  }
}