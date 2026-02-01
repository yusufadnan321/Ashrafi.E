import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon } from '@heroicons/react/24/outline';
import { useFirebaseData } from '../hooks/useFirebaseData';

const Products = () => {
  const { data: products, loading } = useFirebaseData('products');
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  // use products from Firebase via hook

  const categories = ["All", "Shutters", "Grills", "Gates", "Fencing", "Railings", "Canopies"];

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const formatPrice = (price) => {
    const safePrice = Number.isFinite(price) ? price : Number.parseInt(price) || 0;
    return `৳${safePrice.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Our Products</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Browse our wide range of high-quality metal products. 
              From shutters to gates, we have everything you need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => {
              const features = Array.isArray(product.features) ? product.features : [];
              const inStock = product.inStock !== undefined ? product.inStock : true;
              const rating = product.rating ?? "N/A";
              const category = product.category || "Uncategorized";
              const image = product.image || "/placeholder.svg";
              const price = Number.parseInt(product.price) || 0;
              const originalPrice = Number.parseInt(product.originalPrice) || 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {originalPrice > price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                        Save ৳{(originalPrice - price).toLocaleString()}
                      </div>
                    )}
                    {!inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        <EyeIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                        {category}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">{rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {features.length === 0 ? (
                          <li className="text-gray-400">No features listed.</li>
                        ) : (
                          features.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">
                          {formatPrice(price)}
                        </span>
                        {originalPrice > price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Our Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Products?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We use premium materials and advanced manufacturing techniques to ensure durability and quality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "🛡️", title: "Quality Materials", description: "High-grade steel and metals" },
              { icon: "⚙️", title: "Expert Craftsmanship", description: "Skilled artisans and precision work" },
              { icon: "🚚", title: "Free Installation", description: "Professional installation included" },
              { icon: "📞", title: "24/7 Support", description: "Round-the-clock customer service" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;