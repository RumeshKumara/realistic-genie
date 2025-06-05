import { generateQuestions } from './gemini';

export async function generateInterviewQuestions(
  jobRole: string,
  numQuestions: number,
  experienceLevel: string
) {
  try {
    console.log('Generating questions with params:', {
      jobRole,
      numQuestions,
      experienceLevel
    });

    const questions = await generateQuestions(
      jobRole,
      numQuestions,
      experienceLevel
    );

    console.log('Generated questions result:', questions);
    return questions;

  } catch (error) {
    console.error('Error in generateInterviewQuestions:', error);
    throw new Error('Failed to generate interview questions. Please check your configuration and try again.');
  }
}
