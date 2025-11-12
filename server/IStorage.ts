
import * as schema from '../../shared/schema';

// This interface defines the contract for our data storage.
// It's implemented by DbStorage and can be used for mocking in tests.
export interface IStorage {
  // User methods
  getUser(id: string): Promise<schema.User | undefined>;
  getUserByUsername(username: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  generateOtp(email: string): Promise<string>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  updateUser(id: string, user: Partial<schema.InsertUser>): Promise<schema.User | undefined>;

  // Quiz methods
  getAllQuizzes(): Promise<schema.Quiz[]>;
  getQuizById(id: string): Promise<schema.Quiz | undefined>;
  getFilteredQuizzes(filters: {
    subject?: string;
    grade?: string;
    difficulty?: string;
    search?: string;
  }): Promise<schema.Quiz[]>;

  // Achievement methods
  getAllAchievements(): Promise<schema.Achievement[]>;
  getLeaderboard(): Promise<schema.LeaderboardEntry[]>;

  // Blog methods
  getAllBlogPosts(): Promise<schema.BlogPost[]>;
  getBlogPostById(id: string): Promise<schema.BlogPost | undefined>;

  // Grade levels
  getGradeLevels(): Promise<schema.GradeLevel[]>;
}
