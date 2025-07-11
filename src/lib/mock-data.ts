export type Accommodation = {
  name: string;
  type: 'Homestay' | 'Hotel';
  description: string;
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
      "https://placehold.co/1200x800.png",
      "https://placehold.co/1200x800.png",
      "https://placehold.co/1200x800.png",
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
        { name: "Serene Homestay", type: "Homestay", description: "A cozy stay with a local family, offering authentic Khasi meals." },
        { name: "Root Bridge View Resort", type: "Hotel", description: "A comfortable hotel with stunning views of the surrounding forests." },
        { name: "Jungle Vibe Homestay", type: "Homestay", description: "Experience the jungle up close in this rustic and charming homestay." },
    ],
  },
  {
    id: "nako",
    name: "Nako",
    location: "Himachal Pradesh, India",
    shortDescription: "A high-altitude village with a stunning lake and ancient monasteries.",
    longDescription: "Perched at an elevation of 3,662 meters in the starkly beautiful Spiti Valley, Nako is a village that seems frozen in time. Its centerpiece is the sacred Nako Lake, surrounded by willow and poplar trees. The village is also home to several ancient Buddhist monasteries, adorned with intricate murals and scriptures. The air is thin, the views are panoramic, and the sense of spirituality is profound.",
    mainImage: "https://placehold.co/600x400.png",
    vrImages: [
      "https://placehold.co/1200x800.png",
      "https://placehold.co/1200x800.png",
      "https://placehold.co/1200x800.png",
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
        { name: "Lake View Hotel", type: "Hotel", description: "Wake up to mesmerizing views of Nako Lake and the Himalayas." },
        { name: "Himalayan Homestay", type: "Homestay", description: "Experience the warm hospitality of a local Spitian family." },
        { name: "Nako Retreat", type: "Hotel", description: "A peaceful retreat offering comfortable rooms and guided tours." },
    ],
  },
  {
    id: "zardari",
    name: "Zardari",
    location: "Rajasthan, India",
    shortDescription: "A vibrant desert village famous for its folk art and craft.",
    longDescription: "Zardari is a splash of color in the heart of the Thar Desert. This Rajasthani village is renowned for its rich traditions of folk music, dance, and craftsmanship. The local artisans create exquisite textiles, pottery, and leather goods. Visitors can experience the warmth of Rajasthani hospitality in traditional homestays, enjoy camel safaris into the dunes, and witness mesmerizing cultural performances under the starry desert sky.",
    mainImage: "https://placehold.co/600x400.png",
    vrImages: [
      "https://placehold.co/1200x800.png",
      "https://placehold.co/1200x800.png",
      "https://placehold.co/1200x800.png",
    ],
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    instagramPosts: [
      "The colors and crafts of Zardari have stolen my heart. #Rajasthan #Handicrafts",
      "Sunset camel ride in the Thar Desert. An experience for the soul. #IncredibleIndia",
      "The folk music here is just magical. So much history and emotion in every note. #FolkMusic",
    ],
    culturalAttractions: "Kalbelia dance performances, Mandana paintings on mud walls, local artisan workshops.",
    uniqueOfferings: "Camel safaris, block-printing workshops, desert camping experiences.",
    accommodations: [
        { name: "Desert Rose Homestay", type: "Homestay", description: "Live like a local in a beautifully decorated traditional home." },
        { name: "The Royal Haveli", type: "Hotel", description: "A heritage hotel offering a glimpse into Rajasthan's royal past." },
        { name: "Mirage Camp", type: "Hotel", description: "Luxury tents in the desert with cultural programs every evening." },
    ],
  },
  {
    id: "araku",
    name: "Araku Valley",
    location: "Andhra Pradesh, India",
    shortDescription: "Lush coffee plantations and tribal culture in the Eastern Ghats.",
    longDescription: "Araku Valley is a verdant paradise nestled in the Eastern Ghats. Famous for its aromatic coffee plantations, the valley is also home to several indigenous tribal communities. The journey to Araku by train, through tunnels and over bridges, is an adventure in itself. Visitors can explore tribal museums, trek to stunning waterfalls like Katiki, and savor the unique flavor of locally grown organic coffee.",
    mainImage: "https://placehold.co/600x400.png",
    vrImages: [
      "https://placehold.co/1200x800.png",
      "https://placehold.co/1200x800.png",
      "https://placehold.co/1200x800.png",
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
        { name: "Coffee County Homestay", type: "Homestay", description: "Stay amidst a coffee plantation and learn about coffee making." },
        { name: "Valley View Resort", type: "Hotel", description: "A resort offering panoramic views of the entire Araku Valley." },
        { name: "Tribal Traditions", type: "Homestay", description: "An authentic stay with a local tribal family to learn their way of life." },
    ],
  },
];

export const getVillageById = (id: string): Village | undefined => {
  return villages.find((v) => v.id === id);
};
