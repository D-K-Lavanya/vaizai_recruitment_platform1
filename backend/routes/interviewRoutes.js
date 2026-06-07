import express from 'express';
import Interview from '../models/Interview.js';
import Candidate from '../models/Candidate.js';
import emailService from '../utils/emailService.js';
import { createRequire } from 'module';
import roleCheck from '../middleware/roleCheck.js';

const router = express.Router();

/**
 * @route POST /api/interviews
 * @desc Schedule a new interview session (Recruiter Only)
 */
router.post('/', roleCheck(['recruiter', 'admin']), async (req, res) => {
  try {
    const interview = new Interview(req.body);
    const savedInterview = await interview.save();
    
    // 1. Automatically update candidate status to 'Interview'
    await Candidate.findByIdAndUpdate(req.body.candidate, { status: 'Interview' });

    // 2. Populate candidate details for email
    const populated = await Interview.findById(savedInterview._id).populate('candidate');
    
    if (populated && populated.candidate) {
      console.log(`[NOTIFY] Sending interview invite to ${populated.candidate.email}`);
      await emailService.sendInterviewInvite(
        populated.candidate.email, 
        populated.candidate.name, 
        populated.scheduledAt,
        populated.roomLink
      );
    }

    res.status(201).json(savedInterview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route GET /api/interviews/candidate/:candidateId
 * @desc Fetch all interview slots for a specific candidate (Candidate Only / Authorized)
 */
router.get('/candidate/:candidateId', roleCheck(['candidate', 'recruiter']), async (req, res) => {
  try {
    // Basic security: if role is candidate, ensure they are fetching their own ID
    if (req.user.role === 'candidate' && req.user.id !== req.params.candidateId) {
      return res.status(403).json({ message: 'Unauthorized access to other candidate data' });
    }

    const interviews = await Interview.find({ candidate: req.params.candidateId })
      .sort({ scheduledAt: 1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route PATCH /api/interviews/:id/room
 * @desc Update the meeting room link (Recruiter Only)
 */
router.patch('/:id/room', roleCheck(['recruiter', 'admin']), async (req, res) => {
  try {
    const { roomLink } = req.body;
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { roomLink },
      { new: true }
    );

    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route GET /api/interviews
 * @desc Get all interviews (Recruiter view Only)
 */
router.get('/', roleCheck(['recruiter', 'admin']), async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate('candidate', 'name email')
      .sort({ scheduledAt: 1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route DELETE /api/interviews/:id
 * @desc Cancel and remove an interview session (Recruiter Only)
 */
router.delete('/:id', roleCheck(['recruiter', 'admin']), async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview session not found' });
    res.json({ message: 'Interview cancelled and removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
