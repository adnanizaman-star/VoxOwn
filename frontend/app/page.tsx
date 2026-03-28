import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
}
