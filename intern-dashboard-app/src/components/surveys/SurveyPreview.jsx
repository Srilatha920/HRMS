import React, { useState, useEffect } from "react";
import Button from "../common/Button";

const SurveyPreview = ({ targetGroup = "employees", questions = [] }) => {
  const [device, setDevice] = useState("web");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset progress when questions change
  useEffect(() => {
    setStep(0);
    setAnswers({});
    setIsSubmitted(false);
  }, [questions, targetGroup]);

  if (!questions || questions.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
        Add questions in the builder to see the interactive preview.
      </div>
    );
  }

  const currentQ = questions[step];
  const totalSteps = questions.length;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const selectRating = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  };

  return (
    <div className="preview-wrap">
      {/* Device Mode Selectors */}
      <div className="device-toggle">
        {[
          { key: "web",    label: "Desktop Web", icon: "💻" },
          { key: "mobile", label: "Mobile App",  icon: "📱" },
          { key: "chat",   label: "Slack / Teams", icon: "💬" },
        ].map((d) => (
          <Button
            key={d.key}
            variant={device === d.key ? "primary" : "secondary"}
            className="chip-btn"
            style={{ borderRadius: 99 }}
            onClick={() => setDevice(d.key)}
          >
            <span>{d.icon}</span>
            <span style={{ marginLeft: 6 }}>{d.label}</span>
          </Button>
        ))}
      </div>

      {/* Interactive Device Frame */}
      <div className={`device-frame frame-${device}`}>
        {/* Browser / Chat header */}
        <div className="frame-chrome">
          <span style={{ fontSize: 13 }}>
            {device === "chat" ? "💬 Slack Bot" : device === "mobile" ? "📱 HR Portal" : "💻 Web Browser"}
          </span>
          <span className="chrome-lock">🔒 Secure Endpoint</span>
        </div>

        {/* Survey Content Panel */}
        <div className="frame-body">
          {isSubmitted ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                Thank You!
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Your responses have been recorded anonymously. Your feedback helps make our workplace better!
              </p>
              <Button
                variant="secondary"
                style={{ marginTop: 20 }}
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(0);
                  setAnswers({});
                }}
              >
                Submit another response
              </Button>
            </div>
          ) : (
            <>
              {/* Progress Steps Indicators */}
              <div className="frame-progress">
                {questions.map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === step ? "dot-active" : i < step ? "dot-done" : ""}`}
                  />
                ))}
              </div>

              {/* Anonymity Badge */}
              <div className="anon-tag">
                <span>🔒</span>
                <span>Anonymity Mode: ON</span>
              </div>

              {/* Question Text */}
              <div className="frame-question">
                {currentQ.label || `Untitled Question ${step + 1}`}
              </div>

              {/* Inputs based on type */}
              <div style={{ margin: "12px 0" }}>
                {currentQ.type === "rating" && (
                  <div className="frame-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        onClick={() => selectRating(n)}
                        className={n <= (answers[currentQ.id] || 0) ? "star-preview-active" : ""}
                        style={{ cursor: "pointer", transition: "color 0.15s ease" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}

                {currentQ.type === "mcq" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Exceeded Expectations", "Met Expectations", "Needs Improvement"].map((opt) => {
                      const isSelected = answers[currentQ.id] === opt;
                      return (
                        <Button
                          key={opt}
                          variant="secondary"
                          className="block-btn"
                          style={{
                            width: "100%",
                            textAlign: "left",
                            border: isSelected ? "1px solid var(--color-primary)" : "1px solid var(--glass-border)",
                            background: isSelected ? "rgba(99, 102, 241, 0.12)" : "var(--bg-input)"
                          }}
                          onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: opt }))}
                        >
                          {opt}
                        </Button>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === "text" && (
                  <textarea
                    className="frame-textarea"
                    style={{ width: "100%" }}
                    placeholder="Type your response here..."
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))}
                  />
                )}

                {currentQ.type === "enps" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="enps-preview" style={{ justifyContent: "space-between" }}>
                      {Array.from({ length: 11 }).map((_, i) => (
                        <span
                          key={i}
                          onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: i }))}
                          style={{
                            cursor: "pointer",
                            width: 24,
                            height: 24,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: answers[currentQ.id] === i ? "var(--color-primary)" : "var(--bg-input)",
                            color: answers[currentQ.id] === i ? "#fff" : "var(--text-secondary)",
                            border: answers[currentQ.id] === i ? "1px solid var(--color-primary)" : "1px solid var(--border)",
                            fontWeight: answers[currentQ.id] === i ? "bold" : "normal"
                          }}
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                      <span>Not Likely at all</span>
                      <span>Extremely Likely</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="frame-actions">
                <Button
                  variant="ghost"
                  disabled={step === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                >
                  {step === totalSteps - 1 ? "Submit" : "Next"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyPreview;
