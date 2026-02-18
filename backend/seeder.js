const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const products = [
    {
        name: 'Royal Emerald Facial Oil',
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=2670&auto=format&fit=crop',
        description: 'A luxurious blend of rare oils to rejuvenate your skin.',
        category: 'Skincare',
        skinType: 'Dry',
        price: 1200,
        stock: 50,
        isFeatured: true,
    },
    {
        name: 'Gold Dust Setting Powder',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1920&auto=format&fit=crop',
        description: 'Finely milled powder infused with real gold particles for a radiant finish.',
        category: 'Makeup',
        skinType: 'All',
        price: 950,
        stock: 30,
        isFeatured: true,
    },
    {
        name: 'Velvet Midnight Night Cream',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop',
        description: 'Intense hydration for overnight repair. Wake up like royalty.',
        category: 'Skincare',
        skinType: 'Dry',
        price: 1500,
        stock: 20,
        isFeatured: true,
    },
    {
        name: 'Sapphire Balancing Toner',
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1888&auto=format&fit=crop',
        description: 'Restore pH balance with this gentle, gem-infused toner.',
        category: 'Skincare',
        skinType: 'Oily',
        price: 800,
        stock: 40,
        isFeatured: false,
    },
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();

    try {
        await Product.deleteMany();
        await User.deleteMany();

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@featherwhite.com',
            password: hashedPassword,
            isAdmin: true,
        });

        console.log('Admin User Created');

        await Product.insertMany(products);
        console.log('Data Imported!');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

importData();
