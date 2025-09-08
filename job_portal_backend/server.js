// server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Job = require("./models/Job");
const { isValidEmail, isValidPassword, areFieldsFilled } = require("./utils/validate");

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// 🔒 Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// ========================== ROUTES ========================== //

app.get("/", (req, res) => {
  res.json({ message: "Job Portal Backend Running 🚀" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from Job Portal API 🚀" });
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!areFieldsFilled({ name, email, password, role })) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!areFieldsFilled({ email, password })) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", error });
  }
});

app.post("/api/jobs", authMiddleware, async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    if (!areFieldsFilled({ title, company, location, description })) {
      return res.status(400).json({ message: "All job fields are required" });
    }

    const newJob = new Job({ title, company, location, description, postedBy: req.user.id });
    await newJob.save();

    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/jobs", authMiddleware, async (req, res) => {
  try {
    const { title, location, company } = req.query;
    let filter = {};
    if (title) filter.title = { $regex: `^${title}$`, $options: "i" };
    if (location) filter.location = { $regex: `^${location}$`, $options: "i" };
    if (company) filter.company = { $regex: `^${company}$`, $options: "i" };

    const jobs = await Job.find(filter).populate("postedBy", "name email");
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/jobs/:id/apply", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can apply for jobs" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: "Already applied" });
    }

    job.applicants.push(req.user.id);
    await job.save();

    res.json({ message: "Job application submitted successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/jobs/:id/applicants", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("applicants", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "employer" || job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the posting employer can see applicants" });
    }

    res.json({ applicants: job.applicants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/my-applications", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can view their applications" });
    }

    const jobs = await Job.find({ applicants: req.user.id })
      .populate("postedBy", "name email")
      .select("title company location createdAt");

    res.json({ applications: jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/my-jobs", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can view their jobs" });
    }

    const jobs = await Job.find({ postedBy: req.user.id }).populate("applicants", "name email");
    res.json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can delete jobs" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own jobs" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
