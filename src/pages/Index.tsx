import { Header } from "@/components/NavBar/Header";
import { Footer } from "@/components/Footer/Footer";
import Contact from "@/components/Contact/Contact";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "@/components/Home/Hero";
import Products from "@/components/Products/Products";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to section when navigating from other pages
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen pt-20 bg-[#fbfbfb] dark:bg-black relative">
      {/* <div className="absolute top-0 bottom-0 left-[5%] sm:left-[10%] md:left-[8%] w-px bg-purple-400 z-[41]"></div>
      <div className="absolute top-0 bottom-0 right-[5%] sm:right-[10%] md:right-[8%] w-px  bg-purple-400 z-[41]"></div> */}
      <section id="products">
        <Header />
      </section>
      <Hero />
      <section id="products">
        <Products />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
