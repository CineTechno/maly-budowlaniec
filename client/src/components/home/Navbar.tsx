import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Menu, X, User } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
// import { Link } from "wouter";
import React from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  return (
      <header className={`fixed w-full bg-white shadow-md z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <a href="#hero" className="flex items-center">
                <span className="text-blue-600 text-2xl font-bold ml-2">Mały Budowlaniec</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150">Usługi</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150">Cennik</a>
              <a href="#gallery" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150">Galeria</a>
              <a href="#calendar" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150">Kalendarz</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 font-medium transition duration-150">Kontakt</a>
              {/*<Link to="/admin/login" className="text-gray-800 hover:text-blue-600 font-medium transition duration-150 flex items-center">*/}
              {/*  <User className="h-4 w-4 mr-1" />*/}
              {/*  Admin*/}
              {/*</Link>*/}
            </nav>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                    <X className="h-6 w-6 text-gray-500" />
                ) : (
                    <Menu className="h-6 w-6 text-gray-500" />
                )}
              </Button>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                  className="bg-orange-500 text-white hover:bg-orange-600"
                  asChild
              >
                <a href="#contact">Wycena</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden bg-white border-t border-gray-200 ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
                href="#services"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
            >
              Usługi
            </a>
            <a
                href="#pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
            >
              Cennik
            </a>
            <a
                href="#gallery"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
            >
              Galeria
            </a>
            <a
                href="#calendar"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
            >
              Kalendarz
            </a>
            <a
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
            >
              Kontakt
            </a>
            {/*<Link*/}
            {/*    to="/admin/login"*/}
            {/*    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"*/}
            {/*    onClick={() => setIsMenuOpen(false)}*/}
            {/*>*/}
            {/*  <User className="h-4 w-4 mr-1" />*/}
            {/*  Admin*/}
            {/*</Link>*/}
            <a
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600 mt-4"
                onClick={() => setIsMenuOpen(false)}
            >
              Wycena
            </a>
          </div>
        </div>
      </header>
  );
}
