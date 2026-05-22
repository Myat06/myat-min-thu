import { config } from "../config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Globe, Smartphone, Brain, House, CalendarDays } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import Cursor from "../components/Cursor";
import Footer from "../components/Footer";
import SocialIcons from "../components/SocialIcons";
import "./MyWorks.css";

const MyWorks = () => {
  const websiteProjects = config.projects.filter(p => p.category === "Website");
  const mobileProjects  = config.projects.filter(p => p.category === "Mobile");
  const dsmlProjects    = config.projects.filter(p => p.category === "DS & ML");
  const eventProjects   = config.projects.filter(p => p.category === "Event");
  const overallProjects = config.projects;

  const categories = [
    { id: "overall", name: "Overall",  icon: House,        projects: overallProjects, count: overallProjects.length },
    { id: "website", name: "Website",  icon: Globe,        projects: websiteProjects, count: websiteProjects.length },
    { id: "mobile",  name: "Mobile",   icon: Smartphone,   projects: mobileProjects,  count: mobileProjects.length  },
    { id: "dsml",    name: "DS & ML",  icon: Brain,        projects: dsmlProjects,    count: dsmlProjects.length    },
    { id: "event",   name: "Events",   icon: CalendarDays, projects: eventProjects,   count: eventProjects.length   },
  ];

  return (
    <div className="myworks-page">
      <Cursor />
      <Navbar />
      <SocialIcons />
      <ChatBot />

      {/* Background glows */}
      <div className="myworks-glow myworks-glow-top" />
      <div className="myworks-glow myworks-glow-bottom" />

      {/* Header */}
      <div className="myworks-header-wrap">
        <h1 className="myworks-title">
          All <span>Works</span>
        </h1>
        <p className="myworks-subtitle">
          A curated collection of my professional projects, engineering creations, and data science experiments.
        </p>
      </div>

      {/* Tabs */}
      <div className="myworks-content">
        <Tabs defaultValue="overall" className="w-full">
          <div className="tabs-bar">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="tabs-list">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <TabsTrigger key={cat.id} value={cat.id} className="tab-trigger">
                      <Icon size={15} strokeWidth={2} aria-hidden="true" style={{ marginRight: 6, opacity: 0.7 }} />
                      {cat.name}
                      <span className="tab-count">{cat.count}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="tab-content">
              {cat.projects.length === 0 ? (
                <div className="empty-state">
                  <p>No projects found in this category.</p>
                </div>
              ) : (
                <div className="projects-grid">
                  {cat.projects.map((project, index) => (
                    <div key={project.id} className="project-card" data-cursor="disable">
                      {/* Decorative watermark number */}
                      <span className="project-num">{String(index + 1).padStart(2, "0")}</span>

                      {/* Category badge */}
                      <div className="project-card-top">
                        <span className="project-cat-badge">{project.category}</span>
                      </div>

                      {/* Title */}
                      <h3 className="project-title">{project.title}</h3>

                      {/* Description */}
                      <p className="project-desc">{project.description}</p>

                      {/* Tech badges */}
                      <div className="project-techs">
                        {project.technologies.split(",").map((tech, i) => (
                          <span key={i} className="project-tech">{tech.trim()}</span>
                        ))}
                      </div>

                      {/* GitHub link */}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-github-btn"
                        >
                          <FaGithub size={14} /> View Repository
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MyWorks;
