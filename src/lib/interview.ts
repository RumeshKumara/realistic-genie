import { generateQuestions } from './gemini';

export async function generateInterviewQuestions(
  jobRole: string,
  experienceLevel: string,
  numberOfQuestions: number = 5
) {
  try {
    if (!jobRole || !experienceLevel) {
      throw new Error('Job role and experience level are required');
    }

    const questions = await generateQuestions(jobRole, numberOfQuestions, experienceLevel);
    return questions;
  } catch (error) {
    console.error('Error in generateInterviewQuestions:', error);
    throw new Error('Failed to generate interview questions. Please check your configuration and try again.');
  }
}
