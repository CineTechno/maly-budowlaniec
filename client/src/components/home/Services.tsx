import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Wrench,
  Utensils,
  Bath,
  Grid3x3,
  Lightbulb,
  Trees,
} from "lucide-react";
import React from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  iconBgColor: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "Naprawy Ogólne",
    description:
      "Naprawiamy wszystko od cieknących kranów po uszkodzone ściany, dbając o idealny stan Twojego domu.",
    icon: Wrench,
    iconBgColor: "bg-blue-100",
  },
  {
    id: 2,
    title: "Remonty Kuchni",
    description:
      "Przekształć swoją kuchnię dzięki niestandardowym szafkom, blatom i instalacji urządzeń pasujących do Twojego stylu.",
    icon: Utensils,
    iconBgColor: "bg-orange-100",
  },
  {
    id: 3,
    title: "Remonty Łazienek",
    description:
      "Stwórz domowe spa z nowoczesnymi armaturami, niestandardowymi płytkami i efektywnym układem przestrzeni.",
    icon: Bath,
    iconBgColor: "bg-blue-100",
  },
  {
    id: 4,
    title: "Usługi Płytkarskie",
    description:
      "Profesjonalny montaż płytek ceramicznych, porcelanowych i kamienia naturalnego na podłogi, ściany i backsplashe.",
    icon: Grid3x3,
    iconBgColor: "bg-orange-100",
  },
  {
    id: 5,
    title: "Prace Elektryczne",
    description:
      "Lekkie usługi elektryczne, w tym montaż opraw, naprawa gniazdek i modernizacja oświetlenia.",
    icon: Lightbulb,
    iconBgColor: "bg-blue-100",
  },
  {
    id: 6,
    title: "Usługi Zewnętrzne",
    description:
      "Budowa tarasów, montaż ogrodzeń i aranżacja krajobrazu, aby ulepszyć Twoją przestrzeń na świeżym powietrzu.",
    icon: Trees,
    iconBgColor: "bg-orange-100",
  },
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
    <section id="services" className="py-8 md:py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Nasze Usługi
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            {/*Od drobnych napraw domowych po kompletne remonty, nasz wykwalifikowany zespół zajmie się wszystkim*/}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
              <div className="p-8">
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-full ${service.iconBgColor} flex items-center justify-center shadow-md`}
                >
                  <service.icon className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                  {service.title}
                </h3>
                {/*<p className="text-gray-600 text-center leading-relaxed">*/}
                {/*  {service.description}*/}
                {/*</p>*/}
                <div className="mt-6 text-center">
                  {/*<a */}
                  {/*  href="#contact" */}
                  {/*  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"*/}
                  {/*>*/}
                  {/*Dowiedz się więcej*/}
                  {/*<ChevronRight className="ml-1 h-4 w-4" />*/}
                  {/*</a>*/}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
