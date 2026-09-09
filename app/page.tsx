import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Gallery from "@/components/Gallery";
import Faq from "@/components/Faq";
import Locations from "@/components/Locations";
import Contact from "@/components/Contact";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <SectionDivider />
      <Services />
      <Process />
      <Gallery />
      <SectionDivider />
      <Faq />
      <Locations />
      <Contact />
      <MapSection />
      <Footer />
    </>
  );
}
