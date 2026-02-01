import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useFirebaseData } from '../hooks/useFirebaseData';
import useSiteSettings from '../hooks/useSiteSettings';
import { addDocument } from '../hooks/useFirebaseWrite';

const Contact = () => {
  const { data: services, loading } = useFirebaseData('services');
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [customService, setCustomService] = useState('');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Use custom service if "Custom" is selected
      const finalService = formData.service === 'Custom' ? customService : formData.service;
      
      // Save message to Firebase
      await addDocument('messages', {
        ...formData,
        service: finalService,
        createdAt: new Date().toISOString(),
        status: 'unread'
      });
      
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      setCustomService('');
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <PhoneIcon className="h-6 w-6" />,
      title: "Phone",
      info: settings.phone,
      description: "Call us anytime for immediate assistance"
    },
    {
      icon: <EnvelopeIcon className="h-6 w-6" />,
      title: "Email",
      info: settings.email,
      description: "Send us an email for detailed inquiries"
    },
    {
      icon: <MapPinIcon className="h-6 w-6" />,
      title: "Address",
      info: settings.address,
      description: "Visit our workshop for project discussions"
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: "Business Hours",
      info: settings.businessHours,
      description: "Sunday: Closed"
    }
  ];

  const serviceOptions = services.map(s => s.title);

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
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Get in touch with us for all your metal fabrication needs. 
              We're here to help bring your projects to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-gray-800 mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-800 font-medium mb-2">{item.info}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      placeholder="Your Phone Number"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Needed
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    >
                      <option value="">Select a Service</option>
                      {serviceOptions.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                      <option value="Custom">Custom Request</option>
                    </select>
                  </div>
                  {formData.service === 'Custom' && (
                    <div className="md:col-span-2">
                      <label htmlFor="customService" className="block text-sm font-medium text-gray-700 mb-2">
                        Describe Your Custom Request *
                      </label>
                      <input
                        type="text"
                        id="customService"
                        value={customService}
                        onChange={(e) => setCustomService(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        placeholder="Enter your custom service request"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    placeholder="Tell us about your project requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Visit Our Workshop</h2>
                
                {/* Map */}
                {settings.googleMapsUrl ? (
                  <div className="rounded-lg overflow-hidden h-64 mb-6">
                    <iframe
                      src={settings.googleMapsUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Workshop Location"
                    ></iframe>
                  </div>
                ) : (
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-6">
                    <div className="text-center text-gray-600">
                      <MapPinIcon className="h-12 w-12 mx-auto mb-2" />
                      <p>Map location not configured</p>
                      <p className="text-sm">Add Google Maps URL in admin settings</p>
                    </div>
                  </div>
                )}

                {/* Workshop Info */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Workshop Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      {settings.workshopDescription || 'Our state-of-the-art workshop is equipped with modern machinery and tools to handle projects of all sizes. We welcome clients to visit and discuss their requirements in person.'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-800">Facility Size:</span>
                        <p className="text-gray-600">{settings.workshopSize || '5000 sq ft'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Capacity:</span>
                        <p className="text-gray-600">{settings.workshopCapacity || 'Large scale projects'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Equipment:</span>
                        <p className="text-gray-600">{settings.workshopEquipment || 'Modern machinery'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Team:</span>
                        <p className="text-gray-600">{settings.workshopTeam || '25+ skilled workers'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about our services and processes.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "What types of metal do you work with?",
                answer: "We work with various metals including steel, stainless steel, aluminum, and iron for different project requirements."
              },
              {
                question: "How long does a typical project take?",
                answer: "Project timelines vary based on complexity and size. Simple projects may take 1-2 weeks, while larger installations can take 4-6 weeks."
              },
              {
                question: "Do you provide installation services?",
                answer: "Yes, we provide complete installation services for all our fabricated products with quality assurance."
              },
              {
                question: "Can you work on custom designs?",
                answer: "Absolutely! We specialize in custom fabrication and can work from your designs or help create new ones."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;