import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import Cursor from "../components/Cursor";
import Footer from "../components/Footer";
import SocialIcons from "../components/SocialIcons";
import Career from "../components/Career";
import ExtraInfo from "../components/ExtraInfo";
import { config } from "../config";
import "../components/styles/Career.css";
import "../components/styles/ExtraInfo.css";
import "./ResumePage.css";

const ResumePage = () => {
  return (
    <>
      <Cursor />
      <Navbar />
      <SocialIcons />
      <ChatBot />
      <main className="resume-page">
        {/* Hero */}
        <div className="resume-hero">
          <span className="resume-hero-label">Resume</span>
          <h1>
            {config.developer.name.split(" ")[0]}{" "}
            <span>{config.developer.name.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p>{config.developer.title}</p>
          <div className="resume-hero-actions">
            <a
              href={config.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-hero-cta resume-hero-cta--primary"
              data-cursor="disable"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download CV
            </a>
            <a
              href={config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-hero-cta"
              data-cursor="disable"
            >
              View GitHub Profile ↗
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="resume-divider" />

        <Career />
        <ExtraInfo />
        <Footer />
      </main>
    </>
  );
};

export default ResumePage;
