import Navbar from "@/components/home/Navbar.tsx";
import Hero from "@/components/home/Hero.tsx";
import WhyChooseUs from "@/components/home/WhyChooseUs.tsx";
import Pricing from "@/components/home/Pricing.tsx";
import Gallery from "@/components/home/Gallery.tsx";
import Calendar from "@/components/home/calendar/Calendar.tsx";
import MyContact from "@/components/home/MyContact.tsx";
import Footer from "@/components/home/Footer.tsx";
import React from "react";

export default function Home() {
    return (
        <div>
            <Navbar></Navbar>
            <Hero></Hero>
            <WhyChooseUs></WhyChooseUs>
            <Pricing></Pricing>
            <Gallery></Gallery>
            <Calendar></Calendar>
            <MyContact></MyContact>
            <Footer></Footer>
        </div>
    );
}