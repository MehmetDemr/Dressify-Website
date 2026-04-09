import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <div className="nf-page">
      <div className="nf-content">
        <p className="nf-eyebrow">Error 404</p>
        <h1 className="nf-title">
          Lost in <br />
          <em>Style</em>
        </h1>
        <p className="nf-desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="nf-btn">
          Back to Home
        </Link>
      </div>

      <div className="nf-bg">
        <div className="nf-blob nf-blob--1" />
        <div className="nf-blob nf-blob--2" />
      </div>
    </div>
  );
}

export default NotFound;
