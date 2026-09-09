const mongoose = require('mongoose');
const Theatre = require('./backend/models/Theatre');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/showlix';

async function check() {
    await mongoose.connect(MONGO_URI);
    const count = await Theatre.countDocuments();
    console.log("Theatre count:", count);
    if (count > 0) {
        const sample = await Theatre.findOne();
        console.log("Sample Theatre:", JSON.stringify(sample, null, 2));
    }
    process.exit();
}
check();
