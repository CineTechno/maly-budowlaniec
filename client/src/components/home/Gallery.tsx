import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: "kitchens" | "bathrooms" | "outdoor" | "repairs";
  imageUrl: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Modern Kitchen Renovation",
    description: "Complete kitchen remodel with custom cabinetry",
    category: "kitchens",
    imageUrl: "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Luxury Bathroom Remodel",
    description: "Spa-inspired bathroom with premium fixtures",
    category: "bathrooms",
    imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Custom Wood Deck",
    description: "Cedar deck with built-in seating and pergola",
    category: "outdoor",
    imageUrl: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Drywall Repair",
    description: "Seamless drywall repair and painting",
    category: "repairs",
    imageUrl: "https://images.unsplash.com/photo-1581876832484-c2c67f475688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Rustic Kitchen Makeover",
    description: "Farmhouse-inspired kitchen with butcher block counters",
    category: "kitchens",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Guest Bathroom Remodel",
    description: "Modern guest bathroom with custom tile work",
    category: "bathrooms",
    imageUrl: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

type FilterCategory = "all" | "kitchens" | "bathrooms" | "outdoor" | "repairs";

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  
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

  const filteredItems = activeFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Work</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Browse through our portfolio of completed projects
          </p>
        </motion.div>
        
        {/* Gallery Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            className={`px-4 py-2 rounded-full ${activeFilter === "all" ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-primary-100"} transition-colors`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-full ${activeFilter === "kitchens" ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-primary-100"} transition-colors`}
            onClick={() => setActiveFilter("kitchens")}
          >
            Kitchens
          </button>
          <button 
            className={`px-4 py-2 rounded-full ${activeFilter === "bathrooms" ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-primary-100"} transition-colors`}
            onClick={() => setActiveFilter("bathrooms")}
          >
            Bathrooms
          </button>
          <button 
            className={`px-4 py-2 rounded-full ${activeFilter === "outdoor" ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-primary-100"} transition-colors`}
            onClick={() => setActiveFilter("outdoor")}
          >
            Outdoor
          </button>
          <button 
            className={`px-4 py-2 rounded-full ${activeFilter === "repairs" ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-primary-100"} transition-colors`}
            onClick={() => setActiveFilter("repairs")}
          >
            Repairs
          </button>
        </motion.div>
        
        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {filteredItems.map((item) => (
            <motion.div 
              key={item.id} 
              className="gallery-item rounded-lg overflow-hidden shadow-md cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-64 object-cover" 
              />
              <div className="p-4 bg-white">
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
