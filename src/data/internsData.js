// ============================================================
// DUMMY DATA FILE
// This simulates a database. In a real app this would come
// from an API. Everything here is local, hard-coded data.
// ============================================================

// Each intern has:
// - basic info (id, name, role, email, joinDate)
// - skills: CURRENT skill levels (Basic / Intermediate / High)
// - previousSkills: skill levels from the last assessment (used for Progress Tracking)
// - softSkills: communication & problem-solving levels
// - hrComments: free text feedback from HR
export const interns = [
  {
    id: 1,
    name: "Srilatha",
    role: "Front-End Developer",
    email: "srilatha@example.com",
    joinDate: "2026-01-12",
    skills: { HTML: "High", CSS: "High", JavaScript: "Intermediate", React: "Basic" },
    previousSkills: { HTML: "Intermediate", CSS: "Intermediate", JavaScript: "Basic", React: "Basic" },
    softSkills: { communication: "High", problemSolving: "Intermediate" },
    hrComments: "Shows great design sense and is picking up JavaScript quickly. Needs more hands-on React practice.",
  },
  {
    id: 2,
    name: "Arjun Rao",
    role: "Front-End Developer",
    email: "arjun.rao@example.com",
    joinDate: "2026-01-12",
    skills: { HTML: "High", CSS: "Intermediate", JavaScript: "High", React: "Intermediate" },
    previousSkills: { HTML: "Intermediate", CSS: "Basic", JavaScript: "Intermediate", React: "Basic" },
    softSkills: { communication: "Intermediate", problemSolving: "High" },
    hrComments: "Strong logical thinking. Should focus more on CSS layout consistency.",
  },
  {
    id: 3,
    name: "Priya Menon",
    role: "Full-Stack Developer",
    email: "priya.menon@example.com",
    joinDate: "2025-12-01",
    skills: { HTML: "High", CSS: "High", JavaScript: "High", React: "Intermediate" },
    previousSkills: { HTML: "High", CSS: "Intermediate", JavaScript: "Intermediate", React: "Basic" },
    softSkills: { communication: "High", problemSolving: "High" },
    hrComments: "One of the strongest interns in the batch. Ready for more real-world project ownership.",
  },
  {
    id: 4,
    name: "Karthik Iyer",
    role: "Back-End Developer",
    email: "karthik.iyer@example.com",
    joinDate: "2026-02-03",
    skills: { HTML: "Basic", CSS: "Basic", JavaScript: "Intermediate", React: "Basic" },
    previousSkills: { HTML: "Basic", CSS: "Basic", JavaScript: "Basic", React: "Basic" },
    softSkills: { communication: "Basic", problemSolving: "Intermediate" },
    hrComments: "Comfortable with server-side logic but needs to build front-end fundamentals.",
  },
  {
    id: 5,
    name: "Divya Sharma",
    role: "Front-End Developer",
    email: "divya.sharma@example.com",
    joinDate: "2026-01-20",
    skills: { HTML: "Intermediate", CSS: "Intermediate", JavaScript: "Basic", React: "Basic" },
    previousSkills: { HTML: "Basic", CSS: "Basic", JavaScript: "Basic", React: "Basic" },
    softSkills: { communication: "Intermediate", problemSolving: "Basic" },
    hrComments: "Steady improvement each month. Needs more guided JavaScript exercises.",
  },
  {
    id: 6,
    name: "Rahul Verma",
    role: "Full-Stack Developer",
    email: "rahul.verma@example.com",
    joinDate: "2025-11-15",
    skills: { HTML: "High", CSS: "Intermediate", JavaScript: "High", React: "High" },
    previousSkills: { HTML: "High", CSS: "Intermediate", JavaScript: "Intermediate", React: "Intermediate" },
    softSkills: { communication: "High", problemSolving: "High" },
    hrComments: "Top performer. Mentors other interns well. Consider for early conversion.",
  },
  {
    id: 7,
    name: "Sneha Reddy",
    role: "Front-End Developer",
    email: "sneha.reddy@example.com",
    joinDate: "2026-02-10",
    skills: { HTML: "Intermediate", CSS: "High", JavaScript: "Intermediate", React: "Basic" },
    previousSkills: { HTML: "Basic", CSS: "Intermediate", JavaScript: "Basic", React: "Basic" },
    softSkills: { communication: "High", problemSolving: "Intermediate" },
    hrComments: "Great eye for UI detail. Should now focus on JavaScript logic and React basics.",
  },
  {
    id: 8,
    name: "Mohammed Faisal",
    role: "Back-End Developer",
    email: "mohammed.faisal@example.com",
    joinDate: "2026-01-05",
    skills: { HTML: "Basic", CSS: "Basic", JavaScript: "High", React: "Basic" },
    previousSkills: { HTML: "Basic", CSS: "Basic", JavaScript: "Intermediate", React: "Basic" },
    softSkills: { communication: "Intermediate", problemSolving: "High" },
    hrComments: "Excellent problem solver. Encourage cross-training on front-end basics.",
  },
];

// List of skill levels used throughout the app (dropdowns, filters, etc.)
export const SKILL_LEVELS = ["Basic", "Intermediate", "High"];

// The 4 technical skills we track for every intern
export const TECH_SKILLS = ["HTML", "CSS", "JavaScript", "React"];
