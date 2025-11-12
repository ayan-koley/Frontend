import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "../../shared/schema";
import bcrypt from "bcrypt";
import jsonRoutes from "./json/routes";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, country, state, address, pin_code, mobile_number, role } = insertUserSchema.parse(req.body);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        country,
        state,
        address,
        pin_code,
        mobile_number,
        role,
      });
      res.json({ message: "User created successfully", userId: user.id });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  app.post("/api/auth/generate-otp", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const otp = await storage.generateOtp(email);
      // In a real application, you would send this OTP via email/SMS
      console.log(`Generated OTP for ${email}: ${otp}`);
      res.json({ message: "OTP generated successfully" });
    } catch (error) {
      console.error("Generate OTP error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate OTP" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }
      const isVerified = await storage.verifyOtp(email, otp);
      if (isVerified) {
        res.json({ message: "OTP verified successfully" });
      } else {
        res.status(400).json({ error: "Invalid or expired OTP" });
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to verify OTP" });
    }
  });

  app.post("/api/auth/complete-registration", async (req, res) => {
    try {
      const { userId, academicDetails, personalizationDetails, subscriptionPlan } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Update user with academic and personalization details
      await storage.updateUser(userId, {
        ...academicDetails,
        ...personalizationDetails,
        subscription_plan: subscriptionPlan,
      });

      // Send confirmation email with PDF attachment
      try {
        const { sendRegistrationConfirmation } = await import('./email');
        await sendRegistrationConfirmation(userId, subscriptionPlan);
        console.log(`Sent confirmation email to user ${userId} with subscription ${subscriptionPlan}`);
      } catch (err) {
        console.error('Failed to send confirmation email:', err);
      }

      res.json({ message: "Registration completed successfully" });
    } catch (error) {
      console.error("Complete registration error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to complete registration" });
    }
  });

  // Test route
  app.post("/api/test", (req, res) => {
    res.json({ message: "Test route hit!" });
  });

  // Quiz routes
  app.get("/api/quizzes", async (req, res) => {
    try {
      const { subject, grade, difficulty, search } = req.query;
      const quizzes = await storage.getFilteredQuizzes({
        subject: subject as string,
        grade: grade as string,
        difficulty: difficulty as string,
        search: search as string,
      });
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });

  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quiz = await storage.getQuizById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Grade levels route
  app.get("/api/grades", async (req, res) => {
    try {
      const grades = await storage.getGradeLevels();
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grade levels" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
