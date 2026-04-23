
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config();

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        const count = await Product.countDocuments();
        console.log(`Product count: ${count}`);
        if (count > 0) {
            const products = await Product.find().limit(5);
            console.log('Sample products:', products.map(p => p.name));
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkProducts();
