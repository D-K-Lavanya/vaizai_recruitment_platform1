import express from 'express';
import Candidate from '../models/Candidate.js';
import Job from '../models/Job.js';
import Interview from '../models/Interview.js';
import upload from '../middleware/upload.js';
import auth from '../middleware/auth.js';
import { extractTextFromPDF } from '../controllers/parserController.js';
import { sendApplicationConfirmation } from '../utils/emailService.js';
import aiClientService from '../services/aiClientService.js';

const router = express.Router();

/**
 * @route GET /api/candidate-portal/my-status
 * @desc Fetch current candidate's profile status and interviews
 */
router.get('/my-status', auth, async (req, res) => {
  try {
    const email = req.user.email;
    const candidate = await Candidate.findOne({ email: email.toLowerCase() });
    
    if (!candidate) {
      return res.status(404).json({ message: 'No candidate profile found for this user.' });
    }

    const interviews = await Interview.find({ candidate: candidate._id })
      .sort({ scheduledAt: 1 });

    res.json({
      candidate,
      interviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route POST /api/candidate-portal/submit
 * @desc Explicitly handle candidate profile submissions from the portal
 */
router.post('/submit', auth, upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, skills, jobId } = req.body;
    const authenticatedEmail = req.user.email;
    
    // 1. Fetch Job context for accurate confirmation emails
    let jobTitle = 'Software Engineer';
    if (jobId) {
      try {
        const job = await Job.findById(jobId);
        if (job) jobTitle = job.title;
      } catch (err) {
        console.warn('Job lookup failed in portal submission:', err.message);
      }
    }

    let parsedSkills = [];
    if (skills) {
      if (typeof skills === 'string') {
        try {
          parsedSkills = JSON.parse(skills);
        } catch (e) {
          parsedSkills = skills.split(',').map(s => s.trim()).filter(s => s !== '');
        }
      } else if (Array.isArray(skills)) {
        parsedSkills = skills.filter(s => s !== '');
      }
    }

    let resumeText = '';
    let aiParsedData = null;

    if (req.file) {
      // 2. Local fallback parsing
      try {
        resumeText = await extractTextFromPDF(req.file.path);
      } catch (parseError) {
        console.warn('Local PDF extraction failed:', parseError.message);
        resumeText = 'Fallback: Text extraction failed.';
      }

      // 3. AI NLP Parsing (Python Worker)
      aiParsedData = await aiClientService.parseResume(req.file.path);
    }

    // 4. Data Harmonization: Authenticated User > AI > Local > Form Data
    // We FORCE the email to be the one the user logged in with to maintain account integrity
    const finalCandidateData = {
      name: (aiParsedData && !aiParsedData.fallback && aiParsedData.name !== "Unknown Candidate") ? aiParsedData.name : (name || 'Anonymous Candidate'),
      email: authenticatedEmail.toLowerCase(), // ALWAYS use the logged-in user's email
      phone: (aiParsedData && !aiParsedData.fallback) ? aiParsedData.phone : phone,
      skills: (aiParsedData && !aiParsedData.fallback && aiParsedData.skills.length > 0) ? aiParsedData.skills : (parsedSkills.length > 0 ? parsedSkills : []),
      resumeUrl: req.file ? req.file.path : null,
      resumeText: (resumeText && !resumeText.includes('Fallback: Text extraction failed')) ? resumeText : (aiParsedData?.raw_text || resumeText)
    };

    // Check if profile already exists for this email and update it instead of creating duplicate
    let candidate = await Candidate.findOne({ email: finalCandidateData.email });
    
    if (candidate) {
      Object.assign(candidate, finalCandidateData);
      candidate.status = 'Applied'; // Reset status on resubmission
      await candidate.save();
    } else {
      candidate = new Candidate({
        ...finalCandidateData,
        status: 'Applied'
      });
      await candidate.save();
    }

    // 5. Trigger automated response
    try {
      await sendApplicationConfirmation(finalCandidateData.email, finalCandidateData.name, jobTitle);
    } catch (emailError) {
      console.error('Portal confirmation email failed:', emailError);
    }

    res.status(201).json({
      message: 'Profile submitted successfully',
      candidateId: candidate._id,
      aiProcessed: aiParsedData && !aiParsedData.fallback
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
