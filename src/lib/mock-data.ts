

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
    id: string;
    villageName: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    ownerId: string;
};

export const villages: Village[] = [
  {
    id: "mawali",
    name: "Mawali",
    location: "Meghalaya, India",
    shortDescription: "A serene village known for its living root bridges and lush greenery.",
    longDescription: "Nestled in the East Khasi Hills of Meghalaya, Mawali is a picturesque village that offers a unique blend of natural beauty and cultural heritage. It is famed for its incredible living root bridges, handcrafted by the local Khasi tribes over generations. The village is surrounded by dense tropical forests, sparkling waterfalls, and a tranquil atmosphere, making it a perfect escape for nature lovers and those seeking peace.",
    mainImage: "https://placehold.co/600x400.png",
    vrImages: [
      "https://placehold.co/4096x2048.png",
      "https://placehold.co/4096x2048.png",
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
          vrImages: ["https://placehold.co/4096x2048.png", "https://placehold.co/4096x2048.png"]
        },
        { 
          name: "Root Bridge View Resort", 
          type: "Hotel", 
          description: "A comfortable hotel with stunning views of the surrounding forests.",
          vrImages: ["https://placehold.co/4096x2048.png"]
        },
        { 
          name: "Jungle Vibe Homestay", 
          type: "Homestay", 
          description: "Experience the jungle up close in this rustic and charming homestay.",
          vrImages: ["https://placehold.co/4096x2048.png", "https://placehold.co/4096x2048.png"]
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
    mainImage: "https://placehold.co/600x400.png",
    vrImages: [
      "https://placehold.co/4096x2048.png",
      "https://placehold.co/4096x2048.png",
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
          vrImages: ["https://placehold.co/4096x2048.png"]
        },
        { 
          name: "Himalayan Homestay", 
          type: "Homestay", 
          description: "Experience the warm hospitality of a local Spitian family.",
          vrImages: ["https://placehold.co/4096x2048.png", "https://placehold.co/4096x2048.png"]
        },
        { 
          name: "Nako Retreat", 
          type: "Hotel", 
          description: "A peaceful retreat offering comfortable rooms and guided tours.",
          vrImages: ["https://placehold.co/4096x2048.png"]
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
    mainImage: "https://placehold.co/600x400.png",
    vrImages: [
      "https://placehold.co/4096x2048.png",
      "https://placehold.co/4096x2048.png",
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
          vrImages: ["https://placehold.co/4096x2048.png", "https://placehold.co/4096x2048.png"]
        },
        { 
          name: "The Boulder Retreat", 
          type: "Hotel", 
          description: "A unique hotel built amidst Hampi's famous boulders, offering modern comfort.",
          vrImages: ["https://placehold.co/4096x2048.png"]
        },
        { 
          name: "Temple View Guesthouse", 
          type: "Hotel", 
          description: "Simple and clean rooms located conveniently near the main temple complex.",
          vrImages: ["https://placehold.co/4096x2048.png"]
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
    mainImage: "https://placehold.co/600x400.png",
    vrImages: [
      "https://i.ibb.co/208TqzG3/arakuvalley.jpg",
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
          vrImages: ["https://placehold.co/4096x2048.png", "https://placehold.co/4096x2048.png"]
        },
        { 
          name: "Valley View Resort", 
          type: "Hotel", 
          description: "A resort offering panoramic views of the entire Araku Valley.",
          vrImages: ["https://placehold.co/4096x2048.png"]
        },
        { 
          name: "Tribal Traditions", 
          type: "Homestay", 
          description: "An authentic stay with a local tribal family to learn their way of life.",
          vrImages: ["https://placehold.co/4096x2048.png"]
        },
    ],
    communityPosts: []
  },
];

let bookings: Booking[] = [
    { id: 'BK001', villageName: 'Mawali', guestName: 'Alice Johnson', checkIn: '2024-08-10', checkOut: '2024-08-15', status: 'Confirmed', ownerId: 'owner1' },
    { id: 'BK002', villageName: 'Nako', guestName: 'Bob Williams', checkIn: '2024-08-12', checkOut: '2024-08-18', status: 'Confirmed', ownerId: 'owner2' },
    { id: 'BK003', villageName: 'Hampi', guestName: 'Charlie Brown', checkIn: '2024-09-01', checkOut: '2024-09-05', status: 'Pending', ownerId: 'owner3' },
    { id: 'BK004', villageName: 'Mawali', guestName: 'Diana Prince', checkIn: '2024-09-02', checkOut: '2024-09-07', status: 'Confirmed', ownerId: 'owner1' },
    { id: 'BK005', villageName: 'Araku Valley', guestName: 'Ethan Hunt', checkIn: '2024-09-20', checkOut: '2024-09-25', status: 'Cancelled', ownerId: 'owner4' },
];

export const getVillageById = (id: string): Village | undefined => {
  return villages.find((v) => v.id === id);
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
    return bookings.filter(b => b.ownerId === ownerId);
};
