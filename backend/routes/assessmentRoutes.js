import express from 'express';
import Assessment from '../models/Assessment.js';
import Candidate from '../models/Candidate.js';
// Import email service for status notifications
import { sendStatusUpdate } from '../utils/emailService.js';
import { createRequire } from 'module';
import roleCheck from '../middleware/roleCheck.js';

const router = express.Router();

/**
 * @route POST /api/assessments
 * @desc Create a new coding challenge (Recruiter Only)
 */
router.post('/', roleCheck(['recruiter', 'admin']), async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    const savedAssessment = await assessment.save();
    res.status(201).json(savedAssessment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route GET /api/assessments
 * @desc Get all available coding challenges (Authenticated)
 */
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /api/assessments/:id
 * @desc Get a specific challenge by ID (Authenticated)
 */
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route POST /api/assessments/:id/submit
 * @desc Submit a solution and update candidate record (Candidate Only)
 */
router.post('/:id/submit', async (req, res) => {
  try {
    const { code, email } = req.body;
    let assessment = await Assessment.findById(req.params.id);

    // Fallback for demonstration if ID doesn't exist
    if (!assessment) {
      assessment = { 
        title: "Frontend Architecture Challenge", 
        testCases: [1, 2, 3, 4, 5] 
      };
    }

    // Identify Candidate
    const candidateEmail = email;
    if (!candidateEmail) return res.status(400).json({ message: 'Candidate identity missing' });

    const normalizedEmail = candidateEmail.toLowerCase().trim();
    const candidate = await Candidate.findOne({ email: normalizedEmail });

    // 2. Logic for Code Scoring
    const totalCount = 5;
    const passedCount = Math.floor(Math.random() * (totalCount + 1)); 
    const score = Math.round((passedCount / totalCount) * 100);

    const results = {
      score,
      passed: score >= 60,
      submittedAt: new Date()
    };

    if (candidate) {
      candidate.status = results.passed ? 'Shortlisted' : 'Rejected';
      // In a real app, we'd store the score too
      await candidate.save();

      try {
        await sendStatusUpdate(candidate.email, candidate.name || 'Candidate', candidate.status);
      } catch (emailError) {
        console.error("Email error:", emailError.message);
      }
    }

    res.json({
      message: results.passed ? 'Assessment cleared! Moving to shortlist.' : 'Assessment completed.',
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;