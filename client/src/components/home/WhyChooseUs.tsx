import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { 
  Check, 
  Clock, 
  Heart, 
  ThumbsUp, 
  BadgeCheck, 
  Gem
} from "lucide-react";

interface Reason {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const reasons: Reason[] = [
  {
    id: 1,
    title: "Doświadczenie",
    description: "Ponad 10 lat doświadczenia w branży budowlanej, setki zadowolonych klientów.",
    icon: BadgeCheck
  },
  {
    id: 2,
    title: "Terminowość",
    description: "Zawsze dotrzymujemy terminów, szanując Twój czas i harmonogram.",
    icon: Clock
  },
  {
    id: 3,
    title: "Jakość",
    description: "Używamy tylko najlepszych materiałów i sprawdzonych technik.",
    icon: Gem
  },
  {
    id: 4,
    title: "Gwarancja",
    description: "Wszystkie nasze usługi objęte są pełną gwarancją.",
    icon: Check
  },
  {
    id: 5,
    title: "Zaufanie",
    description: "Dbamy o Twoje mienie jak o własne, zachowując porządek i czystość.",
    icon: Heart
  },
  {
    id: 6,
    title: "Zadowolenie",
    description: "Kompleksowa obsługa i doradztwo na każdym etapie realizacji.",
    icon: ThumbsUp
  }
];

export default function WhyChooseUs() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="why-choose-us" className="py-16 md:py-24 bg-gray-100" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Dlaczego Mały Budowlaniec to najlepszy wybór?</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Profesjonalizm, jakość i zadowolenie klienta to nasze główne priorytety
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ 
            duration: 0.5,
            staggerChildren: 0.1,
            delayChildren: 0.3
          }}
        >
          {reasons.map((reason, index) => (
            <motion.div 
              key={reason.id} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1
              }}
            >
              <div className="flex items-start">
                <div className="shrink-0 mr-4">
                  <div className="bg-primary-50 p-3 rounded-full">
                    <reason.icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{reason.title}</h3>
                  <p className="mt-2 text-gray-600">{reason.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}