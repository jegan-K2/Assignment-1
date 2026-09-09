const mongoose = require('mongoose');
const Theatre = require('./backend/models/Theatre');
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/showlix';

async function check() {
    await mongoose.connect(MONGO_URI);
    const districts = await Theatre.distinct('district');
    console.log("Districts in DB:", districts);
    process.exit();
}
check();
