import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./styles/TechStackNew.css";

const INNER_R = 115;
const OUTER_R = 205;

interface Skill {
  name: string;
  icon: string;
  url:  string;
}

const innerSkills: Skill[] = [
  { name: "Python",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",   url: "https://python.org" },
  { name: "React",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",    url: "https://react.dev" },
  { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", url: "https://flutter.dev" },
];

const outerSkills: Skill[] = [
  { name: "Scikit-learn", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg", url: "https://scikit-learn.org" },
  { name: "TypeScript",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",   url: "https://typescriptlang.org" },
  { name: "Django",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",              url: "https://djangoproject.com" },
  { name: "Dart",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",               url: "https://dart.dev" },
  { name: "JavaScript",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",   url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "Firebase",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",          url: "https://firebase.google.com" },
];

const pillSkills: Skill[] = [
  { name: "HTML",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",                  url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "CSS",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",                    url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "FastAPI",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",               url: "https://fastapi.tiangolo.com" },
  { name: "Pandas",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",                 url: "https://pandas.pydata.org" },
  { name: "NumPy",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",                   url: "https://numpy.org" },
  { name: "Matplotlib", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg",  url: "https://matplotlib.org" },
  { name: "Seaborn",    icon: "https://seaborn.pydata.org/_static/logo-mark-lightbg.svg",                                     url: "https://seaborn.pydata.org" },
  { name: "NLTK",       icon: "https://avatars.githubusercontent.com/u/9838838?s=200&v=4",                                    url: "https://nltk.org" },
  { name: "OpenCV",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",                url: "https://opencv.org" },
  { name: "Streamlit",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/streamlit/streamlit-original.svg",   url: "https://streamlit.io" },
  { name: "Node.js",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",                url: "https://nodejs.org" },
  { name: "Tailwind",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",      url: "https://tailwindcss.com" },
  { name: "Bootstrap",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",         url: "https://getbootstrap.com" },
  { name: "MySQL",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",                  url: "https://mysql.com" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",       url: "https://postgresql.org" },
  { name: "n8n",        icon: "https://avatars.githubusercontent.com/u/45487711?s=200&v=4",                                   url: "https://n8n.io" },
  { name: "Git",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",                      url: "https://git-scm.com" },
  { name: "GitHub",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",               url: "https://github.com" },
  { name: "VS Code",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",                url: "https://code.visualstudio.com" },
  { name: "Vercel",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",                url: "https://vercel.com" },
  { name: "Jupyter",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",             url: "https://jupyter.org" },
  { name: "Figma",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",                  url: "https://figma.com" },
  { name: "Postman",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",              url: "https://postman.com" },
  { name: "OpenClaw",   icon: "https://avatars.githubusercontent.com/u/126733545?s=200&v=4",                                  url: "https://github.com/DragonChess/OpenClaw" },
  { name: "MS Office",  icon: "https://img.icons8.com/color/48/microsoft-office-2019.png",                                    url: "https://www.microsoft.com/microsoft-365" },
];

/* ─── helpers ──────────────────────────────────────────────── */
const toRad = (deg: number) => (deg * Math.PI) / 180;

const setPos = (el: HTMLDivElement, angle: number, radius: number) => {
  el.style.left = `calc(50% + ${Math.cos(toRad(angle)) * radius}px)`;
  el.style.top  = `calc(50% + ${Math.sin(toRad(angle)) * radius}px)`;
};

/* ─── component ─────────────────────────────────────────────── */
const TechStackNew = () => {
  const innerAngleRef = useRef(0);
  const outerAngleRef = useRef(0);
  const isPausedRef   = useRef(false);
  const innerRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const outerRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const [tooltip, setTooltip] = useState<string | null>(null);

  /* Set initial positions synchronously before first paint */
  useLayoutEffect(() => {
    innerSkills.forEach((_, i) => {
      const el = innerRefs.current[i];
      if (el) setPos(el, i * (360 / innerSkills.length), INNER_R);
    });
    outerSkills.forEach((_, i) => {
      const el = outerRefs.current[i];
      if (el) setPos(el, i * (360 / outerSkills.length), OUTER_R);
    });
  }, []);

  /* Animation loop — only DOM writes, no React state updates */
  useEffect(() => {
    let frameId: number;

    const animate = () => {
      if (!isPausedRef.current) {
        innerAngleRef.current = (innerAngleRef.current + 0.35) % 360;
        outerAngleRef.current = (outerAngleRef.current - 0.22 + 360) % 360;
      }

      innerSkills.forEach((_, i) => {
        const el = innerRefs.current[i];
        if (el) setPos(el, innerAngleRef.current + i * (360 / innerSkills.length), INNER_R);
      });

      outerSkills.forEach((_, i) => {
        const el = outerRefs.current[i];
        if (el) setPos(el, outerAngleRef.current + i * (360 / outerSkills.length), OUTER_R);
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleEnter = (name: string) => {
    isPausedRef.current = true;
    setTooltip(name);
  };
  const handleLeave = () => {
    isPausedRef.current = false;
    setTooltip(null);
  };

  return (
    <div className="techstack-new">

      {/* ── Video background ── */}
      <div className="techstack-video-container">
        <video autoPlay loop muted playsInline className="techstack-video">
          <source src="/video/video.webm" type="video/webm" />
        </video>
        <div className="techstack-overlay" />
      </div>

      {/* ── Content ── */}
      <div className="techstack-content">
        <h2>Tech Stack</h2>

        {/* Orbit */}
        <div className="ts-orbit-scaler">
          <div className="ts-orbit-wrap">

            {/* Glowing rings */}
            <div className="ts-ring ts-ring-outer" />
            <div className="ts-ring ts-ring-inner" />

            {/* Centre icon */}
            <div className="ts-center">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="ts-cg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="#c2a4ff" />
                    <stop offset="100%" stopColor="#aa42ff" />
                  </linearGradient>
                </defs>
                <polyline points="16 18 22 12 16 6" stroke="url(#ts-cg)" />
                <polyline points="8 6 2 12 8 18"   stroke="url(#ts-cg)" />
              </svg>
            </div>

            {/* Inner orbit items */}
            {innerSkills.map((skill, i) => (
              <div
                key={`in-${skill.name}`}
                ref={el => { innerRefs.current[i] = el; }}
                className="ts-orbit-item"
                onMouseEnter={() => handleEnter(skill.name)}
                onMouseLeave={handleLeave}
                onClick={() => window.open(skill.url, "_blank", "noopener,noreferrer")}
                data-cursor="disable"
              >
                <img src={skill.icon} alt={skill.name} />
                {tooltip === skill.name && (
                  <span className="ts-orbit-tooltip">{skill.name}</span>
                )}
              </div>
            ))}

            {/* Outer orbit items */}
            {outerSkills.map((skill, i) => (
              <div
                key={`out-${skill.name}`}
                ref={el => { outerRefs.current[i] = el; }}
                className="ts-orbit-item"
                onMouseEnter={() => handleEnter(skill.name)}
                onMouseLeave={handleLeave}
                onClick={() => window.open(skill.url, "_blank", "noopener,noreferrer")}
                data-cursor="disable"
              >
                <img src={skill.icon} alt={skill.name} />
                {tooltip === skill.name && (
                  <span className="ts-orbit-tooltip">{skill.name}</span>
                )}
              </div>
            ))}

          </div>
        </div>

        {/* ── Remaining skills as pills ── */}
        <div className="ts-pills">
          {pillSkills.map(s => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ts-pill"
              data-cursor="disable"
            >
              <img src={s.icon} alt={s.name} />
              {s.name}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TechStackNew;
