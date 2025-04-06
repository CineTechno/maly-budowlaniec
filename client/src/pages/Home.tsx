import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Pricing from "@/components/home/Pricing";
import Gallery from "@/components/home/Gallery";
import Calendar from "@/components/home/Calendar";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  useEffect(() => {
    // Add smooth scrolling behavior
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const targetId = target.getAttribute('href');
      
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    // Add event listeners to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick as EventListener);
    });

    // Cleanup
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick as EventListener);
      });
    };
  }, []);

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      <Navbar />
      <Hero />
      <Services />
      <Pricing />
      <Gallery />
      <Calendar />
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  );
}
