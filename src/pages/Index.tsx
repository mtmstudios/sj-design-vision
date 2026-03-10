import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingSign from "@/components/FloatingSign";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <ProcessSection />
      <PortfolioSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <FloatingSign />
    </div>
  );
};

export default Index;
