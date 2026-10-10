import "./Hero.css";
import hero from "../../../assets/images/hero.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaRocket, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaArrowRight } from "react-icons/fa";

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.25) 0%, transparent 40%), linear-gradient(rgba(11, 15, 25, 0.85), rgba(11, 15, 25, 0.95)), url(${hero})`,
      }}
    >
      <div className="hero-overlay">
        <div className="hero-left">
          <span className="hero-tag">
            <FaRocket className="rocket-icon" /> Discover Campus Events
          </span>

          <h1>
            Your Next <br />
            <span className="gradient-text">Campus Experience</span> <br />
            Starts Here.
          </h1>

          <p>
            Book hackathons, AI workshops, live music concerts, e-sports tournaments, and cultural fests happening near you.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/events")}>
              <span>Explore 12+ Events</span>
              <FaArrowRight />
            </button>

            <button className="secondary-btn" onClick={() => navigate("/register")}>
              Host An Event
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h2>120+</h2>
              <span>Active Events</span>
            </div>

            <div className="stat-item">
              <h2>20K+</h2>
              <span>Students Joined</span>
            </div>

            <div className="stat-item">
              <h2>40+</h2>
              <span>Colleges</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-featured-card">
            <span className="hero-badge">
              🔥 Spotlight Event
            </span>

            <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop" alt="Featured Campus Event" />

            <div className="hero-card-content">
              <h3>AI Innovation Summit 2026</h3>
              <p><FaMapMarkerAlt className="icon-purple" /> Main Auditorium</p>
              <p><FaCalendarAlt className="icon-pink" /> 24 Aug 2026</p>

              <div className="hero-card-footer">
                <span className="price-pill">FREE PASS</span>
                <Link to="/events/1">
                  <button className="hero-book-btn">Book Now</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;