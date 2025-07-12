
export type Internship = {
  id: string;
  title: string;
  villageId: string;
  villageName: string;
  category: 'Internship' | 'Volunteering';
  duration: string;
  description: string;
  longDescription: string;
  responsibilities: string[];
  benefits: string[];
  imageUrl: string;
  sdgs: number[];
};

export type Application = {
    id: string;
    opportunityId: string;
    opportunityTitle: string;
    villageName: string;
    userId: string; // In a real app, this would be the user's ID
    userName: string;
    status: 'Applied' | 'Under Review' | 'Accepted' | 'Rejected';
};

export type Accommodation = {
  name: string;
  type: 'Homestay' | 'Hotel';
  description: string;
  vrImages: string[];
};

export type CommunityPost = {
  id: string;
  author: string;
  avatarUrl: string;
  timestamp: string;
  message: string;
  imageUrl?: string;
  videoUrl?: string;
};

export type Village = {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  longDescription: string;
  mainImage: string;
  vrImages: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  instagramPosts: string[];
  culturalAttractions: string;
  uniqueOfferings: string;
  accommodations: Accommodation[];
  communityPosts: CommunityPost[];
};

export type Booking = {
    id:string;
    villageName: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    ownerId: string;
};

export type KiranaStore = {
  id: string;
  name: string;
  villageName: string;
  description: string;
  imageUrl: string;
};

export const villages: Village[] = [
  {
    id: "mawali",
    name: "Mawali",
    location: "Meghalaya, India",
    shortDescription: "A serene village known for its living root bridges and lush greenery.",
    longDescription: "Nestled in the East Khasi Hills of Meghalaya, Mawali is a picturesque village that offers a unique blend of natural beauty and cultural heritage. It is famed for its incredible living root bridges, handcrafted by the local Khasi tribes over generations. The village is surrounded by dense tropical forests, sparkling waterfalls, and a tranquil atmosphere, making it a perfect escape for nature lovers and those seeking peace.",
    mainImage: "https://i.ibb.co/6JtXfRtF/Mawlynnong.jpg",
    vrImages: [
      "https://i.ibb.co/6JtXfRtF/Mawlynnong.jpg",
    ],
    coordinates: { latitude: 25.4939, longitude: 91.8756 },
    instagramPosts: [
      "Lost in the magic of Mawali's living root bridges! #Meghalaya #IncredibleIndia",
      "The sound of waterfalls and the smell of fresh rain. This village is heaven on earth. #Mawali #Nature",
      "Staying with a local family and learning about Khasi culture has been an unforgettable experience. #Homestay #Travel",
    ],
    culturalAttractions: "Living root bridges, traditional Khasi tribal homes, local folklore storytelling sessions.",
    uniqueOfferings: "Guided treks through the forest, bamboo craft workshops, authentic Khasi cuisine.",
    accommodations: [
        { 
          name: "Serene Homestay", 
          type: "Homestay", 
          description: "A cozy stay with a local family, offering authentic Khasi meals.",
          vrImages: ["https://i.ibb.co/6JtXfRtF/Mawlynnong.jpg"]
        },
        { 
          name: "Root Bridge View Resort", 
          type: "Hotel", 
          description: "A comfortable hotel with stunning views of the surrounding forests.",
          vrImages: ["https://i.ibb.co/6JtXfRtF/Mawlynnong.jpg"]
        },
        { 
          name: "Jungle Vibe Homestay", 
          type: "Homestay", 
          description: "Experience the jungle up close in this rustic and charming homestay.",
          vrImages: ["https://i.ibb.co/6JtXfRtF/Mawlynnong.jpg"]
        },
    ],
    communityPosts: [
      { id: '1', author: 'Traveler_Tom', avatarUrl: 'https://placehold.co/100x100.png', timestamp: '2 hours ago', message: 'Just reached Mawali! Any tips for the best time to visit the root bridges to avoid the crowds?' },
      { id: '2', author: 'Local_Guide_Lina', avatarUrl: 'https://placehold.co/100x100.png', timestamp: '1 hour ago', message: 'Welcome! Early morning, around 7 AM, is perfect. The light is magical and it’s very peaceful.' },
    ]
  },
  {
    id: "nako",
    name: "Nako",
    location: "Himachal Pradesh, India",
    shortDescription: "A high-altitude village with a stunning lake and ancient monasteries.",
    longDescription: "Perched at an elevation of 3,662 meters in the starkly beautiful Spiti Valley, Nako is a village that seems frozen in time. Its centerpiece is the sacred Nako Lake, surrounded by willow and poplar trees. The village is also home to several ancient Buddhist monasteries, adorned with intricate murals and scriptures. The air is thin, the views are panoramic, and the sense of spirituality is profound.",
    mainImage: "https://i.ibb.co/GfZNpfVt/Nako.jpg",
    vrImages: [
      "https://i.ibb.co/GfZNpfVt/Nako.jpg",
    ],
    coordinates: { latitude: 31.8801, longitude: 78.6315 },
    instagramPosts: [
      "The reflection of the Himalayas in Nako Lake is just breathtaking. #SpitiValley #Nako",
      "Exploring the ancient gompas and feeling the peaceful vibes. #Himalayas #Buddhism",
      "High altitude, higher spirits! The journey to Nako was tough but so worth it. #TravelGoals",
    ],
    culturalAttractions: "Nako Monastery complex, Nako Lake, traditional mud-brick houses.",
    uniqueOfferings: "High-altitude trekking, meditation retreats, local apple and apricot orchards.",
    accommodations: [
        { 
          name: "Lake View Hotel", 
          type: "Hotel", 
          description: "Wake up to mesmerizing views of Nako Lake and the Himalayas.",
          vrImages: ["https://i.ibb.co/GfZNpfVt/Nako.jpg"]
        },
        { 
          name: "Himalayan Homestay", 
          type: "Homestay", 
          description: "Experience the warm hospitality of a local Spitian family.",
          vrImages: ["https://i.ibb.co/GfZNpfVt/Nako.jpg"]
        },
        { 
          name: "Nako Retreat", 
          type: "Hotel", 
          description: "A peaceful retreat offering comfortable rooms and guided tours.",
          vrImages: ["https://i.ibb.co/GfZNpfVt/Nako.jpg"]
        },
    ],
    communityPosts: [
        { id: '1', author: 'Hiker_Helen', avatarUrl: 'https://placehold.co/100x100.png', timestamp: 'Yesterday', message: 'The trek to the monastery was tough but so rewarding. The views are out of this world! Make sure to carry water.' },
    ]
  },
  {
    id: "hampi",
    name: "Hampi",
    location: "Karnataka, India",
    shortDescription: "An ancient village of ruins, a UNESCO World Heritage Site.",
    longDescription: "Hampi, a UNESCO World Heritage Site in Karnataka, is a captivating landscape of ancient ruins, giant boulders, and Dravidian temples. Once the capital of the Vijayanagara Empire, its vast, open-air museum is dotted with magnificent temples, palace remains, and riverside ruins that transport you back in time. It's a dream destination for history buffs, rock climbers, and spiritual seekers.",
    mainImage: "https://i.ibb.co/spvk9rRY/hampi.jpg",
    vrImages: [
      "https://i.ibb.co/spvk9rRY/hampi.jpg",
    ],
    coordinates: { latitude: 15.3350, longitude: 76.4600 },
    instagramPosts: [
      "Exploring the ancient ruins of Hampi. So much history in one place! #Hampi #IncredibleIndia",
      "Sunset over the Tungabhadra river with the temples in the background. Magical!",
      "Rented a scooter and explored the boulder-strewn landscape. Feels like another planet. #HampiDiaries",
    ],
    culturalAttractions: "Virupaksha Temple, Vittala Temple (with its musical pillars), Royal Enclosure ruins.",
    uniqueOfferings: "Coracle boat rides on the river, bouldering and rock climbing, bicycle tours of the ruins.",
    accommodations: [
        { 
          name: "Riverside Ruins Homestay", 
          type: "Homestay", 
          description: "A peaceful stay with views of the Tungabhadra river and ancient ruins.",
          vrImages: ["https://i.ibb.co/spvk9rRY/hampi.jpg"]
        },
        { 
          name: "The Boulder Retreat", 
          type: "Hotel", 
          description: "A unique hotel built amidst Hampi's famous boulders, offering modern comfort.",
          vrImages: ["https://i.ibb.co/spvk9rRY/hampi.jpg"]
        },
        { 
          name: "Temple View Guesthouse", 
          type: "Hotel", 
          description: "Simple and clean rooms located conveniently near the main temple complex.",
          vrImages: ["https://i.ibb.co/spvk9rRY/hampi.jpg"]
        },
    ],
    communityPosts: [
        { id: '1', author: 'HistoryBuff_Raj', avatarUrl: 'https://placehold.co/100x100.png', timestamp: '4 days ago', message: 'Does anyone have a recommendation for a good guide for the Vittala Temple complex? Want to know all the details!' },
        { id: '2', author: 'Climber_Chris', avatarUrl: 'https://placehold.co/100x100.png', timestamp: '2 days ago', message: 'The bouldering scene here is insane! Any other climbers around this week?' },
    ]
  },
  {
    id: "araku",
    name: "Araku Valley",
    location: "Andhra Pradesh, India",
    shortDescription: "Lush coffee plantations and tribal culture in the Eastern Ghats.",
    longDescription: "Araku Valley is a verdant paradise nestled in the Eastern Ghats. Famous for its aromatic coffee plantations, the valley is also home to several indigenous tribal communities. The journey to Araku by train, through tunnels and over bridges, is an adventure in itself. Visitors can explore tribal museums, trek to stunning waterfalls like Katiki, and savor the unique flavor of locally grown organic coffee.",
    mainImage: "https://i.ibb.co/0jndZX39/arakuvalley.jpg",
    vrImages: [
      "https://i.ibb.co/0jndZX39/arakuvalley.jpg"
    ],
    coordinates: { latitude: 18.3333, longitude: 82.8667 },
    instagramPosts: [
      "Woke up to the smell of fresh coffee in Araku Valley. #CoffeeLover #AndhraPradesh",
      "The Dhimsa dance by the local tribe was so vibrant and full of life! #TribalIndia",
      "The train ride to Araku is one of the most scenic I've ever been on. #IndianRailways",
    ],
    culturalAttractions: "Tribal Museum, Padmapuram Gardens, traditional Dhimsa dance.",
    uniqueOfferings: "Coffee plantation tours, trekking to waterfalls, exploring Borra Caves.",
    accommodations: [
        { 
          name: "Coffee County Homestay", 
          type: "Homestay", 
          description: "Stay amidst a coffee plantation and learn about coffee making.",
          vrImages: ["https://i.ibb.co/0jndZX39/arakuvalley.jpg"]
        },
        { 
          name: "Valley View Resort", 
          type: "Hotel", 
          description: "A resort offering panoramic views of the entire Araku Valley.",
          vrImages: ["https://i.ibb.co/0jndZX39/arakuvalley.jpg"]
        },
        { 
          name: "Tribal Traditions", 
          type: "Homestay", 
          description: "An authentic stay with a local tribal family to learn their way of life.",
          vrImages: ["https://i.ibb.co/0jndZX39/arakuvalley.jpg"]
        },
    ],
    communityPosts: []
  },
];

export const internships: Internship[] = [
  {
    id: "intern-mawali-farming",
    title: "Organic Farming Internship",
    villageId: "mawali",
    villageName: "Mawali, Meghalaya",
    category: "Internship",
    duration: "4 Weeks",
    description: "Learn traditional and sustainable Khasi farming techniques. Work alongside local farmers to cultivate turmeric, ginger, and other organic produce.",
    longDescription: "Dive deep into the world of sustainable agriculture with this hands-on internship. You will be paired with an experienced local farmer in Mawali who will mentor you in the art of organic farming as practiced by the Khasi people for generations. This is more than just farming; it's about understanding the ecosystem and living in harmony with it.",
    responsibilities: [
        "Assist in day-to-day farm activities like planting, weeding, and harvesting.",
        "Learn about natural pest control methods and companion planting.",
        "Help in composting and creating organic fertilizers.",
        "Document farming techniques through photos and notes."
    ],
    benefits: ["Experience Certificate", "University Credits Possible", "Stay and meals with a local family"],
    imageUrl: "https://i.ibb.co/qLJ3H3y1/organic.jpg",
    sdgs: [4, 12]
  },
  {
    id: "volunteer-hampi-festival",
    title: "Hampi Utsav Volunteer",
    villageId: "hampi",
    villageName: "Hampi, Karnataka",
    category: "Volunteering",
    duration: "1 Week",
    description: "Be a part of the vibrant Hampi Utsav, the annual cultural festival. Help with event management, artist coordination, and guest services.",
    longDescription: "Experience the magnificent Hampi Utsav from the inside! As a volunteer, you will be an essential part of the team that brings this grand celebration of music, dance, and culture to life. This is a fast-paced, exciting opportunity for those who love culture and event management.",
    responsibilities: [
        "Assisting with stage setup and artist logistics.",
        "Managing information desks for tourists.",
        "Helping coordinate cultural workshops and competitions.",
        "Supporting the social media team with live updates."
    ],
    benefits: ["Certificate of Participation", "Free access to all festival events", "Meet local artists and performers"],
    imageUrl: "https://i.ibb.co/CpRtvv4j/hampi-utsav.jpg",
    sdgs: [4, 11]
  },
  {
    id: "intern-nako-architecture",
    title: "Sustainable Architecture Documentation",
    villageId: "nako",
    villageName: "Nako, Himachal Pradesh",
    category: "Internship",
    duration: "6 Weeks",
    description: "For architecture and civil engineering students. Study and document the traditional mud-brick building techniques of Nako.",
    longDescription: "This is a unique research opportunity for students passionate about vernacular and sustainable architecture. You will be tasked with the important work of studying, sketching, and documenting the centuries-old construction methods used in Nako. Your work will contribute to a digital archive aimed at preserving this invaluable architectural heritage.",
    responsibilities: [
        "Create detailed architectural drawings (plans, sections, elevations) of traditional houses.",
        "Interview local elders and artisans about building materials and techniques.",
        "Conduct photographic and videographic documentation.",
        "Prepare a final report summarizing your findings."
    ],
    benefits: ["Project Credit for Thesis/Portfolio", "Work with local artisans", "Experience high-altitude living"],
    imageUrl: "https://i.ibb.co/BH6rmQrQ/sustainable.jpg",
    sdgs: [4, 9, 11]
  },
  {
    id: "volunteer-araku-doc",
    title: "Community Storytelling Project",
    villageId: "araku",
    villageName: "Araku Valley, Andhra Pradesh",
    category: "Volunteering",
    duration: "3 Weeks",
    description: "Help document the folklore, traditions, and daily life of the tribal communities in Araku. Create content for the village's digital presence.",
    longDescription: "Use your media skills to empower a community. This project invites you to connect with the local tribes of Araku Valley, listen to their stories, and help them share their unique culture with the world. You'll create a repository of digital content that the community can use for tourism promotion and cultural preservation.",
    responsibilities: [
        "Conduct and record interviews with community members (with a translator).",
        "Shoot and edit short video documentaries on local crafts, music, or daily life.",
        "Take high-quality photographs for a community-owned digital archive.",
        "Write blog posts or articles about your experiences."
    ],
    benefits: ["Learn documentary filmmaking", "Contribute to cultural preservation", "Immersive cultural experience"],
    imageUrl: "https://i.ibb.co/5hMkrd43/story.jpg",
    sdgs: [4, 10]
  }
];

export const kiranaStores: KiranaStore[] = [
    {
        id: "kirana-mawali-1",
        name: "Shankar Kirana Store",
        villageName: "Mawali",
        description: "Your one-stop shop for daily essentials, local spices, and fresh produce. Proudly accepting VillageCoins.",
        imageUrl: "https://placehold.co/600x400.png"
    },
    {
        id: "kirana-nako-1",
        name: "Himalayan General Store",
        villageName: "Nako",
        description: "Stock up on supplies, trekking snacks, and local apricots. We support the VillageCoins initiative!",
        imageUrl: "https://placehold.co/600x400.png"
    },
    {
        id: "kirana-hampi-1",
        name: "Tungabhadra Traders",
        villageName: "Hampi",
        description: "Find everything from cold drinks to souvenirs. Pay with VillageCoins and support local economy.",
        imageUrl: "https://placehold.co/600x400.png"
    },
    {
        id: "kirana-araku-1",
        name: "Valley Organics",
        villageName: "Araku Valley",
        description: "Specializing in organic coffee, local honey, and tribal handicrafts. VillageCoins welcome here.",
        imageUrl: "https://placehold.co/600x400.png"
    }
];

let bookings: Booking[] = [
    { id: 'BK001', villageName: 'Mawali', guestName: 'Alice Johnson', checkIn: '2024-08-10', checkOut: '2024-08-15', status: 'Confirmed', ownerId: 'owner' },
    { id: 'BK002', villageName: 'Nako', guestName: 'Bob Williams', checkIn: '2024-08-12', checkOut: '2024-08-18', status: 'Confirmed', ownerId: 'owner' },
    { id: 'BK003', villageName: 'Hampi', guestName: 'Charlie Brown', checkIn: '2024-09-01', checkOut: '2024-09-05', status: 'Pending', ownerId: 'owner' },
    { id: 'BK004', villageName: 'Mawali', guestName: 'Diana Prince', checkIn: '2024-09-02', checkOut: '2024-09-07', status: 'Confirmed', ownerId: 'owner' },
    { id: 'BK005', villageName: 'Araku Valley', guestName: 'Ethan Hunt', checkIn: '2024-09-20', checkOut: '2024-09-25', status: 'Cancelled', ownerId: 'owner' },
];

let applications: Application[] = [
    { id: 'APP001', opportunityId: 'intern-mawali-farming', opportunityTitle: 'Organic Farming Internship', villageName: 'Mawali', userId: 'owner', userName: 'Diana Prince', status: 'Under Review' },
    { id: 'APP002', opportunityId: 'volunteer-hampi-festival', opportunityTitle: 'Hampi Utsav Volunteer', villageName: 'Hampi', userId: 'admin', userName: 'Charlie Brown', status: 'Accepted' },
];


export const getVillageById = (id: string): Village | undefined => {
  return villages.find((v) => v.id === id);
};

export const getInternshipById = (id: string): Internship | undefined => {
    return internships.find((i) => i.id === id);
};

export const addPostToVillage = (villageId: string, post: Omit<CommunityPost, 'id' | 'timestamp'>) => {
  const village = getVillageById(villageId);
  if (village) {
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    village.communityPosts.unshift(newPost);
  }
};

export const getAllBookings = (): Booking[] => {
    return bookings;
};

export const getBookingsByOwner = (ownerId: string): Booking[] => {
    // For admin, return all bookings. For a specific owner, filter by ownerId.
    if (ownerId === 'admin') return bookings;
    return bookings.filter(b => b.ownerId === ownerId);
};

export const getAllApplications = (): Application[] => {
    return applications;
}

export const getApplicationsByUser = (userId: string): Application[] => {
    return applications.filter(a => a.userId === userId);
}

export const addApplication = (opportunityId: string, userId: string): Application | { error: string } => {
    const opportunity = getInternshipById(opportunityId);
    if (!opportunity) {
        return { error: "Opportunity not found." };
    }
    // In a real app, we'd get the user's name from their profile
    const userName = userId === 'admin' ? 'Admin User' : 'Owner User';

    if (applications.some(a => a.opportunityId === opportunityId && a.userId === userId)) {
        return { error: "You have already applied for this opportunity." };
    }

    const newApplication: Application = {
        id: `APP${Date.now()}`,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        villageName: opportunity.villageName,
        userId: userId,
        userName: userName,
        status: 'Applied'
    };
    applications.push(newApplication);
    return newApplication;
}
