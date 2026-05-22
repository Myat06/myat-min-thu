import "./styles/ExtraInfo.css";
import { config } from "../config";
import { Target, Sparkles, Award, Users, Globe } from "lucide-react";

const sections = [
  { key: "careerGoal",    label: "Career Goal",           icon: Target,   content: (c: typeof config) => c.careerGoal    ? <p>{c.careerGoal}</p>    : null },
  { key: "interests",     label: "Interests",              icon: Sparkles, content: (c: typeof config) => c.interests     ? <p>{c.interests}</p>     : null },
  { key: "certifications",label: "Certifications",         icon: Award,    content: (c: typeof config) => c.certifications?.length ? <ul>{c.certifications.map((x, i) => <li key={i}>{x}</li>)}</ul> : null },
  { key: "leadership",    label: "Leadership & Activities",icon: Users,    content: (c: typeof config) => c.leadership?.length    ? <ul>{c.leadership.map((x, i)    => <li key={i}>{x}</li>)}</ul> : null },
  { key: "languages",     label: "Languages",              icon: Globe,    content: (c: typeof config) => c.languages?.length     ? <ul>{c.languages.map((x, i)     => <li key={i}>{x}</li>)}</ul> : null },
];

const ExtraInfo = () => {
  return (
    <section className="extrainfo-section">
      <div className="extrainfo-heading">
        <span className="extrainfo-section-label">02 — More About Me</span>
        <h2>Goals & <span>Background</span></h2>
      </div>

      <div className="extrainfo-grid">
        {sections.map(({ key, label, icon: Icon, content }) => {
          const body = content(config);
          if (!body) return null;
          return (
            <div key={key} className="extrainfo-card">
              <div className="extrainfo-card-header">
                <span className="extrainfo-icon"><Icon size={16} strokeWidth={1.8} /></span>
                <h3>{label}</h3>
              </div>
              <div className="extrainfo-body">{body}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExtraInfo;
