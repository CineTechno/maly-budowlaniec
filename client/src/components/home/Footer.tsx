import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
          <div>
            <a href="#hero" className="text-2xl font-bold">Mały Budowlaniec</a>
            <p className="mt-4 text-gray-400">
              Twój zaufany partner we wszystkich usługach remontowo-budowlanych. Zapewniamy najwyższą jakość usług dla klientów prywatnych i firm deweloperskich.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-800 text-gray-400">
          <p>© {new Date().getFullYear()} Mały Budowlaniec. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
