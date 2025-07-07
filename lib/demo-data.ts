// Demo account credentials and sample data
export const DEMO_CREDENTIALS = {
  email: "demo@momentlens.app",
  password: "demo123456",
}

export const DEMO_MOMENTS = [
  {
    content:
      "Just finished a great morning walk. The fresh air really helped clear my mind and set a positive tone for the day.",
    mood: 4,
    tags: ["morning", "exercise", "nature"],
    prompt_type: "Morning Reflection",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    content:
      "Had a challenging meeting at work, but I'm proud of how I handled the difficult conversation. Stayed calm and focused on solutions.",
    mood: 3,
    tags: ["work", "growth", "communication"],
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    content:
      "Feeling grateful for my morning coffee ritual. Such a simple pleasure that brings me joy every single day.",
    mood: 5,
    tags: ["gratitude", "morning", "simple-pleasures"],
    prompt_type: "Moments of Joy",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    content:
      "Noticed I was feeling anxious about tomorrow's presentation. Taking some deep breaths and reminding myself I'm prepared.",
    mood: 2,
    tags: ["anxiety", "work", "mindfulness"],
    prompt_type: "When Anxious",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    content: "Beautiful sunset tonight. Took a moment to just watch the colors change and feel present in the moment.",
    mood: 5,
    tags: ["nature", "mindfulness", "beauty"],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    content:
      "Feeling overwhelmed with my to-do list today. Going to prioritize the most important tasks and be kind to myself.",
    mood: 2,
    tags: ["stress", "productivity", "self-compassion"],
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    content: "Had a wonderful lunch with a friend I hadn't seen in months. Connection and laughter are such gifts.",
    mood: 5,
    tags: ["friendship", "connection", "joy"],
    prompt_type: "Moments of Joy",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    content: "Trying a new meditation app today. Even just 5 minutes helped me feel more centered and focused.",
    mood: 4,
    tags: ["meditation", "mindfulness", "self-care"],
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
]
