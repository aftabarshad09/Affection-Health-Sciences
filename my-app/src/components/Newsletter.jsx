import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import "./Newsletter.css";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");

    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("done");
      setEmail("");
    } catch (err) {
      setStatus("idle");
    }
  };

  return (
    <section className="newsletter-strip" aria-labelledby="newsletter-heading">
      {/* <span className="newsletter-strip__ghost" aria-hidden="true">UPDATED</span> */}
      <span className="newsletter-strip__glow" aria-hidden="true" />

      <div className="newsletter-strip__inner">
        <div className="newsletter-strip__copy">
          <h2 id="newsletter-heading" className="newsletter-strip__heading">
            Stay updated
          </h2>
          <p className="newsletter-strip__subheading">
            New formulations, ingredient deep-dives, and early access — straight to your inbox, never your spam folder.
          </p>
        </div>

        <div className="newsletter-strip__form-block">
          <form className="newsletter-strip__form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status !== "idle"}
              className="newsletter-strip__input"
            />
            <button type="submit" className="newsletter-strip__submit" disabled={status !== "idle"}>
              {status === "done" ? (
                <>Subscribed <FiCheck aria-hidden="true" /></>
              ) : status === "submitting" ? (
                "Sending..."
              ) : (
                "Subscribe"
              )}
            </button>
          </form>

          <p className="newsletter-strip__privacy">
            We never share your email address.
          </p>
        </div>
      </div>
    </section>
  );
}