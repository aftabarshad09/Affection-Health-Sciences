import { Component } from "react";
import "./ErrorBoundary.css";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="eb-page">
        <div className="eb-content">
          <span className="eb-eyebrow">Something went wrong</span>
          <h1 className="eb-title">We hit a snag.</h1>
          <p className="eb-lede">
            An unexpected error occurred while loading this page. Try reloading —
            if the problem keeps happening, please get in touch with us.
          </p>
          <button type="button" className="eb-btn" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
