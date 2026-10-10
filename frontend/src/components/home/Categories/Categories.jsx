import "./Categories.css";
import { useNavigate } from "react-router-dom";
import {
  FaLaptopCode,
  FaMusic,
  FaBasketballBall,
  FaTheaterMasks,
  FaChalkboardTeacher,
  FaMicrophone,
} from "react-icons/fa";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    {
      icon: <FaLaptopCode />,
      title: "Hackathons",
      filter: "Hackathon",
    },
    {
      icon: <FaMusic />,
      title: "Music",
      filter: "Music",
    },
    {
      icon: <FaBasketballBall />,
      title: "Sports",
      filter: "Sports",
    },
    {
      icon: <FaTheaterMasks />,
      title: "Cultural Fest",
      filter: "Cultural Fest",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Workshops",
      filter: "Workshop",
    },
    {
      icon: <FaMicrophone />,
      title: "Seminars",
      filter: "Seminars",
    },
  ];

  return (
    <section className="categories">
      <h2>Browse Categories</h2>
      <p>
        Discover events based on your interests.
      </p>

      <div className="category-grid">
        {categories.map((item, index) => (
          <div
            className="category-card"
            key={index}
            onClick={() => navigate(`/events?category=${encodeURIComponent(item.filter)}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="category-icon">
              {item.icon}
            </div>
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;