import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import Cursor from "../components/Cursor";
import SocialIcons from "../components/SocialIcons";
import Contact from "../components/Contact";
import "../components/styles/Contact.css";

const ContactPage = () => {
  return (
    <>
      <Cursor />
      <Navbar />
      <SocialIcons />
      <ChatBot />
      <main className="contact-page-main">
        <Contact />
      </main>
    </>
  );
};

export default ContactPage;
