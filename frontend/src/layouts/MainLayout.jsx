import Navbar from "../layout/Navbar/Navbar";
import Footer from "../home/Footer/Footer";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
