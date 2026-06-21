import { FiFileText } from "react-icons/fi";
import "../style/Legal.css";

const SECTIONS = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Terms",
    paragraphs: [
      "These Terms and Conditions ('Terms') govern your access to and use of the Affection Health Sciences website and the purchase of any products through it. By browsing our site or placing an order, you agree to be bound by these Terms. If you do not agree, please do not use our website.",
    ],
  },
  {
    id: "use-of-website",
    heading: "2. Use of the Website",
    list: [
      "You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, or restrict or inhibit the use of, the site by anyone else.",
      "You must not attempt to gain unauthorized access to any part of the website, our servers, or any systems connected to it.",
      "You are responsible for maintaining the confidentiality of any account credentials and for all activity that occurs under your account.",
    ],
  },
  {
    id: "products-orders",
    heading: "3. Products & Orders",
    paragraphs: [
      "We make every effort to display product information, packaging, and pricing accurately. However, we do not warrant that product descriptions or other content on the site are entirely error-free, and we reserve the right to correct any errors and to cancel or refuse any order arising from such an error.",
      "Placing an order constitutes an offer to purchase a product, which we may accept or decline at our discretion — for example, in cases of suspected fraud, stock unavailability, or pricing errors.",
    ],
  },
  {
    id: "pricing-payment",
    heading: "4. Pricing & Payment",
    paragraphs: [
      "All prices are listed in Pakistani Rupees (PKR) unless otherwise stated and are subject to change without prior notice. Payment must be completed through one of our supported payment methods before an order is processed, except where cash-on-delivery is explicitly offered.",
    ],
  },
  {
    id: "shipping",
    heading: "5. Shipping & Delivery",
    paragraphs: [
      "We aim to dispatch and deliver orders within the timeframes communicated at checkout. Delivery estimates are not guaranteed and may be affected by courier delays, weather, or circumstances outside our control. Risk of loss passes to you once an order has been delivered to the shipping address provided.",
    ],
  },
  {
    id: "returns",
    heading: "6. Returns & Refunds",
    paragraphs: [
      "If you receive a damaged, defective, or incorrect product, please contact us within a reasonable period of delivery so we can arrange a replacement or refund. For hygiene and safety reasons, opened nutritional and supplement products generally cannot be returned unless found to be faulty.",
    ],
  },
  {
    id: "medical-disclaimer",
    heading: "7. Medical Disclaimer",
    paragraphs: [
      "Our products are nutritional and dietary supplements intended to support general health and wellness. They are not intended to diagnose, treat, cure, or prevent any disease, and are not a substitute for professional medical advice, diagnosis, or treatment.",
      "Always consult a qualified physician or healthcare provider before starting any new supplement — particularly for infants, children, pregnant or breastfeeding women, or individuals with existing medical conditions or medications. Never disregard professional medical advice because of something you have read on this website.",
    ],
  },
  {
    id: "intellectual-property",
    heading: "8. Intellectual Property",
    paragraphs: [
      "All content on this website — including text, graphics, logos, product formulations, and images — is the property of Affection Health Sciences or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without our prior written consent.",
    ],
  },
  {
    id: "liability",
    heading: "9. Limitation of Liability",
    paragraphs: [
      "To the fullest extent permitted by law, Affection Health Sciences shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or our products, beyond the remedies of replacement or refund described in these Terms.",
    ],
  },
  {
    id: "governing-law",
    heading: "10. Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes arising from these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Rawalpindi, Pakistan.",
    ],
  },
  {
    id: "changes",
    heading: "11. Changes to These Terms",
    paragraphs: [
      "We may revise these Terms from time to time. The \"Last updated\" date at the top of this page reflects the most recent revision. Continued use of the website after changes are posted constitutes acceptance of the updated Terms.",
    ],
  },
];

export default function Terms() {
  return (
    <div className="lgl-page">
      <section className="lgl-hero">
        <img
          className="lgl-hero__bg"
          src="https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=1800&q=80"
          alt=""
          aria-hidden="true"
        />
        <div className="lgl-hero__overlay" aria-hidden="true" />
        <div className="lgl-hero__content">
          <span className="lgl-eyebrow">
            <FiFileText size={14} /> Affection Health Sciences
          </span>
          <h1 className="lgl-hero__heading">Terms &amp; Conditions</h1>
          <p className="lgl-hero__sub">
            The rules and agreements that govern your use of our website and products.
          </p>
        </div>
      </section>

      <div className="lgl-body">
        <span className="lgl-updated">Last updated: June 2026</span>

        <p className="lgl-intro">
          Please read these Terms and Conditions carefully before using the
          Affection Health Sciences website or purchasing any of our products.
          These Terms form a binding agreement between you and Affection Health
          Sciences.
        </p>

        {SECTIONS.map((section) => (
          <div key={section.id} id={section.id} className="lgl-section">
            <h2 className="lgl-section__heading">{section.heading}</h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i} className="lgl-section__text">{p}</p>
            ))}
            {section.list && (
              <ul className="lgl-section__list">
                {section.list.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
          </div>
        ))}

        <hr className="lgl-divider" />

        <div className="lgl-section">
          <h2 className="lgl-section__heading">12. Contact Us</h2>
          <p className="lgl-section__text">
            For any questions about these Terms and Conditions, reach out to us:
          </p>
          <div className="lgl-contact-card">
            <p>B109 Satellite Town, Rawalpindi, Pakistan</p>
            <p><a href="mailto:info@affectionhealthsciences.com">info@affectionhealthsciences.com</a></p>
            <p><a href="https://wa.me/923319845081" target="_blank" rel="noopener noreferrer">+92 331 9845081</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
