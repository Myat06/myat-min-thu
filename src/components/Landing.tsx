import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";
import { FaLinkedinIn, FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa6";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              {' '}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
          </div>
          <div className="landing-info">
            <h3>An</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">IS Student</div>
            </h2>
            <h2>
              <div className="landing-h2-info">&amp; Developer</div>
            </h2>
          </div>
          {/* Mobile photo - shows only on mobile when 3D character is hidden */}
          <div className="mobile-photo">
            <img src="/images/mypicnbg.png" alt={config.developer.fullName} />
          </div>

          {/* Mobile-only social icons row */}
          <div className="mobile-social-row">
            <a href={`mailto:${config.contact.email}`} aria-label="Email">
              <FaEnvelope />
            </a>
            <a href={config.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href={config.contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href={config.contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
