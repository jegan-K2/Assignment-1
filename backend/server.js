const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load .env from project root (one level above backend/)
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/theatres', require('./routes/theatres'));
app.use('/api/bookings', require('./routes/bookings'));

// MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/showlix';
const Theatre = require('./models/Theatre');

async function seedTheatres() {
    try {
        const count = await Theatre.countDocuments();
        if (count === 0) {
            // =====================================================
            // REAL THEATRE DATA - ALL 32 TAMIL NADU DISTRICTS
            // Theatres have 1-3 screens based on size
            // =====================================================
            const theatreData = [
                // ---- CHENNAI (Multiplex hub - 3 screens each) ----
                { name: "PVR Cinemas", district: "Chennai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM", "11:00 PM"], seats: [] },
                    { name: "Screen 3", timings: ["12:00 PM", "03:30 PM", "08:00 PM"], seats: [] }
                ]},
                { name: "Sathyam Cinemas", district: "Chennai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:30 PM", "06:30 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:30 PM"], seats: [] },
                    { name: "Screen 3", timings: ["12:30 PM", "04:00 PM", "09:00 PM"], seats: [] }
                ]},
                { name: "Rohini Theatre", district: "Chennai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:00 PM"], seats: [] }
                ]},

                // ---- COIMBATORE ----
                { name: "KG Cinemas", district: "Coimbatore", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] },
                    { name: "Screen 3", timings: ["12:00 PM", "03:30 PM", "09:00 PM"], seats: [] }
                ]},
                { name: "INOX Prozone", district: "Coimbatore", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Broadway Cinemas", district: "Coimbatore", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},

                // ---- MADURAI ----
                { name: "Vetri Cinemas", district: "Madurai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] },
                    { name: "Screen 3", timings: ["12:00 PM", "04:00 PM", "09:00 PM"], seats: [] }
                ]},
                { name: "Guru Cinemas", district: "Madurai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Mini Priya Theatre", district: "Madurai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- SALEM ----
                { name: "ARR Cinemas", district: "Salem", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "KS Theatre", district: "Salem", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:30 PM", "06:30 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Big Cinemas Salem", district: "Salem", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:00 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- TIRUCHIRAPPALLI ----
                { name: "LA Cinemas", district: "Tiruchirappalli", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] },
                    { name: "Screen 3", timings: ["12:00 PM", "03:30 PM", "09:00 PM"], seats: [] }
                ]},
                { name: "Ramba Theatre", district: "Tiruchirappalli", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Sona Mina Theatre", district: "Tiruchirappalli", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- TIRUNELVELI ----
                { name: "GV Cinemas", district: "Tirunelveli", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Raja Rajeswari Theatre", district: "Tirunelveli", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},
                { name: "Sri Devi Cinemas", district: "Tirunelveli", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["11:00 AM", "02:00 PM", "07:00 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- ERODE ----
                { name: "Kavitha Theatre", district: "Erode", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Sri Lakshmi Theatre", district: "Erode", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- VELLORE ----
                { name: "SPI Cinemas Vellore", district: "Vellore", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Annai Theatre", district: "Vellore", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- THOOTHUKUDI ----
                { name: "Pearl City Cinemas", district: "Thoothukudi", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Murugan Theatre", district: "Thoothukudi", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:30 PM", "06:00 PM"], seats: [] }
                ]},

                // ---- DINDIGUL ----
                { name: "Vel Cinemas", district: "Dindigul", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Sakthi Theatre", district: "Dindigul", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- KALLAKURICHI ----
                { name: "Mahalakshmi Theatre", district: "Kallakurichi", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "RK Theatre", district: "Kallakurichi", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},
                { name: "City Cinemas", district: "Kallakurichi", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["11:00 AM", "02:00 PM", "07:00 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- KANCHIPURAM ----
                { name: "Sri Kanchi Theatre", district: "Kanchipuram", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Pallava Cinemas", district: "Kanchipuram", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- THANJAVUR ----
                { name: "Chola Cinemas", district: "Thanjavur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Raja Theatre", district: "Thanjavur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- VILLUPURAM ----
                { name: "Mani Theatre", district: "Villupuram", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Ponni Theatre", district: "Villupuram", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- TIRUPPUR ----
                { name: "SKS Cinemas", district: "Tiruppur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] },
                    { name: "Screen 3", timings: ["12:00 PM", "03:30 PM", "09:00 PM"], seats: [] }
                ]},
                { name: "KR Theatre", district: "Tiruppur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- NAMAKKAL ----
                { name: "Viyash Cinemas", district: "Namakkal", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Sri Raghavendra Theatre", district: "Namakkal", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- CUDDALORE ----
                { name: "Ganesh Theatre", district: "Cuddalore", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Siva Theatre", district: "Cuddalore", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- SIVAGANGAI ----
                { name: "Meenatchi Theatre", district: "Sivagangai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Vasantham Theatre", district: "Sivagangai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- VIRUDHUNAGAR ----
                { name: "Selvi Theatre", district: "Virudhunagar", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Pandian Theatre", district: "Virudhunagar", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- RAMANATHAPURAM ----
                { name: "Rajarajan Theatre", district: "Ramanathapuram", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Ram Theatre", district: "Ramanathapuram", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- KRISHNAGIRI ----
                { name: "KVB Cinemas", district: "Krishnagiri", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Lakshmi Theatre", district: "Krishnagiri", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- DHARMAPURI ----
                { name: "Brindha Theatre", district: "Dharmapuri", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Saravana Theatre", district: "Dharmapuri", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- NILGIRIS ----
                { name: "Sterling Theatre", district: "Nilgiris", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] }
                ]},
                { name: "Ooty Picture Palace", district: "Nilgiris", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["11:00 AM", "02:00 PM", "06:30 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- ARIYALUR ----
                { name: "Thiruvalluvar Theatre", district: "Ariyalur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Jayam Theatre", district: "Ariyalur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- PERAMBALUR ----
                { name: "New Saraswathi Theatre", district: "Perambalur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] }
                ]},
                { name: "Bharathi Theatre", district: "Perambalur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- TENKASI ----
                { name: "Kumaran Theatre", district: "Tenkasi", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Kailash Theatre", district: "Tenkasi", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- RANIPET ----
                { name: "Sri Vinayaga Theatre", district: "Ranipet", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Abirami Theatre", district: "Ranipet", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- TIRUPATHUR ----
                { name: "Chitra Theatre", district: "Tirupathur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Amman Theatre", district: "Tirupathur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- MAYILADUTHURAI ----
                { name: "Sundar Theatre", district: "Mayiladuthurai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Kaveri Theatre", district: "Mayiladuthurai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- NAGAPATTINAM ----
                { name: "Malar Theatre", district: "Nagapattinam", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:30 AM", "03:00 PM", "07:30 PM"], seats: [] }
                ]},
                { name: "Kumari Theatre", district: "Nagapattinam", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "02:00 PM", "06:30 PM", "10:00 PM"], seats: [] }
                ]},

                // ---- PUDUKKOTTAI ----
                { name: "Sri Meenakshi Theatre", district: "Pudukkottai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:00 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Thilagam Theatre", district: "Pudukkottai", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]},

                // ---- KARUR ----
                { name: "Sri Durgha Theatre", district: "Karur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"], seats: [] },
                    { name: "Screen 2", timings: ["11:00 AM", "02:30 PM", "07:00 PM"], seats: [] }
                ]},
                { name: "Thangam Theatre", district: "Karur", state: "Tamil Nadu", screens: [
                    { name: "Screen 1", timings: ["10:30 AM", "01:30 PM", "06:30 PM"], seats: [] }
                ]}
            ];

            await Theatre.insertMany(theatreData);
            console.log(`✅ Seeded ${theatreData.length} theatres across all 32 Tamil Nadu districts`);
        } else {
            console.log(`ℹ️ Theatre data exists (${count} theatres). Skipping seed.`);
        }
    } catch (err) {
        console.error('Error seeding theatres:', err);
    }
}

// ─── MongoDB Connection Event Listeners ───────────────────────────────────────
mongoose.connection.on('connected', () => console.log('✅ MongoDB connected successfully'));
mongoose.connection.on('error',     (err) => console.error('❌ MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));

// ─── Start Server only after DB is ready ──────────────────────────────────────
async function startServer() {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,   // fail fast if MongoDB is unreachable
            socketTimeoutMS: 45000,
        });

        // Seed default theatre data on first run
        await seedTheatres();

        // Fallback to index.html for unknown routes (SPA support)
        // app.get('*', (req, res) => {
        //     res.sendFile(path.join(__dirname, '../frontend/index.html'));
        // });

        app.listen(PORT, () => {
            console.log(`🚀 Showlix server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        console.error('   Make sure MongoDB is running on', MONGO_URI);
        process.exit(1);
    }
}

startServer();
