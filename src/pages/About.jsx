import React from 'react';
import { motion } from 'framer-motion';
import { useFirebaseData } from '../hooks/useFirebaseData';

const About = () => {
  const { data: aboutContent, loading } = useFirebaseData('aboutContent');

  // Helper function to get content by section
  const getSection = (section) => {
    const item = aboutContent.find(item => item.section === section);
    return item?.content || {};
  };

  // Get data from Firebase or use defaults
  const hero = getSection('hero');
  const story = getSection('story');
  const statsData = getSection('stats');
  const mission = getSection('mission');
  const vision = getSection('vision');
  const teamData = getSection('team');
  const valuesData = getSection('values');

  // Default data if Firebase is empty
  const stats = statsData.items || [
    { number: "500+", label: "Projects Completed" },
    { number: "50+", label: "Happy Clients" },
    { number: "15+", label: "Years Experience" },
    { number: "25+", label: "Team Members" }
  ];

  const team = teamData.members || [
    {
      name: "Mohammad Ashrafi",
      position: "Founder & CEO",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Leading the company with vision and expertise in metal fabrication"
    },
    {
      name: "Ahmed Hassan",
      position: "Senior Engineer",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Expert in welding and structural engineering"
    },
    {
      name: "Fatima Rahman",
      position: "Project Manager",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Ensuring project delivery and client satisfaction"
    }
  ];

  const values = valuesData.items || [
    { icon: "🎯", title: "Quality Excellence", description: "We never compromise on quality. Every project is executed with precision and attention to detail." },
    { icon: "🤝", title: "Customer Focus", description: "Our customers are at the heart of everything we do. We listen, understand, and deliver solutions that exceed expectations." },
    { icon: "⚡", title: "Innovation", description: "We embrace new technologies and methods to improve our services and deliver better results." }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

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
            <h1 className="text-5xl font-bold mb-6">{hero.title || "About Ashrafi Engineers"}</h1>
            <p className="text-xl max-w-3xl mx-auto">
              {hero.description || "Building excellence in metal fabrication with commitment to quality, innovation, and customer satisfaction since our establishment."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">{story.title || "Our Story"}</h2>
              <p className="text-gray-600 text-lg mb-6">
                {story.paragraph1 || "Ashrafi Engineers was founded with a simple mission: to provide exceptional metal fabrication services that combine traditional craftsmanship with modern technology. What started as a small workshop has grown into one of the region's most trusted metal fabrication companies."}
              </p>
              <p className="text-gray-600 text-lg mb-6">
                {story.paragraph2 || "Our journey began with a focus on quality and customer satisfaction. Over the years, we have expanded our services to include everything from simple metalwork to complex industrial fabrications, always maintaining our commitment to excellence."}
              </p>
              <p className="text-gray-600 text-lg">
                {story.paragraph3 || "Today, we serve clients across various sectors including residential, commercial, and industrial, delivering solutions that meet the highest standards of quality and durability."}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={story.image || "https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                alt="Our Workshop"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg">
                {mission.text || "To provide exceptional metal fabrication services that exceed customer expectations through innovative solutions, quality craftsmanship, and reliable service. We are committed to building long-term relationships with our clients by delivering projects on time and within budget."}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg">
                {vision.text || "To be the leading metal fabrication company in the region, recognized for our innovation, quality, and customer service. We envision a future where our expertise in metalwork contributes to building stronger, more beautiful communities and infrastructure."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center bg-gray-50 p-6 rounded-lg"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-gray-600 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-6"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;