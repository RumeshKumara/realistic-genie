import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateQuestions(jobRole: string, numberOfQuestions: number, experienceLevel: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate ${numberOfQuestions} unique and challenging interview questions for a ${jobRole} position with ${experienceLevel} of experience. Include a mix of technical and behavioral questions.

    For each question, provide:
    1. The question itself
    2. Expected key points in the answer
    3. Evaluation criteria
    4. Maximum score (out of 100)

    Format as JSON array with objects:
    {
      "question": "string",
      "expectedAnswer": "string",
      "keyPoints": ["string"],
      "scoringCriteria": {
        "max": number,
        "criteria": ["string"]
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }
      return parsed;
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      throw new Error('Failed to generate questions');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function evaluateAnswer(question: string, answer: string, jobRole: string, experienceLevel: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Evaluate this ${jobRole} interview answer (${experienceLevel} experience level):

    Question: ${question}
    Answer: ${answer}

    Provide a detailed evaluation in JSON format:
    {
      "score": number (0-100),
      "feedback": "detailed feedback string",
      "improvements": ["array of specific improvement suggestions"]
    }

    Focus on:
    1. Completeness of the answer
    2. Technical accuracy
    3. Communication clarity
    4. Practical examples provided`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      throw new Error('Failed to evaluate answer');
    }
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
}