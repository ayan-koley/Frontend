import { supabase } from '../lib/supabase';
import { generateQuiz as generateQuizFromAI } from '../lib/gemini';

class QuizService {
  async generateQuiz(subject: string, grade: number, difficulty: string, numQuestions: number) {
    try {
      const quiz = await generateQuizFromAI(subject, grade, difficulty, numQuestions);
      return quiz;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  async saveQuiz(quizData: any) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert([quizData])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error saving quiz:', error);
      throw new Error('Failed to save quiz');
    }
  }

  async getQuizById(id: string) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error getting quiz by id:', error);
      throw new Error('Failed to get quiz by id');
    }
  }

  async getAllQuizzes() {
    try {
      const { data, error } = await supabase.from('quizzes').select('*');

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error getting all quizzes:', error);
      throw new Error('Failed to get all quizzes');
    }
  }
}

export const quizService = new QuizService();