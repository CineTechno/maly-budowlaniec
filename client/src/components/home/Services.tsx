import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "Naprawy Ogólne",
    description: "Naprawiamy wszystko od cieknących kranów po uszkodzone ściany, dbając o idealny stan Twojego domu.",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Remonty Kuchni",
    description: "Przekształć swoją kuchnię dzięki niestandardowym szafkom, blatom i instalacji urządzeń pasujących do Twojego stylu.",
    imageUrl: "https://images.unsplash.com/photo-1609766857041-ed402ea8e2c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Remonty Łazienek",
    description: "Stwórz domowe spa z nowoczesnymi armaturami, niestandardowymi płytkami i efektywnym układem przestrzeni.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Usługi Płytkarskie",
    description: "Profesjonalny montaż płytek ceramicznych, porcelanowych i kamienia naturalnego na podłogi, ściany i backsplashe.",
    imageUrl: "https://images.unsplash.com/photo-1575652479744-42e58ef3d906?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Prace Elektryczne",
    description: "Lekkie usługi elektryczne, w tym montaż opraw, naprawa gniazdek i modernizacja oświetlenia.",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Usługi Zewnętrzne",
    description: "Budowa tarasów, montaż ogrodzeń i aranżacja krajobrazu, aby ulepszyć Twoją przestrzeń na świeżym powietrzu.",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

export default function Services() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Nasze Usługi</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Od drobnych napraw domowych po kompletne remonty, nasz wykwalifikowany zespół zajmie się wszystkim
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((service) => (
            <motion.div 
              key={service.id} 
              className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group"
              variants={itemVariants}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                <p className="mt-2 text-gray-600">
                  {service.description}
                </p>
                <a 
                  href="#contact" 
                  className="mt-4 inline-flex items-center text-primary-500 hover:text-primary-600 font-medium"
                >
                  Dowiedz się więcej
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        

      </div>
    </section>
  );
}
