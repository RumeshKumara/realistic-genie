import { GoogleGenerativeAI } from '@google/generative-ai';

// Use VITE_PUBLIC_ prefix for environment variables in Vite projects
const API_KEY = import.meta.env.VITE_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Gemini API key is not configured. Please set VITE_PUBLIC_GEMINI_API_KEY in your environment.');
}

export const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function generateQuestions(
  jobRole: string,
  numQuestions: number,
  experienceLevel: string
) {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    console.log('Calling Gemini API with:', {
      jobRole,
      numQuestions,
      experienceLevel: experienceLevel.toString()
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate ${numQuestions} technical interview questions for a ${jobRole} position with ${experienceLevel} years of experience. 
    Format the response as a JSON array where each question object has:
    - question: the interview question
    - expectedAnswer: detailed expected answer
    - keyPoints: array of key points to look for
    - scoringCriteria: object with max score and array of criteria
    
    Make questions increasingly difficult and relevant to the experience level.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const questions = JSON.parse(text);
      console.log('Parsed questions:', questions);
      return questions;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse generated questions');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  jobRole: string,
  experienceLevel: string
) {
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

export async function generateMassiveQuestionSet() {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate 5 diverse interview questions with a mix of technical and behavioral questions.
    Follow this strict JSON format:
    [
      {
        "question": "detailed question text",
        "expectedAnswer": "comprehensive model answer",
        "keyPoints": ["key point 1", "key point 2", "key point 3"],
        "scoringCriteria": {
          "max": 100,
          "criteria": ["criterion 1", "criterion 2", "criterion 3"]
        }
      }
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean and parse the response
      const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(jsonString);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }
      
      return parsed;
    } catch (error) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Failed to parse question set');
    }
  } catch (error) {
    console.error('Error generating massive question set:', error);
    throw error;
  }
}