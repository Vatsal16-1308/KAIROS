import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-logo">
        <h2>KAIROS</h2>
        <p>Discover. Book. Experience.</p>
      </div>

      <div className="footer-links">

        <a href="/">Home</a>
        <a href="/events">Events</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>

      </div>

      <div className="footer-bottom">

        © 2026 Kairos. All rights reserved.

      </div>

    </footer>
  );
}

export default Footer;