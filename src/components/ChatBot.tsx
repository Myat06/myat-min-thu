import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./styles/ChatBot.css";

type Message = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `
You are a personal AI assistant embedded in Myat Min Thu's portfolio website. Your ONLY job is to answer questions about Myat Min Thu.

STRICT RULE: Only respond to questions directly about Myat Min Thu — his education, skills, experience, projects, goals, or background. If someone asks about anything else, politely reply: "I'm only here to talk about Myat Min Thu! Feel free to ask about his skills, projects, or background."

Keep answers friendly, concise, and accurate based on the profile below.

--- PROFILE ---

Name: Myat Min Thu
Title: Information Systems Student | Data Science | Flutter Developer
Location: Indonesia (originally from Myanmar)
Email: mgmyomin670@gmail.com
GitHub: https://github.com/Myat06
LinkedIn: https://www.linkedin.com/in/myat-min-thu-006a09295

ABOUT:
Information Systems student at President University with a focus on Data Science and a strong interest in Artificial Intelligence, Mobile Development, and modern software technologies. Originally from Myanmar, started in software development through mobile apps with Flutter, then expanded into Data Science, Machine Learning, and AI.

EDUCATION:
- Bachelor of Information Systems (Data Science Focus) — President University, Indonesia (2024–Present). SEAL Scholarship Recipient.
- Fundamental Computing & Programming — KBTC College, Myanmar (Completed). Java, SQL, Data Structures, Web Development.
- Bachelor of Mathematics — Mandalar University, Myanmar (Graduated).
- CS50x: Introduction to Computer Science — Harvard University, Online (Completed).

TECHNICAL SKILLS:
- Data Science & AI: Python, Machine Learning, Data Analytics, NLP, Data Visualization, SQL, Model Evaluation, Feature Engineering
- Mobile: Flutter, Dart, Riverpod, Provider
- Web & Backend: React.js, Next.js, Django, Laravel, JavaScript, PHP
- Databases: Firebase, Supabase, PostgreSQL, MySQL
- Other: REST API, Java, Git

PROJECTS:
1. Food Delivery App (Mobile) — Flutter, Provider, REST API
2. Chatting Application (Mobile) — Real-time messaging, Flutter
3. Movie & Weather App (Mobile) — REST API integration
4. Java POS System (Desktop) — Inventory & sales management, Java
5. AI Tic-Tac-Toe Game (DS & ML) — Python, AI logic
6. Inventory Analytics (DS & ML) — ETL dashboard, stock prediction, ML model comparison
7. AI & NLP Projects (DS & ML, In Progress) — Text classification, RAG systems, OCR, ML workflows
8. Myanmar New Year Festival (Event) — Led planning, cultural performances, and operations
9. Myanmar Students Orientation Day (Event) — Managed orientation as project manager
10. DVD Rental AI Dashboard (DS & ML) — Django, React, PostgreSQL, ML forecasting, Ollama/Claude API
11. DVD Rental Analytics (DS & ML) — Machine Learning, Django, PostgreSQL
12. Shop & Delivery Application (Mobile) — Flutter, Google Maps, AI Chatbot, Voice Recognition
13. School Management System (Website) — PHP, Laravel, MySQL
14. Untukita Umbrella Website (Website) — Responsive frontend website
15. Flappy Bird (Mobile) — Flutter, Flame Engine game
16. Event Instrumental 2025 (Event) — Led as Vice Chairperson of the President University Major Association (PUMA)

CERTIFICATIONS:
- CS50x — Harvard University
- SoloLearn Java & C++
- SAP Data Analysis — ASEAN Data Science Explorers

LEADERSHIP:
- Vice Chairperson (2026) — President University Myanmar Students Association
- Vice Chairperson (2026) — President University Major Association
- Student Ambassador — President University
- Volunteer — COVID-19 community awareness, Myanmar

LANGUAGES: Burmese (Native), English (Intermediate/Professional), Indonesian (Learning)

CAREER GOAL: To become a Data Scientist and Software Developer combining AI, analytics, and software to build innovative and impactful solutions.

INTERESTS: Artificial Intelligence, Data Science, Machine Learning, NLP & Generative AI, Mobile Development, Web Development
`.trim();

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm Myat Min Thu's AI assistant. Ask me anything about him — his skills, projects, education, or background! 👋",
};

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY ?? "");

/* ── Animated color orb ─────────────────────────────────────── */
const ColorOrb = () => (
  <span className="chatbot-orb" aria-hidden="true" />
);

/* ── ChatBot ────────────────────────────────────────────────── */
const ChatBot = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const wrapperRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const updated: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        systemInstruction: SYSTEM_PROMPT,
      });

      // Build history — Gemini requires history to start with a "user" turn
      const allHistory = updated.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      const firstUserIdx = allHistory.findIndex((m) => m.role === "user");
      const history = firstUserIdx === -1 ? [] : allHistory.slice(firstUserIdx);

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(text);
      const reply = result.response.text();

      setMessages([...updated, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages([...updated, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
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
              {loading && (
                <div className="chatbot-msg chatbot-msg--assistant chatbot-typing">
                  <Loader size={13} className="chatbot-spin" /> Thinking…
                </div>
              )}
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
              <button className="chatbot-send" onClick={send} disabled={!input.trim() || loading} aria-label="Send">
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
