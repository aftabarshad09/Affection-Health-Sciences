import { FiShield } from "react-icons/fi";
import "../style/Legal.css";

const SECTIONS = [
  {
    id: "information-we-collect",
    heading: "1. Information We Collect",
    paragraphs: [
      "We collect information you give us directly — such as your name, email address, phone number, shipping address, and order details when you place an order, sign up for our newsletter, or contact us through the website.",
      "We also automatically collect limited technical information when you browse our site, including your IP address, browser type, device information, and pages visited, through standard analytics tools.",
    ],
  },
  {
    id: "how-we-use-it",
    heading: "2. How We Use Your Information",
    list: [
      "<strong>Order fulfillment:</strong> to process, ship, and provide support for orders you place with us.",
      "<strong>Communication:</strong> to respond to enquiries, send order updates, and — only if you've opted in — send newsletters about products and wellness content.",
      "<strong>Improvement:</strong> to understand how visitors use our site so we can improve products, content, and the shopping experience.",
      "<strong>Legal and safety:</strong> to comply with applicable law and protect against fraud or misuse of our services.",
    ],
  },
  {
    id: "cookies",
    heading: "3. Cookies & Tracking",
    paragraphs: [
      "Our website uses cookies and similar technologies to keep the site functioning correctly, remember your preferences, and understand aggregate traffic patterns. You can disable cookies in your browser settings, though some parts of the site may not function as intended without them.",
    ],
  },
  {
    id: "sharing",
    heading: "4. How We Share Information",
    paragraphs: [
      "We do not sell your personal information to third parties. We may share information with trusted service providers who help us operate our business — such as payment processors, courier and logistics partners, and email/communication tools — strictly for the purpose of providing our services to you.",
      "We may also disclose information if required by law, regulation, or a valid legal request from a competent authority.",
    ],
  },
  {
    id: "security",
    heading: "5. Data Security",
    paragraphs: [
      "We take reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. No method of transmission or storage is completely secure, but we work to maintain industry-appropriate safeguards across our website and order-processing systems.",
    ],
  },
  {
    id: "your-rights",
    heading: "6. Your Rights & Choices",
    list: [
      "You can request access to the personal information we hold about you.",
      "You can ask us to correct inaccurate or incomplete information.",
      "You can unsubscribe from marketing emails at any time using the link in any newsletter we send.",
      "You can request that we delete your personal information, subject to any legal or order-history retention obligations.",
    ],
    closing:
      "To exercise any of these rights, contact us using the details at the bottom of this page.",
  },
  {
    id: "childrens-privacy",
    heading: "7. Children's Privacy",
    paragraphs: [
      "Our products include formulations intended for infants and children, used under the guidance of a parent, guardian, or healthcare provider. Our website itself is not directed at children, and we do not knowingly collect personal information directly from children online.",
    ],
  },
  {
    id: "changes",
    heading: "8. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. The \"Last updated\" date at the top of this page indicates when this policy was last revised. We encourage you to review this page periodically.",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="lgl-page">
      <section className="lgl-hero">
        <img
          className="lgl-hero__bg"
          src="https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=1800&q=80"
          alt=""
          aria-hidden="true"
        />
        <div className="lgl-hero__overlay" aria-hidden="true" />
        <div className="lgl-hero__content">
          <span className="lgl-eyebrow">
            <FiShield size={14} /> Affection Health Sciences
          </span>
          <h1 className="lgl-hero__heading">Privacy Policy</h1>
          <p className="lgl-hero__sub">
            How we collect, use, and protect the information you share with us.
          </p>
        </div>
      </section>

      <div className="lgl-body">
        <span className="lgl-updated">Last updated: June 2026</span>

        <p className="lgl-intro">
          Affection Health Sciences ("we", "us", "our") respects your privacy. This
          Privacy Policy explains what information we collect when you visit our
          website or purchase our products, how we use it, and the choices you have.
          By using our website, you agree to the practices described below.
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
            {section.closing && <p className="lgl-section__text">{section.closing}</p>}
          </div>
        ))}

        <hr className="lgl-divider" />

        <div className="lgl-section">
          <h2 className="lgl-section__heading">9. Contact Us</h2>
          <p className="lgl-section__text">
            If you have questions about this Privacy Policy or how we handle your
            information, reach out to us:
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
