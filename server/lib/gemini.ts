
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Gemini API key must be provided in the environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateQuiz(subject: string, grade: number, difficulty: string, numQuestions: number) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Generate a quiz with ${numQuestions} questions for a grade ${grade} student on the subject of ${subject}.
    The difficulty level should be ${difficulty}.
    Each question must have a question text, four options (A, B, C, D), the correct answer, and a short explanation or hint.
    Return the quiz as a JSON object with a single key "questions" which is an array of question objects.
    Each question object should have the following structure: { "question": "...", "options": { "A": "...", "B": "...", "C": "...", "D": "..." }, "answer": "...", "explanation": "..." }.
    Do not include any other text or explanations in your response, only the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    // Clean the response to get only the JSON part
    const jsonText = text.replace(/```json|```/g, '').trim();
    const quiz = JSON.parse(jsonText);
    return quiz;
  } catch (error) {
    console.error('Error generating quiz from Gemini API:', error);
    throw new Error('Failed to generate quiz.');
  }
}
