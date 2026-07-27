import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { SKILL_LEVELS } from "../data/internsData";

// A reusable radio-button group for picking a skill level.
// (Kept inline in this file since it's only used here - simple & beginner friendly.)
const LevelRadioGroup = ({ name, value, onChange }) => (
  <div className="radio-group">
    {SKILL_LEVELS.map((level) => (
      <label key={level} className="radio-option">
        <input
          type="radio"
          name={name}
          value={level}
          checked={value === level}
          onChange={(e) => onChange(e.target.value)}
        />
        {level}
      </label>
    ))}
  </div>
);

const initialFormState = {
  internName: "",
  html: "Basic",
  css: "Basic",
  javascript: "Basic",
  react: "Basic",
  communication: "Basic",
  problemSolving: "Basic",
  comments: "",
};

const AssessmentForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [savedMessage, setSavedMessage] = useState("");

  // Generic change handler - works for any field by name
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // NOTE: This project uses local dummy data only (no backend).
    // In a real app, this is where you'd POST formData to an API.
    // For now we just log it and show a success message.
    console.log("New Assessment Saved:", formData);
    setSavedMessage(`Assessment for "${formData.internName}" saved successfully!`);

    // Reset the form after saving
    setFormData(initialFormState);

    // Hide the success message after a few seconds
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <Layout title="New HR Assessment">
      <form className="card assessment-form" onSubmit={handleSubmit}>
        {savedMessage && <div className="alert-success">{savedMessage}</div>}

        <div className="form-group">
          <label>Intern Name</label>
          <input
            type="text"
            className="input"
            required
            value={formData.internName}
            onChange={(e) => handleChange("internName", e.target.value)}
            placeholder="Enter intern's full name"
          />
        </div>

        <div className="form-group">
          <label>HTML Skill Level</label>
          <LevelRadioGroup name="html" value={formData.html} onChange={(v) => handleChange("html", v)} />
        </div>

        <div className="form-group">
          <label>CSS Skill Level</label>
          <LevelRadioGroup name="css" value={formData.css} onChange={(v) => handleChange("css", v)} />
        </div>

        <div className="form-group">
          <label>JavaScript Skill Level</label>
          <LevelRadioGroup name="javascript" value={formData.javascript} onChange={(v) => handleChange("javascript", v)} />
        </div>

        <div className="form-group">
          <label>React Skill Level</label>
          <LevelRadioGroup name="react" value={formData.react} onChange={(v) => handleChange("react", v)} />
        </div>

        <div className="form-group">
          <label>Communication Skills</label>
          <LevelRadioGroup name="communication" value={formData.communication} onChange={(v) => handleChange("communication", v)} />
        </div>

        <div className="form-group">
          <label>Problem-Solving Skills</label>
          <LevelRadioGroup name="problemSolving" value={formData.problemSolving} onChange={(v) => handleChange("problemSolving", v)} />
        </div>

        <div className="form-group">
          <label>Comments / Feedback</label>
          <textarea
            className="input"
            rows="4"
            value={formData.comments}
            onChange={(e) => handleChange("comments", e.target.value)}
            placeholder="Write feedback about the intern's performance..."
          />
        </div>

        <button type="submit" className="btn btn-primary">Save Assessment</button>
      </form>
    </Layout>
  );
};

export default AssessmentForm;
