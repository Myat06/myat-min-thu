import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { config } from "../config";
import "./styles/ChatBot.css";

type Message = { role: "user" | "assistant"; content: string };

// ── Build projects table from config ─────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  "DS & ML": "🤖",
  "Mobile":  "📱",
  "Website": "🌐",
  "Event":   "🎉",
};

function buildProjectsResponse(): string {
  const grouped: Record<string, typeof config.projects> = {};
  for (const p of config.projects) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  }

  const total = config.projects.length;
  let out = `📋 All Projects (${total} total)\n`;

  for (const [cat, projects] of Object.entries(grouped)) {
    const icon = CATEGORY_ICONS[cat] ?? "📁";
    out += `\n${icon} ${cat} (${projects.length})\n`;
    out += `${"─".repeat(32)}\n`;
    for (const p of projects) {
      out += `▸ ${p.title}\n`;
      out += `  ${p.technologies}\n`;
    }
  }

  out += `\nAsk me about any specific project for more details!`;
  return out;
}

// ── Rule-based response engine ───────────────────────────────────────────────
const rules: { keywords: string[]; response: string }[] = [
  {
    keywords: ["hello", "hi", "hey", "greet", "sup", "halo"],
    response: "Hey there! 👋 I'm here to tell you all about Myat Min Thu. You can ask me about his skills, projects, education, work experience, or how to contact him!",
  },
  {
    keywords: ["who", "about", "introduce", "yourself", "tell me about", "myat"],
    response: "Myat Min Thu is a software developer from Myanmar, currently studying Sarjana Komputer (S.Kom.) with a Data Science focus at President University, Indonesia (GPA 3.50/4.00, SEAL Scholar). He specialises in Flutter mobile apps and AI/ML systems, and loves building things that solve real problems.",
  },
  {
    keywords: ["skill", "tech", "stack", "language", "know", "use", "capable", "proficient"],
    response: "Here's Myat's tech stack:\n\n• AI/ML — Python, Machine Learning, NLP, XGBoost, spaCy, OCR\n• Mobile — Flutter, Dart, Riverpod\n• Backend — FastAPI, Django, Laravel\n• Frontend — React.js, Next.js, JavaScript\n• Databases — PostgreSQL, MySQL, Firebase, Supabase\n• Other — REST API, Java, Git, Docker",
  },
  {
    keywords: ["project", "work", "built", "made", "portfolio", "app", "system", "all project", "show project", "list project"],
    response: buildProjectsResponse(),
  },
  {
    keywords: ["flashport", "customs", "ceisa", "declaration"],
    response: "FlashPort is an AI-powered customs declaration automation system built for Cikarang Dry Port, developed for the AI Open Innovation Challenge 2026. Myat led the team as Project Manager. It uses a 3-stage OCR pipeline (spaCy NER, keyword proximity, regex), XGBoost risk scoring trained on 6,000 samples with 93.7% accuracy, FastAPI backend, Flutter mobile app, and React admin dashboard.",
  },
  {
    keywords: ["wasteiq", "waste", "prediction", "garbage"],
    response: "WasteIQ is an AI-powered waste volume prediction platform for the AI Open Innovation Challenge 2026. Myat led the AI See You Team. It features a Django REST API with 21 endpoints, ML prediction engine, real-time GPS truck tracking, weather data integration (Open-Meteo), a React dashboard with 10 pages, and a Flutter driver mobile app.",
  },
  {
    keywords: ["money", "exchange", "mmk", "idr", "currency"],
    response: "The MMK–IDR Money Exchange app is a real-time Myanmar Kyat to Indonesian Rupiah exchange rate web app built with Next.js and Supabase. It features live rate display with spread calculation, a currency converter, admin panel for rate management, and exchange history tracking.",
  },
  {
    keywords: ["education", "study", "university", "degree", "gpa", "school", "college"],
    response: "Myat's education:\n\n🎓 Sarjana Komputer (S.Kom.), Data Science Focus — President University, Indonesia (Jan 2025–Present) | GPA 3.50/4.00 | SEAL Scholarship Recipient (2025–2027)\n\nPreviously studied Mathematics at Mandalar University (Myanmar) and completed CS50x at Harvard University.",
  },
  {
    keywords: ["experience", "job", "intern", "work experience", "company", "career", "employed"],
    response: "Myat's work experience:\n\n🚀 Co-Founder — The Language Crew Academy (Jun 2026–Present) | Online English training startup\n🎓 Student Ambassador — President University (Aug 2025–Present)\n🔍 QA Intern — Overspace ERP Company, Myanmar (Apr–Jul 2025) | Manual testing, test cases\n❤️ Volunteer — MDY Rescue, Myanmar (Feb–Jul 2021) | COVID-19 emergency response",
  },
  {
    keywords: ["contact", "email", "reach", "hire", "message", "whatsapp", "linkedin", "github"],
    response: "You can reach Myat Min Thu here:\n\n📧 Email — mgmyomin670@gmail.com\n💼 LinkedIn — linkedin.com/in/myat-min-thu-006a09295\n🐙 GitHub — github.com/Myat06\n🌐 Portfolio — myatminthu.vercel.app",
  },
  {
    keywords: ["flutter", "mobile", "dart", "app"],
    response: "Flutter is one of Myat's core strengths. He has built multiple mobile apps including a food delivery app, real-time chat application, shop & delivery app (with AI chatbot + voice recognition), and even a Flappy Bird game using the Flame engine. He uses Riverpod and Provider for state management.",
  },
  {
    keywords: ["python", "machine learning", "ml", "ai", "data science", "nlp"],
    response: "Myat works with Python for AI/ML tasks — including machine learning model training (XGBoost, scikit-learn), NLP (spaCy, text classification, RAG systems), OCR (Tesseract), and data analytics. His FlashPort project achieved 93.7% accuracy with XGBoost risk scoring.",
  },
  {
    keywords: ["leadership", "association", "club", "role", "position", "vice"],
    response: "Myat's leadership roles:\n\n• Vice Chairperson (2026) — President University Myanmar Students Association\n• Vice Chairperson (2026) — President University Major Association of Information System\n• Student Ambassador — President University\n• Co-Founder — The Language Crew Academy\n• Volunteer — MDY Rescue (COVID-19 emergency response)",
  },
  {
    keywords: ["certificate", "certification", "award", "achievement", "cs50", "harvard", "sap"],
    response: "Myat's certifications:\n\n🏆 CS50 Introduction to Computer Science — Harvard University (David J. Malan)\n📊 ASEAN Data Science Explorers — SAP & ASEAN Foundation",
  },
  {
    keywords: ["goal", "future", "plan", "dream", "aspire", "want to"],
    response: "Myat's career goal is to become a Data Scientist and Software Developer who combines AI, analytics, and software technologies to build innovative and impactful solutions — bridging mobile development and intelligent systems.",
  },
  {
    keywords: ["location", "where", "country", "live", "from", "myanmar", "indonesia", "bekasi"],
    response: "Myat Min Thu is originally from Myanmar and is currently based in Bekasi, West Java, Indonesia — where he studies at President University.",
  },
  {
    keywords: ["scholarship", "seal", "president university", "gpa"],
    response: "Myat is a SEAL Scholarship recipient at President University (Jan 2025–Dec 2027), studying Sarjana Komputer with a Data Science focus. His current GPA is 3.50/4.00.",
  },
  {
    keywords: ["language", "speak", "burmese", "english", "japanese", "indonesian"],
    response: "Myat speaks:\n\n🇲🇲 Burmese (Myanmar) — Native\n🇬🇧 English — Intermediate / Professional\n🇯🇵 Japanese — Intermediate",
  },
];

const FALLBACK = "I'm not sure about that one! You can ask me about Myat's skills, projects, work experience, education, certifications, or how to contact him. 😊";

function getRuleBasedReply(input: string): string {
  const q = input.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((kw) => q.includes(kw))) {
      return rule.response;
    }
  }
  return FALLBACK;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm Myat Min Thu's assistant. Ask me anything about him — his skills, projects, education, or how to contact him! 👋",
};

/* ── Animated color orb ─────────────────────────────────────── */
const ColorOrb = () => (
  <span className="chatbot-orb" aria-hidden="true" />
);

/* ── ChatBot ────────────────────────────────────────────────── */
const ChatBot = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input,    setInput]    = useState("");
  const bottomRef               = useRef<HTMLDivElement>(null);
  const wrapperRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const updated: Message[] = [...messages, { role: "user", content: text }];
    const reply = getRuleBasedReply(text);
    setMessages([...updated, { role: "assistant", content: reply }]);
    setInput("");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div ref={wrapperRef} className="chatbot-root">

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-panel"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 14, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            aria-live="polite"
          >
            {/* Header */}
            <div className="chatbot-panel-header">
              <div className="chatbot-panel-title">
                <ColorOrb />
                Ask about Myat Min Thu
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chatbot-msg chatbot-msg--${m.role}`}>
                  {m.content}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="chatbot-input-row">
              <textarea
                className="chatbot-input"
                placeholder="Ask something about Myat…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
              />
              <button className="chatbot-send" onClick={send} disabled={!input.trim()} aria-label="Send">
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Animated pill trigger ── */}
      <motion.button
        className={`chatbot-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle AI assistant"
        data-cursor="disable"
        animate={{
          width:        isOpen ? 46 : 120,
          borderRadius: isOpen ? 14 : 100,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              className="chatbot-trigger-icon"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0    }}
              exit={{    opacity: 0, rotate: 45   }}
              transition={{ duration: 0.16 }}
            >
              <X size={17} strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="label"
              className="chatbot-trigger-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <ColorOrb />
              <span className="chatbot-trigger-text">Ask AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  );
};

export default ChatBot;
