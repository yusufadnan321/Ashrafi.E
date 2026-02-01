import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useFirebaseData } from '../hooks/useFirebaseData';

const Home = () => {
  const { data: projects, loading: projectsLoading } = useFirebaseData('projects');
  const { data: products, loading: productsLoading } = useFirebaseData('products');
  const { data: firebaseServices, loading: servicesLoading } = useFirebaseData('services');

  if (projectsLoading || productsLoading || servicesLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // using data from Firebase via hooks

  const services = firebaseServices.length > 0 ? firebaseServices : [
    {
      title: "Metal Fabrication",
      description: "Custom metal fabrication for all your needs",
      icon: "🔧"
    },
    {
      title: "Welding Services",
      description: "Professional welding for industrial projects",
      icon: "🔥"
    },
    {
      title: "Shutter Installation",
      description: "Complete shutter solutions for buildings",
      icon: "🏢"
    },
    {
      title: "Sculpture Works",
      description: "Artistic metal sculptures and decorative pieces",
      icon: "🎨"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[70vh] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')"
          }}
        ></div>
        <div className="relative container mx-auto px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Expert Metal Fabrication
            </h1>
            <p className="text-xl mb-8">
              From shutters to sculptures, we bring your metal projects to life with 
              precision engineering and quality craftsmanship.
            </p>
            <Link
              to="/contact"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
            >
              <span>Contact Us</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our portfolio of successful metal fabrication projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/projects"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Projects</span>
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quality metal products available for purchase
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {products.slice(0, 6).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-800">৳ {product.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/products"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive metal fabrication services for all industries
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Services</span>
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">About Ashrafi Engineers</h2>
              <p className="text-gray-600 text-lg mb-6">
                With years of experience in metal fabrication, Ashrafi Engineers has established 
                itself as a leading provider of quality metalwork solutions. We specialize in 
                creating durable shutters, decorative grills, and custom metal fabrications.
              </p>
              <p className="text-gray-600 mb-8">
                Our commitment to excellence and attention to detail has earned us the trust of 
                numerous clients across various industries. From residential projects to large-scale 
                commercial installations, we deliver results that exceed expectations.
              </p>
              <Link
                to="/about"
                className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center space-x-2"
              >
                <span>Learn More About Us</span>
                <ChevronRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="About Ashrafi Engineers"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;