import { useState, useRef } from "react";
import "./FAQ.css";

const FAQS = [
  {
    q: "Are your products lab-tested before release?",
    a: "Every batch is tested by an independent, third-party lab before it ships — for potency, purity, and contaminants. Certificates of analysis are available on request for any product.",
  },
  {
    q: "Do you use artificial fillers, colors, or preservatives?",
    a: "No. Our formulations avoid artificial fillers, synthetic colors, and unnecessary preservatives. If an ingredient is listed, it's there because it serves the formula — not the shelf life.",
  },
  {
    q: "How long does delivery take within Pakistan?",
    a: "Orders within major cities typically arrive in 2–4 business days. Other regions may take 4–7 business days depending on courier coverage. You'll receive tracking details as soon as your order ships.",
  },
  {
    q: "Can I return a product if it doesn't work for me?",
    a: "Yes — unopened products can be returned within 14 days of delivery for a full refund. Opened products are eligible for a one-time replacement if there's a genuine quality concern.",
  },
  {
    q: "Are your supplements suitable for daily long-term use?",
    a: "Most of our formulations are designed for sustained daily use. That said, we recommend reviewing the dosage guidance on each product page and checking with a healthcare provider if you have an existing condition.",
  },
  {
    q: "Do you offer bulk pricing for clinics or retailers?",
    a: "Yes. We work with clinics, gyms, and retail partners on volume pricing and custom packaging. Reach out through the contact form and our team will follow up with a tailored quote.",
  },
];

function FaqItem({ item, index, isOpen, onToggle }) {
  const panelRef = useRef(null);

  return (
    <div className={`faq-item ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="faq-item__trigger"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-trigger-${index}`}
        onClick={() => onToggle(index)}
      >
        <span className="faq-item__index">{String(index + 1).padStart(2, "0")}</span>
        <span className="faq-item__question">{item.q}</span>
        <span className="faq-item__icon" aria-hidden="true">
          <span className="faq-item__icon-line faq-item__icon-line--h" />
          <span className="faq-item__icon-line faq-item__icon-line--v" />
        </span>
      </button>

      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-trigger-${index}`}
        className="faq-item__panel"
        ref={panelRef}
        style={{
          maxHeight: isOpen ? `${panelRef.current?.scrollHeight ?? 400}px` : "0px",
        }}
      >
        <p className="faq-item__answer">{item.a}</p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-section__inner">
        <div className="faq-section__intro">
          <span className="faq-section__eyebrow">FAQ</span>
          <h2 id="faq-heading" className="faq-section__heading">
            Questions,<br />answered.
          </h2>
          <p className="faq-section__lede">
            Everything we get asked most — about formulation, shipping, and what happens after you order. Can't find it here? Reach out directly.
          </p>
          <a href="#contact" className="faq-section__contact-link">
            <span>Ask us directly</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="faq-section__list">
          {FAQS.map((item, index) => (
            <FaqItem
              key={item.q}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}