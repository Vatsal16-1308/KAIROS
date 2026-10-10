import Navbar from "../components/layout/Navbar/Navbar";

function UserLayout({ children }) {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="user-main-content">{children}</main>
    </div>
  );
}

export default UserLayout;
