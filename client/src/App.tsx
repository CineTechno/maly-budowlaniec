import './App.css'
import React from 'react'
import Navbar from "./components/home/Navbar.tsx";
import Hero from './components/home/Hero.tsx';
import Services from "./components/home/Services.tsx";
import Pricing from "./components/home/Pricing.tsx";
import WhyChooseUs from "@/components/home/WhyChooseUs.tsx";
import Gallery from './components/home/Gallery.tsx';
import Calendar from "@/components/home/calendar/Calendar.tsx";

function App() {

  return (
    <div>
      <Navbar></Navbar>
        <Hero></Hero>
      <WhyChooseUs></WhyChooseUs>
        <Pricing></Pricing>
      <Gallery></Gallery>
      <Calendar></Calendar>

    </div>
  )
}

export default App
