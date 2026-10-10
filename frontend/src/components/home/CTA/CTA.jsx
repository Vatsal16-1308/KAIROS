import "./CTA.css";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta">
      <div className="cta-content">
        <h2>Ready to Host Your Own Event?</h2>
        <p>
          Create, manage and grow your campus events with Kairos.
        </p>
        <button onClick={() => navigate("/register")}>Become an Organizer</button>
      </div>
    </section>
  );
}

export default CTA;