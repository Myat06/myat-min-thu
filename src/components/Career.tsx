import { useEffect, useRef } from "react";
import "./styles/Career.css";
import { config } from "../config";

const getDisplayYear = (period: string) => {
  if (period.includes("Present")) return "NOW";
  if (period.includes(" - ")) return period.split(" - ")[0];
  return period;
};

const Career = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl   = timelineRef.current;
    const info = infoRef.current;
    if (!tl || !info) return;

    // Grow the timeline line based on scroll position
    const handleScroll = () => {
      const rect  = info.getBoundingClientRect();
      const viewH = window.innerHeight;
      // start growing when section top hits 75% from viewport top
      // finish when section bottom hits 25% from viewport top
      const scrolled  = viewH * 0.75 - rect.top;
      const total     = info.offsetHeight - viewH * 0.5;
      const progress  = Math.min(1, Math.max(0, scrolled / total));
      tl.style.maxHeight = `${progress * 102}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount in case already in view

    // Fade-in each card when it enters the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("career-item-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".career-item").forEach((item) => observer.observe(item));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="career-section">
      <div className="career-heading">
        <span className="career-section-label">01 — Background</span>
        <h2>
          Education <span>&</span>
          <br />Experience
        </h2>
        <p className="career-heading-sub">
          My academic journey and the foundations I've built along the way.
        </p>
      </div>

      <div className="career-info" ref={infoRef}>
        {/* Growing vertical line */}
        <div className="career-timeline" ref={timelineRef}>
          <div className="career-dot" />
        </div>

        {config.experiences.map((exp, index) => (
          <div key={index} className="career-item">
            {/* Left: faded year */}
            <div className="career-year">
              <span>{getDisplayYear(exp.period)}</span>
            </div>

            {/* Right: content */}
            <div className="career-card">
              <h4>{exp.position}</h4>
              <div className="career-meta">
                <span className="career-company">{exp.company}</span>
                {exp.location && (
                  <>
                    <span className="career-sep">·</span>
                    <span className="career-location">{exp.location}</span>
                  </>
                )}
              </div>
              {exp.description && <p className="career-desc">{exp.description}</p>}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="career-techs">
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="career-tech">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Career;
