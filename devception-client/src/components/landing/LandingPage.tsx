'use client';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import WhatIsSection from './WhatIsSection';
import HowItWorksSection from './HowItWorksSection';
import LiveDemoSection from './LiveDemoSection';
import RoleDossiersSection from './RoleDossiersSection';
import BlogSection from './BlogSection';
import FAQSection from './FAQSection';
import FinalCTASection from './FinalCTASection';
import Footer from './Footer';
import './landing.css';

export default function LandingPage() {
  return (
    <div className="landing-root">
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <HowItWorksSection />
      <LiveDemoSection />
      <RoleDossiersSection />
      <BlogSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
