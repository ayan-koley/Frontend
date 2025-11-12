import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../shared/schema';
import { eq, and, ilike } from 'drizzle-orm';
import { IStorage } from './IStorage'; // We'll define this interface in a new file

// Database connection
console.log("DATABASE_URL:", process.env.DATABASE_URL);
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<schema.User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<schema.User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, username));
    return result[0];
  }

  async createUser(user: schema.InsertUser): Promise<schema.User> {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  }

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await db.insert(schema.otp_codes).values({ email, code: otp, expires_at: expiresAt });
    return otp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const result = await db.select().from(schema.otp_codes).where(and(eq(schema.otp_codes.email, email), eq(schema.otp_codes.code, otp)));
    const otpRecord = result[0];

    if (otpRecord && otpRecord.expires_at > new Date()) {
      await db.update(schema.users).set({ is_verified: true }).where(eq(schema.users.email, email));
      await db.delete(schema.otp_codes).where(eq(schema.otp_codes.id, otpRecord.id));
      return true;
    }
    return false;
  }

  async updateUser(id: string, user: Partial<schema.InsertUser>): Promise<schema.User | undefined> {
    const result = await db.update(schema.users).set(user).where(eq(schema.users.id, id)).returning();
    return result[0];
  }

  // Quiz methods
  async getAllQuizzes(): Promise<schema.Quiz[]> {
    return db.select().from(schema.quizzes);
  }

  async getQuizById(id: string): Promise<schema.Quiz | undefined> {
    const result = await db.select().from(schema.quizzes).where(eq(schema.quizzes.id, id));
    return result[0];
  }

  async getFilteredQuizzes(filters: {
    subject?: string;
    grade?: string;
    difficulty?: string;
    search?: string;
  }): Promise<schema.Quiz[]> {
    const { subject, grade, difficulty, search } = filters;
    const conditions = [];

    if (subject && subject !== "all") {
      conditions.push(eq(schema.quizzes.subject, subject));
    }
    if (grade && grade !== "all") {
      conditions.push(eq(schema.quizzes.grade, grade));
    }
    if (difficulty && difficulty !== "all") {
      conditions.push(eq(schema.quizzes.difficulty, difficulty));
    }
    if (search) {
      // Using ilike for case-insensitive search
      conditions.push(ilike(schema.quizzes.title, `%${search}%`));
    }

    if (conditions.length === 0) {
      return this.getAllQuizzes();
    }

    const query = db.select().from(schema.quizzes).where(and(...conditions));
    return query;
  }

  // Achievement methods
  async getAllAchievements(): Promise<schema.Achievement[]> {
    return db.select().from(schema.achievements);
  }

  // Leaderboard - this is a simplified version. A real implementation would involve aggregation.
  async getLeaderboard(): Promise<schema.LeaderboardEntry[]> {
    const userAttempts = await db.select().from(schema.user_quiz_attempts);
    // This is a placeholder. A real leaderboard would require aggregating scores.
    const placeholderLeaderboard: schema.LeaderboardEntry[] = userAttempts.map((attempt, index) => ({
        id: attempt.user_id || index.toString(),
        username: `user_${attempt.user_id}`.substring(0,10),
        score: attempt.score || 0,
        achievements: 0, // This needs to be calculated
        rank: index + 1,
    }));
    return placeholderLeaderboard.slice(0, 10); // Return top 10
  }

  // Blog methods
  async getAllBlogPosts(): Promise<schema.BlogPost[]> {
    return db.select().from(schema.blog_posts);
  }

  async getBlogPostById(id: string): Promise<schema.BlogPost | undefined> {
    const result = await db.select().from(schema.blog_posts).where(eq(schema.blog_posts.id, id));
    return result[0];
  }

  async getGradeLevels(): Promise<schema.GradeLevel[]> {
      return Promise.resolve([]);
  }
}

export const storage = new DbStorage();