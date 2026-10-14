import ClientMarquee from "@/components/ClientMarquee";
import Contact from "@/components/Contact";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Insights from "@/components/Insights";
import ScrollEffects from "@/components/ScrollEffects";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WhoWeHelp from "@/components/WhoWeHelp";
import WhyMnv from "@/components/WhyMnv";

export default function Home() {
  return (
    <>
      <ScrollEffects />
      <Header />
      <main id="main">
        <Hero />
        <ClientMarquee />
        <Services />
        <WhoWeHelp />
        <WhyMnv />
        <Insights />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
