import "./WhyKairos.css";
import {
  FaBolt,
  FaShieldAlt,
  FaBell,
  FaTicketAlt,
} from "react-icons/fa";

function WhyKairos() {
  const features = [
    {
      icon: <FaBolt />,
      title: "Fast Booking",
      desc: "Reserve your seat in just a few clicks.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Verified Organizers",
      desc: "Attend events hosted by trusted organizers.",
    },
    {
      icon: <FaBell />,
      title: "Instant Updates",
      desc: "Get notified about registrations and event changes.",
    },
    {
      icon: <FaTicketAlt />,
      title: "Digital Tickets",
      desc: "Access your tickets anytime from your dashboard.",
    },
  ];

  return (
    <section className="why-kairos">

      <div className="section-title">
        <h2>Why Choose Kairos?</h2>
        <p>Everything you need to discover and manage campus events.</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>

            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.desc}</p>

          </div>
        ))}
      </div>

    </section>
  );
}

export default WhyKairos;