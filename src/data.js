// ❌ THIS FILE IS NOW DEPRECATED - All data is fetched from Firebase Firestore
// This file is kept for reference only. All exports are commented out.
// The app now uses useFirebaseData hook in src/hooks/useFirebaseData.js

/*
export const products = [
    {
        id: 1,
        name: "Steel Rolling Shutters",
        price: 15000,
        originalPrice: 18000,
        image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=500",
        category: "Shutters",
        description: "Durable steel rolling shutters for commercial and residential use",
        features: ["Automatic operation", "Weather resistant", "Security locks"],
        inStock: true,
        rating: 4.8
    },
    {
        id: 2,
        name: "Security Window Grills",
        price: 8000,
        originalPrice: 9500,
        image: "https://images.pexels.com/photos/2219064/pexels-photo-2219064.jpeg?auto=compress&cs=tinysrgb&w=500",
        category: "Grills",
        description: "Custom designed security grills for windows and balconies",
        features: ["Rust resistant coating", "Custom designs", "Easy installation"],
        inStock: true,
        rating: 4.6
    },
    {
        id: 3,
        name: "Heavy Duty Metal Gates",
        price: 25000,
        originalPrice: 28000,
        image: "https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=500",
        category: "Gates",
        description: "Industrial grade metal gates with automated systems",
        features: ["Remote control", "Heavy duty hinges", "Powder coating"],
        inStock: true,
        rating: 4.9
    },
    {
        id: 4,
        name: "Decorative Iron Fence",
        price: 12000,
        originalPrice: 14000,
        image: "https://images.pexels.com/photos/2219064/pexels-photo-2219064.jpeg?auto=compress&cs=tinysrgb&w=500",
        category: "Fencing",
        description: "Elegant decorative iron fencing for residential properties",
        features: ["Artistic design", "Galvanized coating", "10 year warranty"],
        inStock: true,
        rating: 4.7
    },
    {
        id: 5,
        name: "Steel Handrails",
        price: 6000,
        originalPrice: 7000,
        image: "https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=500",
        category: "Railings",
        description: "Stainless steel handrails for stairs and balconies",
        features: ["Stainless steel 304", "Mirror finish", "Easy maintenance"],
        inStock: false,
        rating: 4.5
    },
    {
        id: 6,
        name: "Custom Metal Canopy",
        price: 35000,
        originalPrice: 40000,
        image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=500",
        category: "Canopies",
        description: "Weather-resistant metal canopies for outdoor spaces",
        features: ["UV protection", "Wind resistant", "Custom sizing"],
        inStock: true,
        rating: 4.8
    }
];

export const projects = [
    {
        id: 1,
        title: "Commercial Shopping Center Shutters",
        description: "Complete shutter installation for a 3-story shopping center with automated systems",
        image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Shutters",
        client: "ABC Shopping Mall",
        duration: "6 weeks",
        budget: "৳5,00,000",
        status: "Completed",
        date: "March 2024"
    },
    {
        id: 2,
        title: "Decorative Bridge Railings",
        description: "Artistic metal railings for a pedestrian bridge with custom design patterns",
        image: "https://images.pexels.com/photos/2219064/pexels-photo-2219064.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Grills & Railings",
        client: "City Corporation",
        duration: "8 weeks",
        budget: "৳8,50,000",
        status: "Completed",
        date: "February 2024"
    },
    {
        id: 3,
        title: "Industrial Warehouse Gates",
        description: "Heavy-duty automated gates for a large industrial warehouse facility",
        image: "https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Gates",
        client: "XYZ Industries",
        duration: "4 weeks",
        budget: "৳3,20,000",
        status: "In Progress",
        date: "January 2024"
    },
    {
        id: 4,
        title: "Residential Security Grills",
        description: "Custom security grills for a residential complex with modern aesthetic design",
        image: "https://images.pexels.com/photos/2219064/pexels-photo-2219064.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Security Grills",
        client: "Green Valley Apartments",
        duration: "3 weeks",
        budget: "৳1,80,000",
        status: "Completed",
        date: "December 2023"
    },
    {
        id: 5,
        title: "Steel Structure for Factory",
        description: "Complete steel framework construction for a manufacturing facility",
        image: "https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Steel Structure",
        client: "Manufacturing Corp",
        duration: "12 weeks",
        budget: "৳15,00,000",
        status: "In Progress",
        date: "November 2023"
    },
    {
        id: 6,
        title: "Artistic Metal Sculpture",
        description: "Large-scale metal sculpture for city park with contemporary design",
        image: "https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Sculpture",
        client: "City Arts Council",
        duration: "10 weeks",
        budget: "৳6,00,000",
        status: "Planning",
        date: "October 2023"
    }
];

export const services = [
    {
        title: "Metal Fabrication",
        description: "Custom metal fabrication services for industrial and commercial projects",
        image: "https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=800",
        features: [
            "Custom steel structures",
            "Precision cutting and forming",
            "Assembly and installation",
            "Quality testing and inspection"
        ]
    },
    {
        title: "Shutter Manufacturing",
        description: "High-quality shutters for residential and commercial buildings",
        image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800",
        features: [
            "Rolling shutters",
            "Security shutters",
            "Fire-rated shutters",
            "Motorized systems"
        ]
    },
    {
        title: "Welding Services",
        description: "Professional welding for all types of metal joining requirements",
        image: "https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=800",
        features: [
            "MIG/TIG welding",
            "Structural welding",
            "Repair welding",
            "Certified welders"
        ]
    },
    {
        title: "Grills & Gates",
        description: "Decorative and security grills, gates for residential and commercial use",
        image: "https://images.pexels.com/photos/2219064/pexels-photo-2219064.jpeg?auto=compress&cs=tinysrgb&w=800",
        features: [
            "Security grills",
            "Decorative gates",
            "Window grills",
            "Automatic gate systems"
        ]
    },
    {
        title: "Mechanical Projects",
        description: "Complex mechanical fabrication and engineering solutions",
        image: "https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=800",
        features: [
            "Machine parts fabrication",
            "Conveyor systems",
            "Industrial equipment",
            "Maintenance services"
        ]
    },
    {
        title: "Sculpture Works",
        description: "Artistic metal sculptures and decorative metalwork",
        image: "https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=800",
        features: [
            "Custom sculptures",
            "Architectural elements",
            "Garden art",
            "Memorial pieces"
        ]
    }
];

export const employees = [
    {
        id: 1,
        name: "Ahmad Rahman",
        position: "Senior Welder",
        salary: 25000,
        attendance: 95,
        email: "ahmad@company.com",
        phone: "01711111111",
        joinDate: "2020-01-15",
        status: "Active",
        attendanceHistory: [
            { date: "2024-01-15", present: true },
            { date: "2024-01-14", present: true },
            { date: "2024-01-13", present: false },
            { date: "2024-01-12", present: true },
            { date: "2024-01-11", present: true },
        ],
    },
    {
        id: 2,
        name: "Fatima Khan",
        position: "Project Manager",
        salary: 35000,
        attendance: 98,
        email: "fatima@company.com",
        phone: "01722222222",
        joinDate: "2019-03-20",
        status: "Active",
        attendanceHistory: [
            { date: "2024-01-15", present: true },
            { date: "2024-01-14", present: true },
            { date: "2024-01-13", present: true },
            { date: "2024-01-12", present: true },
            { date: "2024-01-11", present: true },
        ],
    },
    {
        id: 3,
        name: "Mohamed Ali",
        position: "Fabricator",
        salary: 22000,
        attendance: 89,
        email: "mohamed@company.com",
        phone: "01733333333",
        joinDate: "2021-06-10",
        status: "Active",
        attendanceHistory: [
            { date: "2024-01-15", present: true },
            { date: "2024-01-14", present: false },
            { date: "2024-01-13", present: true },
            { date: "2024-01-12", present: false },
            { date: "2024-01-11", present: true },
        ],
    },
    {
        id: 4,
        name: "Rashida Begum",
        position: "Quality Control",
        salary: 28000,
        attendance: 96,
        email: "rashida@company.com",
        phone: "01744444444",
        joinDate: "2020-09-05",
        status: "On Leave",
        attendanceHistory: [
            { date: "2024-01-15", present: false },
            { date: "2024-01-14", present: true },
            { date: "2024-01-13", present: true },
            { date: "2024-01-12", present: true },
            { date: "2024-01-11", present: true },
        ],
    },
];
*/