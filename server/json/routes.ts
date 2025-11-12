import { Router } from 'express';
import { quizService } from './service';

const router = Router();

router.post('/generate-quiz', async (req, res) => {
  try {
    const { subject, grade, difficulty, numQuestions } = req.body;
    if (!subject || !grade || !difficulty || !numQuestions) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    const quiz = await quizService.generateQuiz(subject, grade, difficulty, numQuestions);
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

router.post('/save-quiz', async (req, res) => {
  try {
    const quizData = req.body;
    if (!quizData) {
      return res.status(400).json({ error: 'Missing quiz data' });
    }
    const savedQuiz = await quizService.saveQuiz(quizData);
    res.json(savedQuiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save quiz' });
  }
});

router.get('/get-quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing quiz id' });
    }
    const quiz = await quizService.getQuizById(id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quiz' });
  }
});

router.get('/get-all-quizzes', async (req, res) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get all quizzes' });
  }
});

export default router;