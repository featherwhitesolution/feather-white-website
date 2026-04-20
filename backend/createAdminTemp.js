const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if admin exists
        let adminUser = await User.findOne({ email: 'admin@featherwhite.com' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@featherwhite.com',
                password: hashedPassword,
                isAdmin: true,
            });
            console.log('Admin User Created');
        } else {
            adminUser.password = hashedPassword;
            adminUser.isAdmin = true;
            await adminUser.save();
            console.log('Admin User Updated with password 123456');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
