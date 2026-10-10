import Navbar from "../components/layout/Navbar/Navbar";

function OrganizerLayout({ children }) {
  return (
    <div className="organizer-layout">
      <Navbar />
      <main className="organizer-main-content">{children}</main>
    </div>
  );
}

export default OrganizerLayout;
