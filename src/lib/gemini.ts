import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Gemini API key is not configured. Please check your .env file.');
}

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateQuestions(jobRole: string, numberOfQuestions: number, experienceLevel: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const cleanJobRole = jobRole.trim();
    const cleanExperience = experienceLevel.trim();

    const prompt = `Generate ${numberOfQuestions} interview questions for a ${cleanJobRole} position with ${cleanExperience} experience level.
    Format the response as a JSON array with each question object having this structure:
    {
      "question": "Technical or behavioral question",
      "expectedAnswer": "Detailed model answer",
      "keyPoints": ["Key concept 1", "Key concept 2", "Key concept 3"],
      "scoringCriteria": {
        "max": 100,
        "criteria": ["Evaluation point 1", "Evaluation point 2", "Evaluation point 3"]
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const parsed = JSON.parse(jsonStr);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Invalid response format');
      }

      // Validate and clean each question object
      return parsed.map(q => ({
        question: q.question || 'Question not provided',
        expectedAnswer: q.expectedAnswer || 'Answer not provided',
        keyPoints: Array.isArray(q.keyPoints) ? q.keyPoints : [],
        scoringCriteria: {
          max: q.scoringCriteria?.max || 100,
          criteria: Array.isArray(q.scoringCriteria?.criteria) ? q.scoringCriteria.criteria : []
        }
      }));
    } catch (error) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Invalid response format from AI');
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

export async function generateMassiveQuestionSet() {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
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