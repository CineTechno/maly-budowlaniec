import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Pricing from "@/components/home/Pricing";
import Gallery from "@/components/home/Gallery";
import Calendar from "@/components/home/Calendar";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {


  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      <Navbar />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Pricing />
      {/*<Gallery />*/}
      {/*<Calendar />*/}
      {/*<Contact />*/}
      {/*<Footer />*/}
      {/*<ChatWidget />*/}
    </div>
  );
}
