import { MdCopyright } from "react-icons/md";
import { config } from "../config";
import "./styles/Footer.css";

const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="site-footer-line" />

      <div className="site-footer-content">
        <p className="site-footer-credit">
          Designed &amp; Developed by{" "}
          <span className="site-footer-name">{config.developer.fullName}</span>
        </p>

        <p className="site-footer-copy">
          <MdCopyright /> {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
