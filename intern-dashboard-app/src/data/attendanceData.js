// ============================================================
// ATTENDANCE DATA
// Seed data for the Attendance Tracker module.
// Covers all working days in July 2026 for all 8 interns.
// Status values: "Present" | "Absent" | "Late" | "WFH"
// In a real app this would come from a time-tracking API.
// ============================================================

// Working days in July 2026 (Mon–Fri, excluding weekends)
const _days = [
  "2026-07-01", "2026-07-02", "2026-07-03", "2026-07-04",
  "2026-07-07", "2026-07-08", "2026-07-09", "2026-07-10", "2026-07-11",
  "2026-07-14", "2026-07-15", "2026-07-16", "2026-07-17", "2026-07-18",
  "2026-07-21", "2026-07-22", "2026-07-23", "2026-07-24",
];

// Per-intern daily status patterns (indexed 1:1 with _days above).
// P = Present · A = Absent · L = Late · W = WFH
const _patterns = {
  1: { name: "Srilatha",        s: "P P P P  P P P P P  P P W P P  P P P P" },
  2: { name: "Arjun Rao",       s: "P P P P  P P P L P  P P P P P  P P L P" },
  3: { name: "Priya Menon",     s: "P P P P  P P P P P  P P P P W  W P P P" },
  4: { name: "Karthik Iyer",    s: "P P A P  P P A L P  P A P P P  A P L P" },
  5: { name: "Divya Sharma",    s: "P P P P  P L P P A  P P P L P  P A L P" },
  6: { name: "Rahul Verma",     s: "P P P P  P P P P P  P P P W P  P P P P" },
  7: { name: "Sneha Reddy",     s: "P P P P  P P L P A  P P W P P  P L P P" },
  8: { name: "Mohammed Faisal", s: "P P P P  W P P P P  P P P P P  P W P P" },
};

// Expand shorthand → full status string
const _expand = (code) =>
  code === "P" ? "Present" : code === "A" ? "Absent" : code === "L" ? "Late" : "WFH";

// Build the flat records array
let _id = 1;
export const attendanceRecords = [];

Object.entries(_patterns).forEach(([internId, { name, s }]) => {
  // Split on whitespace (spaces used as visual separators in the pattern string)
  s.split(/\s+/)
    .filter(Boolean)
    .forEach((code, i) => {
      attendanceRecords.push({
        id:         _id++,
        internId:   Number(internId),
        internName: name,
        date:       _days[i],
        status:     _expand(code),
        note:       "",
      });
    });
});

// Export the working-day list so the page can show month context
export const WORKING_DAYS_JULY_2026 = _days;
