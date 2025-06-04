import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Interview Schema
const interviewSchema = new mongoose.Schema({
  userId: String,
  jobRole: String,
  questions: [{
    question: String,
    answer: String,
    score: Number,
    feedback: String
  }],
  videoUrl: String,
  overallScore: Number,
  createdAt: { type: Date, default: Date.now }
});

const Interview = mongoose.model('Interview', interviewSchema);

// Routes
app.post('/api/interviews', async (req, res) => {
  try {
    const interview = new Interview(req.body);
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/interviews/:userId', async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.params.userId });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});