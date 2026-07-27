// ============================================================
// LIFECYCLE DATA
// Dummy data for the Employee Lifecycle Management feature.
// Covers onboarding, promotions, transfers, feedback, and exits.
// ============================================================

// The 8-step onboarding checklist used for every new employee.
export const ONBOARDING_STEPS = [
  "Welcome & Orientation",
  "IT Setup & System Access",
  "Team Introduction",
  "HR Policies & Compliance",
  "Project Overview & Goals",
  "Mentor Assignment",
  "First Week Check-in",
  "Tools & Software Training",
];

// Which checklist steps (by index) each intern has completed.
// Key = intern.id
export const onboardingProgress = {
  1: [0, 1, 2, 3, 4, 5, 6, 7], // Srilatha       — fully onboarded
  2: [0, 1, 2, 3, 4, 5, 6, 7], // Arjun Rao      — fully onboarded
  3: [0, 1, 2, 3, 4, 5, 6, 7], // Priya Menon    — fully onboarded
  4: [0, 1, 2, 3, 4, 5],       // Karthik Iyer   — 6/8
  5: [0, 1, 2, 3],              // Divya Sharma   — 4/8
  6: [0, 1, 2, 3, 4, 5, 6, 7], // Rahul Verma    — fully onboarded
  7: [0, 1, 2],                 // Sneha Reddy    — 3/8
  8: [0, 1, 2, 3, 4, 5, 6],    // Mohammed Faisal— 7/8
};

// Promotion history records
export const promotions = [
  {
    id: 1,
    internId: 6,
    internName: "Rahul Verma",
    date: "2026-06-01",
    fromRole: "Intern – Full-Stack",
    toRole: "Junior Developer",
    note: "Exceptional performance throughout the batch. Top performer. Recommended by project lead for early conversion.",
  },
  {
    id: 2,
    internId: 3,
    internName: "Priya Menon",
    date: "2026-05-15",
    fromRole: "Intern – Full-Stack",
    toRole: "Associate Developer",
    note: "Demonstrated strong full-stack capabilities and an ownership mindset across multiple modules.",
  },
];

// Transfer history records
export const transfers = [
  {
    id: 1,
    internId: 4,
    internName: "Karthik Iyer",
    date: "2026-04-01",
    fromDept: "Front-End Team",
    toDept: "Back-End Team",
    reason: "Better aligned with candidate's server-side interests and existing Java background.",
  },
  {
    id: 2,
    internId: 2,
    internName: "Arjun Rao",
    date: "2026-03-15",
    fromDept: "Research Team",
    toDept: "Front-End Team",
    reason: "Project staffing needs and candidate's demonstrated strength in UI development.",
  },
];

// Feedback / review session log
export const feedbackEntries = [
  { id: 1, internId: 1, internName: "Srilatha",        date: "2026-03-10", type: "1-on-1",    rating: 4, notes: "Good progress on HTML/CSS. Needs to focus more actively on JavaScript fundamentals." },
  { id: 2, internId: 2, internName: "Arjun Rao",       date: "2026-03-12", type: "Quarterly",  rating: 4, notes: "Strong logical thinking. Encouraged to improve CSS layout consistency." },
  { id: 3, internId: 3, internName: "Priya Menon",     date: "2026-03-15", type: "Quarterly",  rating: 5, notes: "Outstanding performance. Ready for project ownership. Suggested as future team lead candidate." },
  { id: 4, internId: 4, internName: "Karthik Iyer",    date: "2026-04-05", type: "1-on-1",    rating: 3, notes: "Comfortable with back-end logic. Front-end fundamentals need a structured improvement plan." },
  { id: 5, internId: 5, internName: "Divya Sharma",    date: "2026-04-08", type: "1-on-1",    rating: 3, notes: "Steady improvement each month. Assigned additional JavaScript exercises for next sprint." },
  { id: 6, internId: 6, internName: "Rahul Verma",     date: "2026-04-10", type: "Peer",       rating: 5, notes: "Peer review highly positive. Effectively mentors other interns and leads by example." },
  { id: 7, internId: 7, internName: "Sneha Reddy",     date: "2026-05-02", type: "1-on-1",    rating: 4, notes: "Excellent eye for UI detail. Needs to level up JavaScript logic and React component basics." },
  { id: 8, internId: 8, internName: "Mohammed Faisal", date: "2026-05-05", type: "Quarterly",  rating: 4, notes: "Excellent problem-solver. Cross-training on front-end has started this quarter." },
];

// Exit interview records — empty initially (all employees currently active)
export const exitInterviews = [];
