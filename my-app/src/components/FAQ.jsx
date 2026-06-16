import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./FAQ.css";

// FAQ Data - Product focused for supplement brand
const faqData = [
  {
    id: 1,
    category: "Products",
    question: "What makes Affection supplements different?",
    answer:
      "Our supplements are scientifically formulated using premium, bioavailable ingredients. Each product undergoes rigorous third-party testing for purity and potency. We prioritize clean, transparent formulas with no unnecessary fillers or artificial additives.",
  },
  {
    id: 2,
    category: "Products",
    question: "Are your supplements suitable for all ages?",
    answer:
      "We offer specialized formulations for different life stages. Our baby nutrition range is designed for infants and toddlers, while our women's health line supports reproductive wellness. Always consult with a healthcare professional before starting any supplement regimen.",
  },
  {
    id: 3,
    category: "Products",
    question: "What is the difference between Whey Protein and Plant Protein?",
    answer:
      "Our Whey Protein is rapidly absorbed and ideal for post-workout recovery, containing all essential amino acids. We also offer plant-based alternatives derived from pea and brown rice protein for those with dairy sensitivities or plant-based preferences.",
  },
  {
    id: 4,
    category: "Products",
    question: "How should I take Glumin supplements?",
    answer:
      "Glumin (Glutamine) is best taken with meals or post-workout. The recommended dosage is 5-10g daily, mixed with water or your favorite beverage. Athletes often split the dose between morning and post-training for optimal recovery.",
  },
  {
    id: 5,
    category: "Nutrition",
    question: "Why is Zinc & Magnesium important for health?",
    answer:
      "Zinc supports immune function, protein synthesis, and wound healing, while Magnesium aids muscle function, sleep quality, and energy production. Together they form a powerhouse combination for athletic performance and overall wellness.",
  },
  {
    id: 6,
    category: "Nutrition",
    question: "What is Hepatic Nutrition support?",
    answer:
      "Our Hepatic Nutrition line is specially formulated to support liver health. It contains Milk Thistle, Artichoke Extract, and essential B-vitamins that promote natural detoxification pathways and maintain healthy liver function.",
  },
  {
    id: 7,
    category: "Nutrition",
    question: "Are these supplements safe for long-term use?",
    answer:
      "Our supplements are manufactured in GMP-certified facilities and follow strict quality guidelines. For long-term use, we recommend cycling certain products and consulting with your healthcare provider to ensure they align with your individual health needs.",
  },
  {
    id: 8,
    category: "Nutrition",
    question: "What is the recommended daily intake?",
    answer:
      "Recommended dosages vary by product and individual needs. Our packaging includes clear dosage instructions, and we recommend starting with the minimum effective dose. Always follow the label directions and consult your healthcare provider.",
  },
];

// Category filter options
const categories = ["All", "Products", "Nutrition"];

const FAQItem = ({ item, isOpen, onToggle }) => {
  return (
    <motion.div
      className={`faq-item ${isOpen ? "open" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <motion.button
        className="faq-question"
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="faq-question-text">{item.question}</span>
        <motion.span
          className="faq-icon"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaMinus /> : <FaPlus />}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="faq-answer-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRef = useRef(null);

  // Toggle FAQ item
  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Filter FAQs based on category and search
  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = faq.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Close FAQ when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target)) {
        setOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="faq-section" ref={sectionRef} id="faqs">
      <div className="faq-container">
        {/* Header */}
        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="faq-badge">FAQ</div>
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Find answers to common questions about our supplements, nutrition
            guidance, and product usage.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="faq-controls"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="faq-categories">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`faq-category-btn ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          <div className="faq-search">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="faq-search-input"
            />
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="faq-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <motion.div key={faq.id} variants={itemVariants}>
                <FAQItem
                  item={faq}
                  isOpen={openId === faq.id}
                  onToggle={handleToggle}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="faq-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No questions found matching your criteria.</p>
            </motion.div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="faq-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="faq-cta-text">
            Still have questions? We're here to help.
          </p>
          <motion.a
            href="#contact"
            className="faq-cta-btn"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact Our Nutrition Experts
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;