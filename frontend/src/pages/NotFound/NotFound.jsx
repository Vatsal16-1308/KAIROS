import "./NotFound.css";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry, the page you're looking for doesn't exist.
        </p>

        <Link to="/" className="home-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;