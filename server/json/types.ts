
export interface JSONQuestion {
    id: string;
    metadata: {
      subject: string;
      topic: string;
      subtopic?: string;
      grade: number[];
      difficulty: 'Easy' | 'Medium' | 'Hard';
      examTypes: string[];
      countries: string[];
      tags: string[];
    };
    question: {
      type: 'mcq' | 'numeric' | 'essay' | 'match' | 'order';
      content: any; // JSON content for the question
      maxScore: number;
    };
    statistics?: {
      timesAttempted: number;
      averageScore: number;
      averageTimeSpent: number;
      difficultyRating: number;
    };
  }
  
  export interface QuizConfiguration {
    type: 'full' | 'subject' | 'topic';
    metadata: {
      grade: number;
      examType: string;
      country: string;
      subject?: string;
      topic?: string;
      duration: number;
    };
    settings: {
      questionCount: number;
      difficultyDistribution: {
        easy: number;
        medium: number;
        hard: number;
      };
      shuffleQuestions: boolean;
      showFeedback: boolean;
      timePerQuestion?: number;
    };
  }
  
  export interface QuizSession {
    id: string;
    userId: string;
    configurationId: string;
    startTime: Date;
    endTime?: Date;
    questions: {
      jsonQuestionId: string;
      userResponse?: string;
      score?: number;
      timeSpent?: number;
      attempts?: number;
    }[];
    status: 'active' | 'completed' | 'abandoned';
    finalScore?: number;
    analytics?: {
      accuracyByTopic: Record<string, number>;
      timeDistribution: Record<string, number>;
      strengths: string[];
      weaknesses: string[];
    };
  }
