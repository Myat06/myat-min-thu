import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";
import { User, FileText, FolderGit2, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const navItems = [
  { label: "About",     href: "#about",     page: null,         icon: <User       size={18} strokeWidth={1.5} /> },
  { label: "Resume",    href: null,          page: "/resume",    icon: <FileText   size={18} strokeWidth={1.5} /> },
  { label: "Portfolio", href: null,          page: "/portfolio", icon: <FolderGit2 size={18} strokeWidth={1.5} /> },
  { label: "Contact",   href: null,          page: "/contact",   icon: <Mail       size={18} strokeWidth={1.5} /> },
];

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    if (location.pathname === "/portfolio") setActiveItem("Portfolio");
    else if (location.pathname === "/contact") setActiveItem("Contact");
    else if (location.pathname === "/resume")  setActiveItem("Resume");
    else setActiveItem("About");
  }, [location.pathname]);

  useEffect(() => {
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    if (location.pathname !== "/") {
      lenis.start();
    } else {
      lenis.stop();
    }

    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.addEventListener("resize", () => { lenis?.resize(); });
    return () => { lenis?.destroy(); };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") return;
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      const el = document.querySelector("#about") as HTMLElement;
      if (el && scrollPos >= el.offsetTop) setActiveItem("About");
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const scrollTo = (targetId: string) => {
    const target = document.querySelector(targetId) as HTMLElement;
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.5 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if (item.page) {
      navigate(item.page);
      return;
    }
    if (!item.href) return;
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollTo(item.href!), 400);
    } else {
      setActiveItem(item.label);
      scrollTo(item.href);
    }
  };

  return (
    <>
      {/* ── Desktop / tablet – top center horizontal nav ── */}
      <nav className="header" aria-label="Primary navigation">
        <ul className="navbar-links">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className={activeItem === item.label ? "navbar-link navbar-link-active" : "navbar-link"}
                onClick={() => handleNavClick(item)}
              >
                <span className="navbar-link-icon">{item.icon}</span>
                <span className="navbar-link-label">{item.label}</span>
                {activeItem === item.label && <span className="navbar-link-dot" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Mobile – icon-only bottom bar ── */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`mobile-bottom-item ${activeItem === item.label ? "active" : ""}`}
            onClick={() => handleNavClick(item)}
            aria-label={item.label}
          >
            <span className="mobile-bottom-icon">{item.icon}</span>
            {activeItem === item.label && <span className="mobile-bottom-dot" />}
          </button>
        ))}
      </nav>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
    </>
  );
};

export default Navbar;
