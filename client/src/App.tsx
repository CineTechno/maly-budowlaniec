import './App.css'
import React from 'react'
import Navbar from "./components/home/Navbar.tsx";
import Hero from './components/home/Hero.tsx';
import Services from "./components/home/Services.tsx";
import Pricing from "./components/home/Pricing.tsx";

function App() {

  return (
    <div>
      <Navbar></Navbar>
        <Hero></Hero>
        <Services></Services>
        <Pricing></Pricing>
    </div>
  )
}

export default App
