import React, { createContext, useContext, useReducer, useCallback } from "react";
import { interns as initialInterns } from "../data/internsData";
import {
  feedbackEntries,
  promotions,
  transfers,
  onboardingProgress,
} from "../data/lifecycleData";

// ─── Helpers ────────────────────────────────────────────────────────────────

const levelToScore = (level) =>
  ({ Basic: 1, Intermediate: 2, High: 3 }[level] ?? 1);

const skillGapCount = (intern) =>
  Object.values(intern.skills).filter((l) => l === "Basic").length;

// ─── Notification Rule Engine ────────────────────────────────────────────────
// Each rule returns a notification object or null.

const RULES = [
  // Rule 1: ≥2 Basic skills → Learning Nudge
  (intern) => {
    const gaps = skillGapCount(intern);
    if (gaps >= 2) {
      return {
        id: `nudge-${intern.id}`,
        type: "nudge",
        icon: "🧠",
        title: "Learning Nudge",
        body: `${intern.name} has ${gaps} skills at Basic level. Recommended: ${intern.learningNudges.slice(0, 2).join(", ")}.`,
        internId: intern.id,
        link: `/progress/${intern.id}`,
        read: false,
      };
    }
    return null;
  },

  // Rule 2: Wellbeing flag → Intervention
  (intern) => {
    if (intern.wellbeingFlag) {
      return {
        id: `wellbeing-${intern.id}`,
        type: "wellbeing",
        icon: "💚",
        title: "Wellbeing Check-In",
        body: `${intern.name}'s engagement score is ${intern.engagementScore}/100. Schedule a 1-on-1 check-in.`,
        internId: intern.id,
        link: `/lifecycle/feedback`,
        read: false,
      };
    }
    return null;
  },

  // Rule 3: recognitionCount >= 4 → Recognition toast
  (intern) => {
    if (intern.recognitionCount >= 4) {
      return {
        id: `recognition-${intern.id}`,
        type: "recognition",
        icon: "🏆",
        title: "Recognition Moment",
        body: `${intern.name} has earned ${intern.recognitionCount} recognitions! Consider a public shout-out or promotion review.`,
        internId: intern.id,
        link: `/progress/${intern.id}`,
        read: false,
      };
    }
    return null;
  },

  // Rule 4: trajectory === "declining" → Alert
  (intern) => {
    if (intern.trajectory === "declining") {
      return {
        id: `alert-${intern.id}`,
        type: "alert",
        icon: "⚠️",
        title: "Performance Alert",
        body: `${intern.name}'s performance trajectory is declining. Review feedback and schedule a structured improvement plan.`,
        internId: intern.id,
        link: `/report/${intern.id}`,
        read: false,
      };
    }
    return null;
  },
];

// Seed initial notifications from existing intern data
const seedNotifications = () =>
  initialInterns.flatMap((intern) =>
    RULES.map((rule) => rule(intern)).filter(Boolean)
  );

// Seed initial events from existing lifecycle data
const seedEvents = () => {
  const events = [];

  feedbackEntries.forEach((f) => {
    events.push({
      id: `fb-${f.id}`,
      type: "feedback",
      icon: "💬",
      label: "Feedback Logged",
      body: `${f.internName} — ${f.type} session. Rating: ${f.rating}/5.`,
      internId: f.internId,
      internName: f.internName,
      timestamp: new Date(f.date).getTime(),
      link: `/lifecycle/feedback`,
    });
  });

  promotions.forEach((p) => {
    events.push({
      id: `promo-${p.id}`,
      type: "promotion",
      icon: "🚀",
      label: "Promotion Granted",
      body: `${p.internName} promoted from ${p.fromRole} → ${p.toRole}.`,
      internId: p.internId,
      internName: p.internName,
      timestamp: new Date(p.date).getTime(),
      link: `/lifecycle/promotions`,
    });
  });

  transfers.forEach((t) => {
    events.push({
      id: `trans-${t.id}`,
      type: "transfer",
      icon: "🔁",
      label: "Transfer Recorded",
      body: `${t.internName} transferred from ${t.fromDept} → ${t.toDept}.`,
      internId: t.internId,
      internName: t.internName,
      timestamp: new Date(t.date).getTime(),
      link: `/lifecycle/promotions`,
    });
  });

  // Onboarding completion events
  Object.entries(onboardingProgress).forEach(([internId, steps]) => {
    if (steps.length === 8) {
      const intern = initialInterns.find((i) => i.id === Number(internId));
      if (intern) {
        events.push({
          id: `onboard-${internId}`,
          type: "onboarding",
          icon: "📋",
          label: "Onboarding Complete",
          body: `${intern.name} completed all 8 onboarding steps.`,
          internId: intern.id,
          internName: intern.name,
          timestamp: new Date(intern.joinDate).getTime() + 14 * 86400000,
          link: `/lifecycle/onboarding`,
        });
      }
    }
  });

  return events.sort((a, b) => b.timestamp - a.timestamp);
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState = {
  interns: initialInterns,
  events: seedEvents(),
  notifications: seedNotifications(),
  notificationDrawerOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "FIRE_EVENT": {
      const { event, notifications: newNotes = [] } = action.payload;
      return {
        ...state,
        events: [event, ...state.events],
        notifications: [...newNotes, ...state.notifications],
      };
    }
    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case "MARK_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case "TOGGLE_DRAWER":
      return { ...state, notificationDrawerOpen: !state.notificationDrawerOpen };
    case "CLOSE_DRAWER":
      return { ...state, notificationDrawerOpen: false };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fire a cross-module event and auto-run notification rules
  const fireEvent = useCallback((eventData, internId) => {
    const event = {
      ...eventData,
      id: `evt-${Date.now()}`,
      timestamp: Date.now(),
    };

    // Run rules against the triggering intern (if applicable)
    const newNotes = [];
    if (internId) {
      const intern = state.interns.find((i) => i.id === internId);
      if (intern) {
        RULES.forEach((rule) => {
          const note = rule(intern);
          if (note && !state.notifications.find((n) => n.id === note.id)) {
            newNotes.push({ ...note, id: `${note.id}-${Date.now()}` });
          }
        });
      }
    }

    dispatch({ type: "FIRE_EVENT", payload: { event, notifications: newNotes } });
  }, [state.interns, state.notifications]);

  const markAllRead    = useCallback(() => dispatch({ type: "MARK_ALL_READ" }), []);
  const markRead       = useCallback((id) => dispatch({ type: "MARK_READ", payload: id }), []);
  const toggleDrawer   = useCallback(() => dispatch({ type: "TOGGLE_DRAWER" }), []);
  const closeDrawer    = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        ...state,
        unreadCount,
        fireEvent,
        markAllRead,
        markRead,
        toggleDrawer,
        closeDrawer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
};

export default AppContext;
