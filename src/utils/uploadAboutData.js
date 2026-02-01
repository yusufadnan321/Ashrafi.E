import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';

const aboutData = [
  {
    section: 'hero',
    content: {
      title: "About Ashrafi Engineers",
      description: "Building excellence in metal fabrication with commitment to quality, innovation, and customer satisfaction since our establishment."
    }
  },
  {
    section: 'story',
    content: {
      title: "Our Story",
      paragraph1: "Ashrafi Engineers was founded with a simple mission: to provide exceptional metal fabrication services that combine traditional craftsmanship with modern technology. What started as a small workshop has grown into one of the region's most trusted metal fabrication companies.",
      paragraph2: "Our journey began with a focus on quality and customer satisfaction. Over the years, we have expanded our services to include everything from simple metalwork to complex industrial fabrications, always maintaining our commitment to excellence.",
      paragraph3: "Today, we serve clients across various sectors including residential, commercial, and industrial, delivering solutions that meet the highest standards of quality and durability.",
      image: "https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  },
  {
    section: 'stats',
    content: {
      items: [
        { number: "500+", label: "Projects Completed" },
        { number: "50+", label: "Happy Clients" },
        { number: "15+", label: "Years Experience" },
        { number: "25+", label: "Team Members" }
      ]
    }
  },
  {
    section: 'mission',
    content: {
      text: "To provide exceptional metal fabrication services that exceed customer expectations through innovative solutions, quality craftsmanship, and reliable service. We are committed to building long-term relationships with our clients by delivering projects on time and within budget."
    }
  },
  {
    section: 'vision',
    content: {
      text: "To be the leading metal fabrication company in the region, recognized for our innovation, quality, and customer service. We envision a future where our expertise in metalwork contributes to building stronger, more beautiful communities and infrastructure."
    }
  },
  {
    section: 'team',
    content: {
      members: [
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
      ]
    }
  },
  {
    section: 'values',
    content: {
      items: [
        { 
          icon: "🎯", 
          title: "Quality Excellence", 
          description: "We never compromise on quality. Every project is executed with precision and attention to detail." 
        },
        { 
          icon: "🤝", 
          title: "Customer Focus", 
          description: "Our customers are at the heart of everything we do. We listen, understand, and deliver solutions that exceed expectations." 
        },
        { 
          icon: "⚡", 
          title: "Innovation", 
          description: "We embrace new technologies and methods to improve our services and deliver better results." 
        }
      ]
    }
  }
];

export const uploadAboutData = async () => {
  try {
    console.log('Starting upload of About page data...');
    
    // Check if data already exists
    const q = query(collection(db, 'aboutContent'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('About content already exists in Firebase. Skipping upload.');
      return { success: false, message: 'Data already exists' };
    }

    // Upload all about data
    for (const item of aboutData) {
      await addDoc(collection(db, 'aboutContent'), item);
      console.log(`Uploaded ${item.section} section`);
    }

    console.log('Successfully uploaded all About page data!');
    return { success: true, message: 'Data uploaded successfully' };
  } catch (error) {
    console.error('Error uploading About data:', error);
    return { success: false, message: error.message };
  }
};

// If you want to run this directly, uncomment the following line:
// uploadAboutData();
