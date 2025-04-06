import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export default function Hero() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section 
      id="hero" 
      className="relative pt-24 bg-primary-700"
      ref={ref}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <div>
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
            >
              Professional Handyman & Building Services
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mt-4 text-lg text-white/90 max-w-lg"
            >
              A young professional team providing expert craftsmanship for private clients and development companies alike.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg"
                className="bg-secondary-500 text-white hover:bg-secondary-600"
                asChild
              >
                <a href="#services">Our Services</a>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white text-primary-600 hover:bg-gray-100"
                asChild
              >
                <a href="#contact">Contact Us</a>
              </Button>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-secondary-500 mr-2" 
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">Free Estimates</span>
              </div>
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-secondary-500 mr-2" 
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">Quality Guaranteed</span>
              </div>
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-secondary-500 mr-2" 
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">Insured & Bonded</span>
              </div>
            </motion.div>
          </div>
          <motion.div 
            variants={itemVariants}
            className="hidden md:block"
          >
            <img 
              src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
              alt="Professional handyman at work"
              className="rounded-lg shadow-2xl object-cover h-[500px] w-full" 
            />
          </motion.div>
        </motion.div>
      </div>
      <svg className="fill-white w-full h-16" viewBox="0 0 1440 48" preserveAspectRatio="none">
        <path d="M0,0 C480,48 960,48 1440,0 L1440,48 L0,48 Z"></path>
      </svg>
    </section>
  );
}
