
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        const count = await User.countDocuments();
        console.log(`User count: ${count}`);
        const admins = await User.find({ isAdmin: true });
        console.log(`Admin count: ${admins.length}`);
        if (admins.length > 0) {
            console.log('Admins:', admins.map(a => a.email));
        } else {
            console.log('No admins found!');
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkUsers();
