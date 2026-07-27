import React from "react";

// Small colored pill that shows a skill level.
// Basic = gray, Intermediate = orange, High = green.
const SkillBadge = ({ level }) => {
  const className =
    level === "High" ? "badge badge-high" : level === "Intermediate" ? "badge badge-intermediate" : "badge badge-basic";

  return <span className={className}>{level}</span>;
};

export default SkillBadge;
