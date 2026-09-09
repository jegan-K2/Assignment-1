const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Movie = require('./backend/models/Movie');
const Theatre = require('./backend/models/Theatre');
const User = require('./backend/models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/showlix';

const movies = [
    { title: "The Batman", poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070", rating: 4.8, description: "A dark take on the caped crusader.", language: "Tamil Dubbed Version", releaseDate: new Date("2024-03-04"), theatres: ["PVR Chennai", "AGS Cinemas"] },
    { title: "Oppenheimer", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025", rating: 4.9, description: "The father of the atomic bomb.", language: "Tamil Dubbed Version", releaseDate: new Date("2024-07-21"), theatres: ["PVR Chennai", "INOX Madurai"] },
    { title: "Interstellar", poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072", rating: 4.9, description: "Space exploration at its finest.", language: "Tamil Dubbed Version", releaseDate: new Date("2024-11-07"), theatres: ["PVR Chennai"] },
    { title: "Leo", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed0963c?q=80&w=2070", rating: 4.5, description: "A bloody sweet story.", language: "Tamil", releaseDate: new Date("2023-10-19"), theatres: ["Mahalakshmi Theatre", "PVR Chennai"] },
    { title: "Vikram", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070", rating: 4.7, description: "Action thriller.", language: "Tamil", releaseDate: new Date("2022-06-03"), theatres: ["Mahalakshmi Theatre", "PVR Chennai"] },
    { title: "Jai Bhim", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059", rating: 4.9, description: "Legal battle for justice.", language: "Tamil", releaseDate: new Date("2021-11-02"), theatres: ["Mahalakshmi Theatre"] },
    { title: "Pushpa 2", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070", rating: 4.7, description: "The rule begins.", language: "Tamil Dubbed Version", releaseDate: new Date("2025-12-05"), theatres: ["Mahalakshmi Theatre"] },
    { title: "Bahubali", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2037", rating: 4.9, description: "The beginning.", language: "Tamil Dubbed Version", releaseDate: new Date("2015-07-10"), theatres: ["AGS Cinemas"] },
    { title: "Master", poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070", rating: 4.3, description: "Clash between teacher and gangster.", language: "Tamil", releaseDate: new Date("2021-01-13"), theatres: ["Mahalakshmi Theatre"] },
    { title: "Kantar", poster: "https://images.unsplash.com/photo-1512070679279-8988d32161be?q=80&w=2070", rating: 4.6, description: "Legend of the forest.", language: "Tamil Dubbed Version", releaseDate: new Date("2022-09-30"), theatres: ["PVR Chennai"] }
];

// Re-generating 20+ movies for the seed
while(movies.length < 22) {
    const base = movies[movies.length % 10];
    movies.push({
        ...base,
        title: `${base.title} Part ${Math.floor(movies.length / 10) + 1}`,
        _id: undefined // Let mongoose generate id
    });
}

// =====================================================
// ALL 32 TAMIL NADU DISTRICTS - REAL THEATRE DATA
// =====================================================
const theatresData = [
    // CHENNAI
    { name: "PVR Cinemas", state: "Tamil Nadu", district: "Chennai", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM", "11:00 PM"] },
        { name: "Screen 3", timings: ["12:00 PM", "03:30 PM", "08:00 PM"] }
    ]},
    { name: "Sathyam Cinemas", state: "Tamil Nadu", district: "Chennai", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:30 PM", "06:30 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:30 PM"] },
        { name: "Screen 3", timings: ["12:30 PM", "04:00 PM", "09:00 PM"] }
    ]},
    { name: "Rohini Theatre", state: "Tamil Nadu", district: "Chennai", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:00 PM"] }
    ]},

    // COIMBATORE
    { name: "KG Cinemas", state: "Tamil Nadu", district: "Coimbatore", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] },
        { name: "Screen 3", timings: ["12:00 PM", "03:30 PM", "09:00 PM"] }
    ]},
    { name: "INOX Prozone", state: "Tamil Nadu", district: "Coimbatore", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Broadway Cinemas", state: "Tamil Nadu", district: "Coimbatore", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},

    // MADURAI
    { name: "Vetri Cinemas", state: "Tamil Nadu", district: "Madurai", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] },
        { name: "Screen 3", timings: ["12:00 PM", "04:00 PM", "09:00 PM"] }
    ]},
    { name: "Guru Cinemas", state: "Tamil Nadu", district: "Madurai", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Mini Priya Theatre", state: "Tamil Nadu", district: "Madurai", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"] }
    ]},

    // SALEM
    { name: "ARR Cinemas", state: "Tamil Nadu", district: "Salem", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] }
    ]},
    { name: "KS Theatre", state: "Tamil Nadu", district: "Salem", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:30 PM", "06:30 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Big Cinemas Salem", state: "Tamil Nadu", district: "Salem", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:00 PM", "10:00 PM"] }
    ]},

    // TIRUCHIRAPPALLI
    { name: "LA Cinemas", state: "Tamil Nadu", district: "Tiruchirappalli", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] },
        { name: "Screen 3", timings: ["12:00 PM", "03:30 PM", "09:00 PM"] }
    ]},
    { name: "Ramba Theatre", state: "Tamil Nadu", district: "Tiruchirappalli", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Sona Mina Theatre", state: "Tamil Nadu", district: "Tiruchirappalli", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"] }
    ]},

    // TIRUNELVELI
    { name: "GV Cinemas", state: "Tamil Nadu", district: "Tirunelveli", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Raja Rajeswari Theatre", state: "Tamil Nadu", district: "Tirunelveli", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // ERODE
    { name: "Kavitha Theatre", state: "Tamil Nadu", district: "Erode", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Sri Lakshmi Theatre", state: "Tamil Nadu", district: "Erode", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // VELLORE
    { name: "SPI Cinemas Vellore", state: "Tamil Nadu", district: "Vellore", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] }
    ]},
    { name: "Annai Theatre", state: "Tamil Nadu", district: "Vellore", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // THOOTHUKUDI
    { name: "Pearl City Cinemas", state: "Tamil Nadu", district: "Thoothukudi", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Murugan Theatre", state: "Tamil Nadu", district: "Thoothukudi", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:30 PM", "06:00 PM"] }
    ]},

    // DINDIGUL
    { name: "Vel Cinemas", state: "Tamil Nadu", district: "Dindigul", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] }
    ]},
    { name: "Sakthi Theatre", state: "Tamil Nadu", district: "Dindigul", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM"] }
    ]},

    // KALLAKURICHI
    { name: "Mahalakshmi Theatre", state: "Tamil Nadu", district: "Kallakurichi", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "RK Theatre", state: "Tamil Nadu", district: "Kallakurichi", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},
    { name: "City Cinemas", state: "Tamil Nadu", district: "Kallakurichi", screens: [
        { name: "Screen 1", timings: ["11:00 AM", "02:00 PM", "07:00 PM", "10:00 PM"] }
    ]},

    // KANCHIPURAM
    { name: "Sri Kanchi Theatre", state: "Tamil Nadu", district: "Kanchipuram", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Pallava Cinemas", state: "Tamil Nadu", district: "Kanchipuram", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // THANJAVUR
    { name: "Chola Cinemas", state: "Tamil Nadu", district: "Thanjavur", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Raja Theatre", state: "Tamil Nadu", district: "Thanjavur", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // VILLUPURAM
    { name: "Mani Theatre", state: "Tamil Nadu", district: "Villupuram", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Ponni Theatre", state: "Tamil Nadu", district: "Villupuram", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"] }
    ]},

    // TIRUPPUR
    { name: "SKS Cinemas", state: "Tamil Nadu", district: "Tiruppur", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] },
        { name: "Screen 3", timings: ["12:00 PM", "03:30 PM", "09:00 PM"] }
    ]},
    { name: "KR Theatre", state: "Tamil Nadu", district: "Tiruppur", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // NAMAKKAL
    { name: "Viyash Cinemas", state: "Tamil Nadu", district: "Namakkal", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Sri Raghavendra Theatre", state: "Tamil Nadu", district: "Namakkal", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // CUDDALORE
    { name: "Ganesh Theatre", state: "Tamil Nadu", district: "Cuddalore", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] }
    ]},
    { name: "Siva Theatre", state: "Tamil Nadu", district: "Cuddalore", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // SIVAGANGAI
    { name: "Meenatchi Theatre", state: "Tamil Nadu", district: "Sivagangai", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Vasantham Theatre", state: "Tamil Nadu", district: "Sivagangai", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM"] }
    ]},

    // VIRUDHUNAGAR
    { name: "Selvi Theatre", state: "Tamil Nadu", district: "Virudhunagar", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Pandian Theatre", state: "Tamil Nadu", district: "Virudhunagar", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // RAMANATHAPURAM
    { name: "Rajarajan Theatre", state: "Tamil Nadu", district: "Ramanathapuram", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Ram Theatre", state: "Tamil Nadu", district: "Ramanathapuram", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"] }
    ]},

    // KRISHNAGIRI
    { name: "KVB Cinemas", state: "Tamil Nadu", district: "Krishnagiri", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] }
    ]},
    { name: "Lakshmi Theatre", state: "Tamil Nadu", district: "Krishnagiri", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // DHARMAPURI
    { name: "Brindha Theatre", state: "Tamil Nadu", district: "Dharmapuri", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Saravana Theatre", state: "Tamil Nadu", district: "Dharmapuri", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // NILGIRIS
    { name: "Sterling Theatre", state: "Tamil Nadu", district: "Nilgiris", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] }
    ]},
    { name: "Ooty Picture Palace", state: "Tamil Nadu", district: "Nilgiris", screens: [
        { name: "Screen 1", timings: ["11:00 AM", "02:00 PM", "06:30 PM", "10:00 PM"] }
    ]},

    // ARIYALUR
    { name: "Thiruvalluvar Theatre", state: "Tamil Nadu", district: "Ariyalur", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Jayam Theatre", state: "Tamil Nadu", district: "Ariyalur", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM"] }
    ]},

    // PERAMBALUR
    { name: "New Saraswathi Theatre", state: "Tamil Nadu", district: "Perambalur", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] }
    ]},
    { name: "Bharathi Theatre", state: "Tamil Nadu", district: "Perambalur", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // TENKASI
    { name: "Kumaran Theatre", state: "Tamil Nadu", district: "Tenkasi", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Kailash Theatre", state: "Tamil Nadu", district: "Tenkasi", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // RANIPET
    { name: "Sri Vinayaga Theatre", state: "Tamil Nadu", district: "Ranipet", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] }
    ]},
    { name: "Abirami Theatre", state: "Tamil Nadu", district: "Ranipet", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // TIRUPATHUR
    { name: "Chitra Theatre", state: "Tamil Nadu", district: "Tirupathur", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Amman Theatre", state: "Tamil Nadu", district: "Tirupathur", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"] }
    ]},

    // MAYILADUTHURAI
    { name: "Sundar Theatre", state: "Tamil Nadu", district: "Mayiladuthurai", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Kaveri Theatre", state: "Tamil Nadu", district: "Mayiladuthurai", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // NAGAPATTINAM
    { name: "Malar Theatre", state: "Tamil Nadu", district: "Nagapattinam", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"] },
        { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"] }
    ]},
    { name: "Kumari Theatre", state: "Tamil Nadu", district: "Nagapattinam", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"] }
    ]},

    // PUDUKKOTTAI
    { name: "Sri Meenakshi Theatre", state: "Tamil Nadu", district: "Pudukkottai", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"] }
    ]},
    { name: "Thilagam Theatre", state: "Tamil Nadu", district: "Pudukkottai", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]},

    // KARUR
    { name: "Sri Durgha Theatre", state: "Tamil Nadu", district: "Karur", screens: [
        { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"] },
        { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"] }
    ]},
    { name: "Thangam Theatre", state: "Tamil Nadu", district: "Karur", screens: [
        { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"] }
    ]}
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for TN-only seeding...");
        
        await Movie.deleteMany({});
        await Theatre.deleteMany({});
        await User.deleteMany({ role: 'owner' });
        
        await Movie.insertMany(movies);
        await Theatre.insertMany(theatresData);
        
        const hashedPassword = await bcrypt.hash("J@egan231227b", 10);
        const owner = new User({
            email: "jeganbhudeva@gmail.com",
            password: hashedPassword,
            role: "owner"
        });
        await owner.save();
        
        console.log(`✅ Database Seeded: ${movies.length} movies, ${theatresData.length} theatres across 32 districts!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
