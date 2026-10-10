import Navbar from "../../components/layout/Navbar/Navbar";
import Hero from "../../components/home/Hero/Hero";
import Categories from "../../components/home/Categories/Categories";
import FeaturedEvents from "../../components/home/FeaturedEvents/FeaturedEvents";
import WhyKairos from "../../components/home/WhyKairos/WhyKairos";
import CTA from "../../components/home/CTA/CTA";
import Footer from "../../components/home/Footer/Footer";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

function Home() {
  return (
    <>
    <ThemeToggle />
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedEvents />
      <WhyKairos />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;