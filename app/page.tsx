import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Divisions from "@/components/sections/Divisions";
import Products from "@/components/sections/Products";
import Process from "@/components/sections/Process";
import GlobalReach from "@/components/sections/GlobalReach";
import Founder from "@/components/sections/Founder";
import WhyUs from "@/components/sections/WhyUs";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Divisions />
        <Products />
        <Process />
        <GlobalReach />
        <Founder />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
