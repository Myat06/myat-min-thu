import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";
import "./styles/Contact.css";

gsap.registerPlugin(ScrollTrigger);

// ── 3D Scene ──────────────────────────────────────────────────────────────────

function TorusKnotMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const mainRef  = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    groupRef.current.rotation.x = t * 0.1;
    groupRef.current.rotation.y = t * 0.16;
    const mat = mainRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.35 + Math.sin(t * 1.8) * 0.18;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.7}>
      <group ref={groupRef}>
        {/* Solid shape */}
        <mesh ref={mainRef}>
          <torusKnotGeometry args={[1, 0.32, 220, 32]} />
          <meshStandardMaterial
            color="#c2a4ff"
            emissive="#7c3aed"
            emissiveIntensity={0.38}
            metalness={0.95}
            roughness={0.04}
          />
        </mesh>
        {/* Wireframe overlay */}
        <mesh>
          <torusKnotGeometry args={[1, 0.32, 70, 14]} />
          <meshBasicMaterial color="#e879f9" wireframe transparent opacity={0.12} />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitDot({ angle, radius, speed, color }: { angle: number; radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + angle;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.6) * radius * 0.4;
    ref.current.position.z = Math.sin(t) * radius * 0.5;
    ref.current.rotation.x = t * 1.4;
    ref.current.rotation.y = t;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.09]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
    </mesh>
  );
}

function ContactScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 48 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.25} color="#4c1d95" />
      <pointLight position={[4, 4, 4]}  color="#c2a4ff" intensity={9} />
      <pointLight position={[-4, -3, 3]} color="#f0abfc" intensity={5} />
      <pointLight position={[0, -5, 2]}  color="#818cf8" intensity={3} />

      <Stars radius={60} depth={50} count={700} factor={3} fade speed={0.5} />

      <TorusKnotMesh />
      <OrbitDot angle={0}          radius={1.85} speed={0.55} color="#c2a4ff" />
      <OrbitDot angle={Math.PI}    radius={1.85} speed={0.55} color="#f0abfc" />
      <OrbitDot angle={Math.PI/2}  radius={2.1}  speed={0.38} color="#818cf8" />
    </Canvas>
  );
}

// ── Contact Component ──────────────────────────────────────────────────────────

const socials = [
  { label: "GitHub",    href: config.contact.github    },
  { label: "LinkedIn",  href: config.contact.linkedin  },
  { label: "WhatsApp",  href: config.contact.whatsapp  },
  { label: "Facebook",  href: config.contact.facebook  },
  { label: "Instagram", href: config.contact.instagram },
];

const Contact = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title lines reveal
      gsap.fromTo(
        ".ct-title-line",
        { yPercent: 110, skewY: 4, opacity: 0 },
        {
          yPercent: 0, skewY: 0, opacity: 1,
          duration: 1.0, stagger: 0.14, ease: "power4.out",
          scrollTrigger: { trigger: ".ct-left", start: "top 78%" },
        }
      );

      // Subtitle
      gsap.fromTo(
        ".ct-subtitle",
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.25,
          scrollTrigger: { trigger: ".ct-left", start: "top 78%" },
        }
      );

      // Cards stagger
      gsap.fromTo(
        ".ct-card",
        { y: 55, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.72, stagger: 0.13, ease: "power3.out",
          scrollTrigger: { trigger: ".ct-cards", start: "top 82%" },
        }
      );

      // Divider line
      gsap.fromTo(
        ".ct-divider",
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 1.1, ease: "power3.inOut",
          scrollTrigger: { trigger: ".ct-footer", start: "top 90%" },
        }
      );

      // Footer
      gsap.fromTo(
        ".ct-footer-inner",
        { y: 22, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".ct-footer", start: "top 92%" },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="ct-wrap" ref={rootRef} id="contact">
      {/* Background blobs */}
      <div className="ct-blob ct-blob-1" />
      <div className="ct-blob ct-blob-2" />
      <div className="ct-blob ct-blob-3" />

      {/* Section label */}
      <div className="ct-section-tag">
        <span className="ct-tag-line" />
        <span className="ct-tag-text">Contact</span>
        <span className="ct-tag-line" />
      </div>

      {/* ── Hero split ── */}
      <div className="ct-hero">

        {/* Left ── text + cards */}
        <div className="ct-left">

          {/* Title */}
          <div className="ct-title">
            <div className="ct-title-clip"><div className="ct-title-line">LET'S</div></div>
            <div className="ct-title-clip ct-title-clip--accent">
              <div className="ct-title-line ct-title-accent">CONNECT</div>
            </div>
          </div>

          <p className="ct-subtitle">
            Open to new opportunities, collaborations, and conversations.<br />
            Don't hesitate to reach out — I'd love to hear from you.
          </p>

          {/* Cards */}
          <div className="ct-cards">

            {/* Email + Location */}
            <div className="ct-card">
              <div className="ct-card-inner">
                <div className="ct-card-block">
                  <span className="ct-card-label">Email</span>
                  <a
                    href={`mailto:${config.contact.email}`}
                    className="ct-card-value ct-link"
                    data-cursor="disable"
                  >
                    {config.contact.email}
                    <MdArrowOutward className="ct-icon-arrow" />
                  </a>
                </div>
                <div className="ct-card-block">
                  <span className="ct-card-label">Location</span>
                  <span className="ct-card-value">{config.social.location}</span>
                </div>
              </div>
              <div className="ct-card-glow" />
            </div>

            {/* Social links */}
            <div className="ct-card">
              <div className="ct-card-inner">
                <span className="ct-card-label">Social</span>
                <div className="ct-socials">
                  {socials.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="disable"
                      className="ct-social-row"
                    >
                      <span className="ct-social-name">{label}</span>
                      <MdArrowOutward className="ct-icon-arrow" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="ct-card-glow" />
            </div>

            {/* Credit */}
            <div className="ct-card ct-card--credit">
              <div className="ct-card-inner">
                <span className="ct-card-label">Designed & Developed by</span>
                <span className="ct-card-name">{config.developer.fullName}</span>
                <p className="ct-card-desc">
                  Bringing ideas to life through code, design, and a passion for technology.
                </p>
                <div className="ct-copy">
                  <MdCopyright />
                  <span>{new Date().getFullYear()} All rights reserved.</span>
                </div>
              </div>
              <div className="ct-card-glow" />
            </div>

          </div>
        </div>

        {/* Right ── 3D scene */}
        <motion.div
          className="ct-scene-wrap"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <div className="ct-scene-frame">
            <ContactScene />
            <div className="ct-scene-overlay" />
            <div className="ct-scene-corner ct-scene-corner--tl" />
            <div className="ct-scene-corner ct-scene-corner--tr" />
            <div className="ct-scene-corner ct-scene-corner--bl" />
            <div className="ct-scene-corner ct-scene-corner--br" />
          </div>
          {/* Floating label */}
          <div className="ct-scene-badge">
            <span className="ct-scene-badge-dot" />
            Interactive 3D
          </div>
        </motion.div>

      </div>

      {/* Footer divider + footer */}
      <div className="ct-footer">
        <div className="ct-divider" />
        <div className="ct-footer-inner">
          <span className="ct-footer-name">{config.developer.fullName}</span>
          <span className="ct-footer-sep">·</span>
          <span className="ct-footer-copy">Portfolio {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
