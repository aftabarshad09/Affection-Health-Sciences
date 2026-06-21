import { motion } from "framer-motion";
import "./CertificateStrip.css";

// Import your certificate images here
import Cert1 from "../assets/Certificates/ACS.png";
import Cert2 from "../assets/Certificates/AMIRCO.jpeg";
import Cert3 from "../assets/Certificates/IAF.png";
import Cert4 from "../assets/Certificates/PNAC.png";
import Cert5 from "../assets/Certificates/SZUTEST.png";
import Cert6 from "../assets/Certificates/TSI.png";
import Cert7 from "../assets/Certificates/IAS.jpeg";

const certificates = [
  { id: 1, image: Cert1, name: "ACS" },
  { id: 2, image: Cert2, name: "AMIRCO" },
  { id: 3, image: Cert3, name: "IAF" },
  { id: 4, image: Cert4, name: "PNAC" },
  { id: 5, image: Cert5, name: "SZUTEST" },
  { id: 6, image: Cert6, name: "TSI" },
  { id: 7, image: Cert7, name: "IAS" },
];

export default function CertificateStrip() {
  return (
    <section className="certificate-section">
      <div className="certificate-container">
        {/* Heading */}
        <div className="certificate-header">
          <span className="certificate-badge">Trust & Credibility</span>
          <h2 className="certificate-title">
            Recognized By Leading
            <span className="certificate-title-accent">Global Authorities</span>
          </h2>
          {/* <p className="certificate-description">
            Our commitment to quality is validated by prestigious certifications from around the world
          </p> */}
        </div>

        {/* Certificate Strip */}
        <div className="certificate-strip-wrapper">
          <motion.div 
            className="certificate-strip"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {/* First set */}
            {certificates.map((cert) => (
              <div key={cert.id} className="certificate-item">
                <img 
                  src={cert.image} 
                  alt={cert.name} 
                  className="certificate-image"
                />
                <p className="certificate-name">{cert.name}</p>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {certificates.map((cert) => (
              <div key={`dup-${cert.id}`} className="certificate-item">
                <img 
                  src={cert.image} 
                  alt={cert.name} 
                  className="certificate-image"
                />
                <p className="certificate-name">{cert.name}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient overlays for fade effect */}
        <div className="certificate-gradient certificate-gradient-left"></div>
        <div className="certificate-gradient certificate-gradient-right"></div>
      </div>
    </section>
  );
}