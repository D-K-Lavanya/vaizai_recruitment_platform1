/**
 * Intelligent Neural Ranking Engine for Candidate Resumes
 */

/**
 * Calculates a weighted match score between candidate data and job requirements
 * @param {Object} candidate - Candidate object containing resumeText and skills array
 * @param {Array<string>} targetKeywords - List of skills/keywords from the job posting
 * @returns {Object} - An object containing the score and the match reasoning
 */
export const calculateMatchScore = (candidate, targetKeywords) => {
  const { resumeText, skills: candidateSkills } = candidate;
  
  if (!targetKeywords || targetKeywords.length === 0) {
    return { score: 0, reason: "No job requirements provided" };
  }

  const normalizedTarget = targetKeywords.map(k => k.toLowerCase().trim());
  let matches = new Set();
  let weightedScore = 0;
  
  // Weight distribution:
  // - Critical Skills (First 3 keywords): 1.5x weight
  // - Standard Skills: 1.0x weight
  const criticalSkills = normalizedTarget.slice(0, 3);

  // 1. Check structured skills (High confidence)
  if (candidateSkills && Array.isArray(candidateSkills)) {
    candidateSkills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase().trim();
      if (normalizedTarget.includes(normalizedSkill)) {
        if (!matches.has(normalizedSkill)) {
          matches.add(normalizedSkill);
          weightedScore += criticalSkills.includes(normalizedSkill) ? 1.5 : 1.0;
        }
      }
    });
  }

  // 2. Text matching (Contextual discovery)
  if (resumeText) {
    const normalizedText = resumeText.toLowerCase();
    normalizedTarget.forEach(keyword => {
      if (normalizedText.includes(keyword) && !matches.has(keyword)) {
        matches.add(keyword);
        weightedScore += criticalSkills.includes(keyword) ? 1.5 : 1.0;
      }
    });
  }

  // Calculate Max Possible Score for normalization
  const maxPossible = (criticalSkills.length * 1.5) + (Math.max(0, normalizedTarget.length - 3) * 1.0);
  const rawScore = (weightedScore / maxPossible) * 100;
  const finalScore = Math.min(Math.round(rawScore), 100);

  return {
    score: finalScore,
    matchedSkills: Array.from(matches),
    reason: `Intelligent match found for ${matches.size} skills with priority weighting.`
  };
};

const rankEngine = {
  calculateMatchScore
};

export default rankEngine;
