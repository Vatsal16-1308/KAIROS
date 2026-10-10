import hero1 from "../assets/images/hero.jpg";
import hero2 from "../assets/images/hero2.jpg";
import hero3 from "../assets/images/hero3.jpg";
import hero4 from "../assets/images/hero4.jpg";

const events = [
  {
    id: 1,
    title: "AI Innovation Summit 2026",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
    date: "24 Aug 2026",
    location: "Main Auditorium",
    category: "Workshop",
    price: "Free",
    capacity: 300,
    remainingTickets: 285,
    organizer: "IEEE Student Chapter",
    description: "Explore breakthroughs in Generative AI, LLMs, and Neural Networks with live coding labs and expert tech keynotes."
  },
  {
    id: 2,
    title: "HackX 2026 Hackathon",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    date: "02 Sep 2026",
    location: "Tech Block Labs",
    category: "Hackathon",
    price: "₹199",
    capacity: 250,
    remainingTickets: 210,
    organizer: "CSI Student Chapter",
    description: "The premier 36-hour annual hackathon! Build disruptive Web3, AI, and Cloud solutions for ₹1,50,000+ cash prizes."
  },
  {
    id: 3,
    title: "Battle of Bands Live Concert",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    date: "15 Sep 2026",
    location: "Open Air Amphitheatre",
    category: "Music",
    price: "₹99",
    capacity: 500,
    remainingTickets: 440,
    organizer: "Harmony Music Guild",
    description: "Campus rock, pop & fusion music showdown! Top college bands compete live for trophies and record label contracts."
  },
  {
    id: 4,
    title: "Inter-College Basketball League",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
    date: "20 Sep 2026",
    location: "Indoor Sports Arena",
    category: "Sports",
    price: "Free",
    capacity: 400,
    remainingTickets: 390,
    organizer: "Sports Council",
    description: "High-octane collegiate basketball championship featuring 16 varsity teams vying for the state cup."
  },
  {
    id: 5,
    title: "Tarang Cultural Fest 2026",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    date: "28 Sep 2026",
    location: "Grand Central Arena",
    category: "Cultural Fest",
    price: "₹149",
    capacity: 600,
    remainingTickets: 520,
    organizer: "Cultural Committee",
    description: "The annual mega cultural fiesta celebrating dance, fashion, theatrical arts, and celebrity guest performances."
  },
  {
    id: 6,
    title: "Future of Tech Leadership",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    date: "12 Oct 2026",
    location: "Executive Center B",
    category: "Seminar",
    price: "Free",
    capacity: 200,
    remainingTickets: 180,
    organizer: "Alumni Network",
    description: "Silicon Valley alumni leaders share key insights on building tech unicorns and leading engineering organizations."
  },
  {
    id: 7,
    title: "RoboWars 2026 Combat League",
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=800&auto=format&fit=crop",
    date: "18 Oct 2026",
    location: "Robotics Arena",
    category: "Workshop",
    price: "₹249",
    capacity: 350,
    remainingTickets: 290,
    organizer: "Robotics Society",
    description: "Heavyweight combat bot battles in an enclosed steel cage arena. Flame throwers, spinners, and mechanical mayhem!"
  },
  {
    id: 8,
    title: "Valorant Campus E-Sports Arena",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    date: "25 Oct 2026",
    location: "Digital Gaming Hub",
    category: "Sports",
    price: "₹149",
    capacity: 320,
    remainingTickets: 260,
    organizer: "Gaming Alliance",
    description: "Inter-collegiate 5v5 FPS tournament streamed live on Twitch with pro caster commentary and gaming peripherals."
  },
  {
    id: 9,
    title: "Figma UI/UX Design Sprint",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
    date: "05 Nov 2026",
    location: "Design Studio 402",
    category: "Workshop",
    price: "Free",
    capacity: 150,
    remainingTickets: 120,
    organizer: "Creative Tech Guild",
    description: "Master modern product design, component systems, and interactive prototyping with lead designers from top agencies."
  },
  {
    id: 10,
    title: "Campus Startup Pitchfest",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
    date: "12 Nov 2026",
    location: "Incubation Center",
    category: "Seminar",
    price: "Free",
    capacity: 250,
    remainingTickets: 215,
    organizer: "E-Cell Incubator",
    description: "Student founders pitch innovative ventures directly to Angel Investors and Venture Capitalists for seed funding."
  },
  {
    id: 11,
    title: "Stargazing & Astronomy Night",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop",
    date: "20 Nov 2026",
    location: "Observatory Deck",
    category: "Seminar",
    price: "Free",
    capacity: 180,
    remainingTickets: 145,
    organizer: "Astro Physics Club",
    description: "Night sky observation featuring high-powered telescopes, celestial photography workshops, and deep-space discussions."
  },
  {
    id: 12,
    title: "Street Play & Nukkad Natak Fest",
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=800&auto=format&fit=crop",
    date: "01 Dec 2026",
    location: "Campus Quadrangle",
    category: "Cultural Fest",
    price: "Free",
    capacity: 450,
    remainingTickets: 410,
    organizer: "Dramatics Society",
    description: "Powerful social impact theatre performances, drum rhythms, and expressive street drama competitions."
  }
];

export default events;