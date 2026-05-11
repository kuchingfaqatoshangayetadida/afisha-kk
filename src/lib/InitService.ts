import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebase';

const DUMMY_EVENTS = [
  {
    title: "Musical performance 'To'maris'",
    description: "A grand theatrical performance telling the legendary story of Tomaris, the queen of the Massagetae. Experience the rich culture and history of our ancestors through music and drama.",
    category: "theater",
    date: "2026-05-15",
    time: "18:00",
    location: "Berdaq Karakalpak State Academic Theater, Nukus",
    price: "50,000 UZS",
    bannerImage: "https://picsum.photos/seed/theater1/1080/1350",
    isTopEvent: true
  },
  {
    title: "Nukus Jazz Night: Aral Echoes",
    description: "Join us for a mesmerizing night of jazz music featuring international artists and local Karakalpak jazz bands. A night of improvisation and soul, blending traditional motifs with modern jazz rhythms.",
    category: "concert",
    date: "2026-05-20",
    time: "19:30",
    location: "Turon Arts Center, Nukus",
    price: "80,000 UZS",
    bannerImage: "https://picsum.photos/seed/jazz/1080/1350",
    isTopEvent: true
  },
  {
    title: "Exhibition: Savitsky's Secret Collection",
    description: "Rarely seen works from the archives of the Savitsky State Museum. This exhibition features avant-garde masterpieces that were hidden for decades, showcasing the resilience of art.",
    category: "exhibition",
    date: "2026-04-25",
    time: "10:00",
    location: "Savitsky State Museum of Art, Nukus",
    price: "25,000 UZS",
    bannerImage: "https://picsum.photos/seed/museum/1080/1350",
    isTopEvent: true
  },
  {
    title: "Drama: 'Qaraqalpaq qızı'",
    description: "A touching drama based on local legends about a brave Karakalpak girl. A story of love, family, and national identity performed by the award-winning theater troupe.",
    category: "theater",
    date: "2026-06-05",
    time: "17:00",
    location: "Berdaq Theater, Nukus",
    price: "30,000 UZS",
    bannerImage: "https://picsum.photos/seed/theater_drama/1080/1350",
    isTopEvent: false
  },
  {
    title: "Ethno-Festival: Melodies of the Steppe",
    description: "A massive open-air festival celebrating Karakalpak traditional music, featuring epic bards (jyraus) and traditional dancers. Food fair and masterclasses included.",
    category: "festival",
    date: "2026-05-30",
    time: "15:00",
    location: "Central Square, Nukus",
    price: "Free",
    bannerImage: "https://picsum.photos/seed/steppe/1080/1350",
    isTopEvent: true
  },
  {
    title: "Cinema Premiere: 'Shıǵıs báhári'",
    description: "Premiere of the latest Karakalpak feature film. A cinematic journey into the life of a rural community facing the challenges of the modern era.",
    category: "cinema",
    date: "2026-05-12",
    time: "20:00",
    location: "Nukus Movie Theater, Nukus",
    price: "35,000 UZS",
    bannerImage: "https://picsum.photos/seed/movie_premiere/1080/1350",
    isTopEvent: false
  },
  {
    title: "Opera: 'Alpamıs'",
    description: "The classic Karakalpak epic transformed into a grand opera. Featuring lead soloists from the Tashkent Conservatoire and the local philharmonic orchestra.",
    category: "theater",
    date: "2026-06-12",
    time: "18:30",
    location: "Berdaq Karakalpak State Academic Theater, Nukus",
    price: "60,000 UZS",
    bannerImage: "https://picsum.photos/seed/opera/1080/1350",
    isTopEvent: false
  },
  {
    title: "Crafts Fair: Colors of Karakalpakstan",
    description: "Exhibition and sale of traditional Karakalpak crafts. Meet the masters of embroidery, pottery, and jewelry-making. Perfect for finding unique heritage gifts.",
    category: "exhibition",
    date: "2026-05-01",
    time: "09:00",
    location: "Turon Gallery, Nukus",
    price: "Free",
    bannerImage: "https://picsum.photos/seed/crafts/1080/1350",
    isTopEvent: false
  },
  {
    title: "Rock Concert: Aral Dust",
    description: "A high-energy rock concert featuring Karakalpak indie bands. Modern sounds meeting traditional throat singing techniques in a unique fusion.",
    category: "concert",
    date: "2026-05-25",
    time: "21:00",
    location: "Progress Arts Club, Nukus",
    price: "40,000 UZS",
    bannerImage: "https://picsum.photos/seed/rock/1080/1350",
    isTopEvent: false
  },
  {
    title: "Food Festival: Karakalpak Gastronomy",
    description: "Taste the best of local cuisine! From Jugeri Gurtik to various fish dishes. Live cooking shows by famous local chefs and tastings for everyone.",
    category: "festival",
    date: "2026-06-10",
    time: "12:00",
    location: "Amu Darya Riverside Park, Nukus",
    price: "Free Entry",
    bannerImage: "https://picsum.photos/seed/food/1080/1350",
    isTopEvent: false
  },
  {
    title: "K-DRAMA Night Nukus",
    description: "A special screening of popular international and local dramas on the big screen. Fan gathering and interactive discussions follow the screenings.",
    category: "cinema",
    date: "2026-05-18",
    time: "19:00",
    location: "Nukus Movie Theater, Nukus",
    price: "20,000 UZS",
    bannerImage: "https://picsum.photos/seed/drama_screen/1080/1350",
    isTopEvent: false
  },
  {
    title: "Historical Lecture: Ancient Fortresses",
    description: "A visual journey and lecture on the ancient desert fortresses (Khorezmia) around Karakalpakstan. Presented by leading archaeologists and historians.",
    category: "exhibition",
    date: "2026-05-08",
    time: "15:00",
    location: "Nukus State University Hall, Nukus",
    price: "Free",
    bannerImage: "https://picsum.photos/seed/history/1080/1350",
    isTopEvent: false
  },
  {
    title: "Puppet Theater: The Fox and the Camel",
    description: "A delightful performance for children and families. Classic Karakalpak fables brought to life with hand-crafted puppets and traditional music.",
    category: "theater",
    date: "2026-05-21",
    time: "11:00",
    location: "Karakalpak State Puppet Theater, Nukus",
    price: "15,000 UZS",
    bannerImage: "https://picsum.photos/seed/puppets/1080/1350",
    isTopEvent: false
  },
  {
    title: "Classical Piano Recital: Steppe Echo",
    description: "An evening of classical piano music featuring masterpieces by international composers and arrangements of Karakalpak melodies for piano.",
    category: "concert",
    date: "2026-06-15",
    time: "18:00",
    location: "Nukus School of Arts Concert Hall, Nukus",
    price: "30,000 UZS",
    bannerImage: "https://picsum.photos/seed/piano/1080/1350",
    isTopEvent: false
  },
  {
    title: "Film Night: Archives of Karakalpakstan",
    description: "Rare documentary screenings from the 1950s-70s showing the history of development and everyday life in Karakalpakstan. A nostalgic trip for all.",
    category: "cinema",
    date: "2026-04-30",
    time: "18:30",
    location: "Historical Museum Hall, Nukus",
    price: "Free",
    bannerImage: "https://picsum.photos/seed/archive_film/1080/1350",
    isTopEvent: false
  },
  {
    title: "Moynaq Eco-Arts Festival",
    description: "An annual festival in Moynaq focusing on ecological awareness through art installations, music, and community workshops near the Aral Sea ship graveyard.",
    category: "festival",
    date: "2026-07-05",
    time: "10:00",
    location: "Ship Graveyard, Moynaq",
    price: "Free",
    bannerImage: "https://picsum.photos/seed/moynaq/1080/1350",
    isTopEvent: true
  },
  {
    title: "Abstract Art Exhibition: Wind of Kyzylkum",
    description: "Local contemporary artists interpret the vastness and spirit of the Kyzylkum desert through abstract painting and sculpture.",
    category: "exhibition",
    date: "2026-06-20",
    time: "10:00",
    location: "Modern Art Space, Nukus",
    price: "10,000 UZS",
    bannerImage: "https://picsum.photos/seed/abstract/1080/1350",
    isTopEvent: false
  },
  {
    title: "Hip Hop Nukus: Street Culture",
    description: "Breakdance battles, graffiti art live showcase, and street music performances from the underground scene in Nukus.",
    category: "concert",
    date: "2026-06-08",
    time: "19:00",
    location: "Youth Center Plaza, Nukus",
    price: "Free",
    bannerImage: "https://picsum.photos/seed/street_dance/1080/1350",
    isTopEvent: false
  },
  {
    title: "Theater: 'Adıńnan aylanayın'",
    description: "A dramatic performance exploring the themes of patriotism and the connection to the land of forefathers. A powerful staging by the regional theater troupe.",
    category: "theater",
    date: "2026-05-28",
    time: "18:00",
    location: "Berdaq Theater, Nukus",
    price: "25,000 UZS",
    bannerImage: "https://picsum.photos/seed/patriot_drama/1080/1350",
    isTopEvent: false
  },
  {
    title: "Festival: Traditional Games 'Alaman'",
    description: "A celebration of traditional Karakalpak sports and games. Archery contests, traditional wrestling, and equestrian demonstrations.",
    category: "festival",
    date: "2026-05-14",
    time: "09:00",
    location: "Ippodrom, Nukus",
    price: "Free",
    bannerImage: "https://picsum.photos/seed/games/1080/1350",
    isTopEvent: false
  }
];

export const initDummyData = async () => {
  try {
    const q = query(collection(db, 'events'), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("Initializing dummy events...");
      const batchPromises = DUMMY_EVENTS.map(event => 
        addDoc(collection(db, 'events'), {
          ...event,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );
      await Promise.all(batchPromises);
      console.log("Dummy events initialized!");
    } else {
      console.log("Database already has events. Skipping initialization.");
    }
  } catch (error) {
    // This will likely fail if the user is not an admin due to security rules
    console.warn("Skipping dummy data initialization (likely not an admin or database ready):", error);
  }
};
