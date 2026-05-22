import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const [activeCategory, setActiveCategory] = useState("Overall");

  // Calculate project counts by category
  const overallCount = config.projects.length;
  const websiteCount = config.projects.filter(p => p.category === "Website").length;
  const mobileCount = config.projects.filter(p => p.category === "Mobile").length;
  const dsmlCount = config.projects.filter(p => p.category === "DS & ML").length;

  const categories = [
    { name: "Overall", count: overallCount },
    { name: "Website", count: websiteCount },
    { name: "Mobile", count: mobileCount },
    { name: "DS & ML", count: dsmlCount }
  ];

  // Dynamic filtering based on active category badge
  const filteredProjects = activeCategory === "Overall"
    ? config.projects
    : config.projects.filter(p => p.category === activeCategory);

  useEffect(() => {
    // Disable pinning on mobile to allow standard scrolling
    if (window.innerWidth <= 768) return;

    let translateX: number = 0;
    let timeline: gsap.core.Timeline | null = null;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const workContainer = document.querySelector(".work-container");
      if (!workContainer) return;
      const rectLeft = workContainer.getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentElement = box[0].parentElement;
      if (!parentElement) return;
      const parentWidth = parentElement.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
      if (translateX < 0) translateX = 0;
    }

    const initGSAP = () => {
      setTranslateX();

      // Only build GSAP horizontal scroll timeline if container content is larger than viewport width
      if (translateX > 0) {
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".work-section",
            start: "top top",
            end: `+=${translateX}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            id: "work",
            invalidateOnRefresh: true,
          },
        });

        timeline.to(".work-flex", {
          x: -translateX,
          ease: "none",
        });
      }

      ScrollTrigger.refresh();
    };

    // Delay initialization slightly to ensure the DOM is fully rendered and styled
    const timer = setTimeout(initGSAP, 60);

    // Clean up animation on dynamic state toggle
    return () => {
      clearTimeout(timer);
      if (timeline) {
        timeline.kill();
      }
      ScrollTrigger.getById("work")?.kill();
    };
  }, [activeCategory]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        {/* Dynamic Category Badges */}
        <div className="work-category-filters">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`filter-badge ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.name)}
              data-cursor="disable"
            >
              <span className="badge-name">{cat.name}</span>
              <span className="badge-count">{cat.count}</span>
            </button>
          ))}
        </div>

        <div className="work-flex">
          {filteredProjects.map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="work-title-link"
                        >
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
              </div>
              <WorkImage 
                image={project.image} 
                alt={project.title} 
                link={project.github} 
              />
            </div>
          ))}

          {/* See All Works CTA Box */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                See All Works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;

