import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
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
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Szybkie Linki</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Usługi</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Cennik</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white transition-colors">Galeria</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Kontakt</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Polityka Prywatności</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Warunki Usługi</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Mały Budowlaniec. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
