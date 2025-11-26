export type Stage = "applied" | "reviewing" | "interview" | "offer" | "declined";
export type Actor = "recruiter" | "researcher" | "system";

export type TimelineEntry = {
  title: string;
  description: string;
  time: string;
  actor: Actor;
  state: "done" | "active";
};

export type Application = {
  id: string;
  role: string;
  company: string;
  location: string;
  stage: Stage;
  lastUpdate: string;
  recruiter: string;
  summary: string;
  nextStep: {
    owner: Exclude<Actor, "system">;
    label: string;
    due: string;
  };
  timeline: TimelineEntry[];
};

export const applications: Application[] = [
  {
    id: "aurora-fe",
    role: "Senior Frontend Engineer",
    company: "Aurora Labs",
    location: "Remote • GMT+7",
    stage: "interview",
    lastUpdate: "Updated today",
    recruiter: "Khine from Aurora",
    summary:
      "Recruiter reviewed your portfolio and booked a product interview.",
    nextStep: {
      owner: "researcher",
      label: "Share your availability for the product interview slot",
      due: "Aug 19",
    },
    timeline: [
      {
        title: "Applied with resume + case study link",
        description: "You attached your React/Next.js portfolio links.",
        time: "Aug 12 • 9:10 AM",
        actor: "researcher",
        state: "done",
      },
      {
        title: "Profile screened by recruiter",
        description:
          "Recruiter checked experience and shortlisted for product interview.",
        time: "Aug 13 • 4:35 PM",
        actor: "recruiter",
        state: "done",
      },
      {
        title: "Portfolio review scheduled",
        description: "Recruiter asked for a 30-min product deep dive.",
        time: "Aug 15 • 1:00 PM",
        actor: "recruiter",
        state: "done",
      },
      {
        title: "Confirm interview slot",
        description: "Pick a time for the product interview this week.",
        time: "Awaiting your reply",
        actor: "researcher",
        state: "active",
      },
    ],
  },
  {
    id: "nimbus-des",
    role: "Product Designer (B2B SaaS)",
    company: "NimbusHQ",
    location: "Singapore • Hybrid",
    stage: "reviewing",
    lastUpdate: "Updated 6h ago",
    recruiter: "Zaw from Nimbus",
    summary:
      "Recruiter is reviewing your design system samples and case study notes.",
    nextStep: {
      owner: "recruiter",
      label: "Share a response after reviewing the design system samples",
      due: "Aug 18",
    },
    timeline: [
      {
        title: "Applied with Dribbble + deck",
        description: "Uploaded deck covering design systems and dashboard UX.",
        time: "Aug 14 • 8:45 AM",
        actor: "researcher",
        state: "done",
      },
      {
        title: "Recruiter requested design system links",
        description: "Asked for a component library walkthrough.",
        time: "Aug 14 • 2:05 PM",
        actor: "recruiter",
        state: "done",
      },
      {
        title: "You shared component library recording",
        description: "Sent a Loom and Notion page with interaction tokens.",
        time: "Aug 15 • 10:30 AM",
        actor: "researcher",
        state: "done",
      },
      {
        title: "Waiting for recruiter review",
        description: "Nimbus team is reviewing the artifacts.",
        time: "Awaiting recruiter",
        actor: "recruiter",
        state: "active",
      },
    ],
  },
  {
    id: "vertex-da",
    role: "Data Analyst",
    company: "Vertex Talent",
    location: "Yangon • On-site",
    stage: "offer",
    lastUpdate: "Updated yesterday",
    recruiter: "Su Mon from Vertex",
    summary: "Offer prepared after final interview and take-home review.",
    nextStep: {
      owner: "researcher",
      label: "Review offer summary and respond",
      due: "Aug 21",
    },
    timeline: [
      {
        title: "Applied with SQL portfolio",
        description: "Shared dashboards plus two case studies.",
        time: "Aug 05 • 9:00 AM",
        actor: "researcher",
        state: "done",
      },
      {
        title: "Recruiter shortlisted you",
        description: "Notified hiring manager and sent take-home assignment.",
        time: "Aug 06 • 5:20 PM",
        actor: "recruiter",
        state: "done",
      },
      {
        title: "Case study submitted",
        description: "Delivered cohort analysis and anomaly detection write-up.",
        time: "Aug 09 • 11:10 AM",
        actor: "researcher",
        state: "done",
      },
      {
        title: "Final interview completed",
        description: "Spoke with hiring manager and data lead.",
        time: "Aug 11 • 3:00 PM",
        actor: "system",
        state: "done",
      },
      {
        title: "Offer ready",
        description: "Recruiter shared comp band and start timeline.",
        time: "Respond by Aug 21",
        actor: "recruiter",
        state: "active",
      },
    ],
  },
];
