// ============================================================
// SKILL UTILS
// Small, reusable helper functions used across the dashboard.
// Keeping this logic in one file means every page calculates
// "performance" and "recommendations" the same way.
// ============================================================

import { TECH_SKILLS } from "../data/internsData";

// Turn a skill level into a number so we can average / chart it.
export const levelToScore = (level) => {
  if (level === "High") return 3;
  if (level === "Intermediate") return 2;
  return 1; // Basic
};

// Turn a number back into a friendly label (used for overall performance).
export const scoreToLabel = (score) => {
  if (score >= 2.5) return "High";
  if (score >= 1.75) return "Intermediate";
  return "Basic";
};

// Average of the 4 technical skills for one intern -> 1 to 3
export const getTechnicalScore = (intern) => {
  const total = TECH_SKILLS.reduce((sum, skill) => sum + levelToScore(intern.skills[skill]), 0);
  return total / TECH_SKILLS.length;
};

// Average of ALL skills (technical + soft) -> used as "Overall Performance"
export const getOverallScore = (intern) => {
  const techTotal = TECH_SKILLS.reduce((sum, skill) => sum + levelToScore(intern.skills[skill]), 0);
  const softTotal =
    levelToScore(intern.softSkills.communication) + levelToScore(intern.softSkills.problemSolving);
  return (techTotal + softTotal) / (TECH_SKILLS.length + 2);
};

export const getOverallPerformanceLabel = (intern) => scoreToLabel(getOverallScore(intern));

// Recommendation text for each skill + level combination.
// High level = no recommendation needed (it becomes a "Strength" instead).
const RECOMMENDATIONS = {
  HTML: {
    Basic: "Strengthen HTML fundamentals: semantic tags, forms, tables, and accessibility basics.",
    Intermediate: "Deepen HTML skills: semantic structure best practices, ARIA accessibility, and SEO-friendly markup.",
  },
  CSS: {
    Basic: "Build core CSS skills: box model, positioning, Flexbox, and responsive design basics.",
    Intermediate: "Advance CSS skills: CSS Grid, advanced Flexbox, animations, and responsive design patterns.",
  },
  JavaScript: {
    Basic: "Focus on JavaScript fundamentals: variables, functions, loops, arrays, and DOM manipulation.",
    Intermediate: "Strengthen JavaScript further: ES6+ features, async/await, promises, and API integration.",
  },
  React: {
    Basic: "Improve React fundamentals: functional components, props, state, hooks, and React Router.",
    Intermediate: "Deepen React skills: advanced hooks, Context API, performance optimization, and state management.",
  },
  communication: {
    Basic: "Encourage participation in team discussions and practice clear written/verbal communication.",
    Intermediate: "Continue building confidence in presentations and stakeholder communication.",
  },
  problemSolving: {
    Basic: "Practice DSA fundamentals and structured problem-solving (breaking problems into smaller steps).",
    Intermediate: "Work on optimizing solutions and practicing more complex, real-world problem scenarios.",
  },
};

// Returns a list of { skill, level, recommendation } for every skill
// that is Basic or Intermediate (i.e. not yet High).
export const getRecommendations = (intern) => {
  const recs = [];

  TECH_SKILLS.forEach((skill) => {
    const level = intern.skills[skill];
    if (level !== "High") {
      recs.push({ skill, level, recommendation: RECOMMENDATIONS[skill][level] });
    }
  });

  ["communication", "problemSolving"].forEach((skill) => {
    const level = intern.softSkills[skill];
    if (level !== "High") {
      recs.push({
        skill: skill === "communication" ? "Communication" : "Problem-Solving",
        level,
        recommendation: RECOMMENDATIONS[skill][level],
      });
    }
  });

  return recs;
};

// Strengths = any technical or soft skill already at "High" level.
export const getStrengths = (intern) => {
  const strengths = [];
  TECH_SKILLS.forEach((skill) => {
    if (intern.skills[skill] === "High") strengths.push(skill);
  });
  if (intern.softSkills.communication === "High") strengths.push("Communication");
  if (intern.softSkills.problemSolving === "High") strengths.push("Problem-Solving");
  return strengths;
};
