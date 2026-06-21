import React, { useState, useEffect, useRef } from "react";
import "../style/Aboutpage.css";

/* ============================================================
   STAFF IMAGES
   Path: src/assets/staff/
   Filenames match what's actually in the folder right now.
   002 (Muhammad Sheraz / Nutritionist) is missing on disk, so it
   temporarily reuses 001.png — swap in the real file whenever
   it's ready, no other code needs to change.
   ============================================================ */
const STAFF_IMG_BASE = "/src/assets/staff/";
import unsplash from "../assets/staff/p2222.png"; // placeholder until real CEO photo is added
const STAFF_IMG = {
  ceo: `${STAFF_IMG_BASE}ceo.png`,
  nutritionist: `${STAFF_IMG_BASE}001.png`, // TODO: replace with 002.png once added
  marketing: `${STAFF_IMG_BASE}003.jpeg`,
  central: `${STAFF_IMG_BASE}004.jpeg`,
  south: `${STAFF_IMG_BASE}005.png`,
};

/* ============================================================
   CERTIFICATE IMAGES
   Path: src/assets/Certificates/ (capital C, matches the folder)
   001–004 are .png, 005–009 are .jpeg — matches what's on disk.
   ============================================================ */
const CERT_IMG_BASE = "/src/assets/Certificates/";
const CERT_IMG = [
  `${CERT_IMG_BASE}001.png`,
  `${CERT_IMG_BASE}002.jpg`,
  `${CERT_IMG_BASE}003.png`,
  `${CERT_IMG_BASE}004.png`,
  `${CERT_IMG_BASE}005.jpeg`,
  `${CERT_IMG_BASE}006.jpeg`,
  `${CERT_IMG_BASE}007.jpeg`,
  `${CERT_IMG_BASE}008.jpeg`,
  `${CERT_IMG_BASE}009.jpeg`,
];

/* ============================================================
   DATA
   ============================================================ */

const LEADERSHIP = [
  {
    id: "ceo",
    name: "Mr. Sheraz Ahmed",
    role: "Chief Executive Officer",
    img: STAFF_IMG.ceo,
    pos: "center 20%", // nudge down/up here if face is cropped
    desc: "Sets the company's direction and oversees every function from R&D to field operations, with a long-standing focus on ethical pharma practice and sustainable growth across Pakistan.",
    tone: "violet",
    isCeo: true,
  },
  {
    id: "nutritionist",
    name: "Mr. Muhammad Sheraz",
    role: "Product Manager & Nutritionist",
    img: STAFF_IMG.nutritionist,
    pos: "center 15%",
    desc: "Leads CNE/CME product presentations, employee training, and product literature design — translating clinical nutrition science into materials the field team can use with confidence.",
    tone: "emerald",
  },
  {
    id: "marketing",
    name: "Mr Zahid Mehmood Raja",
    role: "National Sales Manager",
    img: STAFF_IMG.marketing,
    pos: "center 15%",
    desc: "Leads and executes national sales strategy to achieve sales, market share, and profitability targets while driving field force performance and business growth — managing, coaching, and developing the sales team and strengthening key healthcare partnerships.",
    tone: "amber",
  },
  {
    id: "central",
    name: "Mr. Nasir Pervaiz",
    role: "Sales Manager — Central Punjab",
    img: STAFF_IMG.central,
    pos: "center 5%", // this photo sits low/wide in frame, pull crop up
    desc: "Develops and implements sales and marketing strategies to achieve business growth, increase market share, and meet revenue targets, building strong relationships with healthcare professionals and distributors.",
    tone: "teal",
  },
  {
    id: "south",
    name: "Mr. Muhammad Shahbaz Khan",
    role: "Sales Manager — South Region",
    img: STAFF_IMG.south,
    pos: "center 10%",
    desc: "Develops and implements sales and marketing strategies to achieve business growth, increase market share, and meet revenue targets, executing effective product promotion and market development initiatives.",
    tone: "violet",
  },
];

/* ============================================================
   AWARDS & RECOGNITION
   Path: src/assets/awards/
   001.jpeg .. 003.jpeg
   ============================================================ */
const AWARDS_IMG_BASE = "/src/assets/awards/";
const AWARDS = [
  { id: 1, img: `${AWARDS_IMG_BASE}001.jpeg`, alt: "Go Global Awards 2023 Finalist" },
  { id: 2, img: `${AWARDS_IMG_BASE}002.jpeg`, alt: "2025 Go Global Awards Nominee" },
  { id: 3, img: `${AWARDS_IMG_BASE}003.jpeg`, alt: "Go Global Awards 2025 Nominee" },
];

const CERTIFICATIONS = CERT_IMG.map((src, i) => ({
  id: i + 1,
  img: src,
}));

/* About Company — story copy + what-we-do copy + collage images.
   All images are Unsplash placeholders — swap the `src` values once
   real facility/product photography is available. */
const ABOUT_COMPANY = {
  story: [
    "Affection Health Sciences was built around a simple observation: the supplements reaching Pakistani households rarely matched the science doctors were actually citing. We set out to close that gap — sourcing formulations backed by published clinical nutrition research, then putting them in front of physicians before they ever reach a shelf.",
    "Today our field force trains alongside the healthcare professionals they serve, our manufacturing partners answer to nine independent certification bodies, and every product carries literature our own Product Management team has reviewed line by line.",
  ],
  whatWeDo:
    "We research, formulate, and distribute clinical-grade nutrition and wellness products — supporting healthcare professionals with CNE/CME presentations, training our own sales force to the same standard, and holding every batch to GMP and DRAP-compliant manufacturing.",
  images: [
    {
      id: "facility",
      src: unsplash, // placeholder until real facility photo is added
      alt: "Pharmaceutical manufacturing facility",
    },
    {
      id: "research",
      src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop",
      alt: "Clinical nutrition research",
    },
    {
      id: "team",
      src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&h=400&fit=crop",
      alt: "Healthcare training session",
    },
  ],
};

/* ============================================================
   HELPERS
   ============================================================ */

function getInitials(name) {
  return name
    .replace(/^Mr\.|^Mrs\.|^Ms\.|^Dr\./, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function handleImgError(e) {
  e.target.style.display = "none";
  e.target.parentElement.classList.add("abt-img-fallback");
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function Aboutpage() {
  const [visible, setVisible] = useState({});
  const observeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [entry.target.dataset.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );
    const nodes = observeRef.current?.querySelectorAll("[data-id]");
    nodes?.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="abt-pg">
      {/* ================= HERO ================= */}
      <section className="abt-hero">
        <video
          className="abt-hero__video"
          src="/src/assets/videos/about.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="abt-hero__overlay" />
        <div className="abt-hero__content">
          <span className="abt-eyebrow">Affection Health Sciences</span>
          <h1 className="abt-hero__heading">
            Built on <em>science</em>,<br />carried by <em>people</em>
          </h1>
          <p className="abt-hero__sub">
            For over a decade we've connected clinical nutrition research with the people who
            need it — through a field force trained alongside doctors, and a quality system
            audited at every stage.
          </p>
        </div>
      </section>

      {/* ================= ABOUT COMPANY ================= */}
      <section className="abt-company" ref={observeRef}>
        <div className="abt-company__inner">
          <div className={`abt-company__copy ${visible.copy ? "is-visible" : ""}`} data-id="copy">
            <span className="abt-eyebrow abt-eyebrow--dark">Who We Are</span>
            <h2 className="abt-company__heading">About Affection Health Sciences</h2>
            {ABOUT_COMPANY.story.map((para, i) => (
              <p className="abt-company__para" key={i}>
                {para}
              </p>
            ))}

            <div className="abt-company__divider" />

            <h3 className="abt-company__subheading">What We Do</h3>
            <p className="abt-company__para abt-company__para--what">{ABOUT_COMPANY.whatWeDo}</p>
          </div>

          <div
            className={`abt-company__collage ${visible.collage ? "is-visible" : ""}`}
            data-id="collage"
          >
            <div className="abt-collage__large">
              <img
                src={ABOUT_COMPANY.images[0].src}
                alt={ABOUT_COMPANY.images[0].alt}
                className="abt-collage__img"
              />
            </div>
            <div className="abt-collage__small-row">
              <div className="abt-collage__small">
                <img
                  src={ABOUT_COMPANY.images[1].src}
                  alt={ABOUT_COMPANY.images[1].alt}
                  className="abt-collage__img"
                />
              </div>
              <div className="abt-collage__small">
                <img
                  src={ABOUT_COMPANY.images[2].src}
                  alt={ABOUT_COMPANY.images[2].alt}
                  className="abt-collage__img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP ================= */}
      <section className="abt-team">
        <div className="abt-team__head">
          <span className="abt-eyebrow abt-eyebrow--dark">Leadership</span>
          <h2 className="abt-team__heading">The people behind the formulations</h2>
        </div>

        {/* CEO anchor node */}
        <div className="abt-ceo-row">
          <CeoCard data={LEADERSHIP[0]} />
        </div>

        {/* connecting stem */}
        <div className="abt-stem">
          <span className="abt-stem__line" />
        </div>

        {/* team fan-out */}
        <div className="abt-team__grid">
          {LEADERSHIP.slice(1).map((member) => (
            <TeamCard key={member.id} data={member} />
          ))}
        </div>
      </section>

      {/* ================= AWARDS & RECOGNITION ================= */}
      <section className="abt-awards">
        <div className="abt-awards__head">
          <span className="abt-eyebrow">Recognition</span>
          <h2 className="abt-awards__heading">Awards &amp; collaborations</h2>
          <p className="abt-awards__sub">
            International recognition for the work happening on the ground.
          </p>
        </div>

        <div className="abt-awards__grid">
          {AWARDS.map((a) => (
            <div key={a.id} className="abt-awards__card">
              <img src={a.img} alt={a.alt} className="abt-awards__img" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= CERTIFICATIONS ================= */}
      <section className="abt-certs">
        <div className="abt-certs__head">
          <span className="abt-eyebrow">Compliance</span>
          <h2 className="abt-certs__heading">Standards we answer to</h2>
          <p className="abt-certs__sub">
            Independent bodies audit our facilities, ingredients, and processes year-round.
          </p>
        </div>

        <div className="abt-certs__wall">
          {CERTIFICATIONS.map((c) => (
            <div key={c.id} className="abt-seal">
              <img src={c.img} alt={`Certification ${c.id}`} className="abt-seal__img" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function CeoCard({ data }) {
  return (
    <div className="abt-ceo-card">
      <div className="abt-ceo-card__img-wrap">
        <img
          src={data.img}
          alt={data.name}
          className="abt-ceo-card__img"
          style={data.pos ? { objectPosition: data.pos } : undefined}
          onError={handleImgError}
        />
        <span className="abt-ceo-card__initials">{getInitials(data.name)}</span>
        <span className="abt-ceo-card__badge">Chief Executive</span>
      </div>
      <div className="abt-ceo-card__body">
        <h3 className="abt-ceo-card__name">{data.name}</h3>
        <p className="abt-ceo-card__role">{data.role}</p>
        <p className="abt-ceo-card__desc">{data.desc}</p>
      </div>
    </div>
  );
}

function TeamCard({ data }) {
  return (
    <div className={`abt-card abt-card--${data.tone}`}>
      <div className="abt-card__img-wrap">
        <img
          src={data.img}
          alt={data.name}
          className="abt-card__img"
          style={data.pos ? { objectPosition: data.pos } : undefined}
          onError={handleImgError}
        />
        <span className="abt-card__initials">{getInitials(data.name)}</span>
      </div>
      <div className="abt-card__body">
        <h4 className="abt-card__name">{data.name}</h4>
        <p className="abt-card__role">{data.role}</p>
        <p className="abt-card__desc">{data.desc}</p>
      </div>
    </div>
  );
}