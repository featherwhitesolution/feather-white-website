const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log('--- Checking URLs for Products ---');
        
        products.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`Main Image String: "${p.image}"`);
            console.log(`Additional Images Array Length: ${p.additionalImages.length}`);
            p.additionalImages.forEach((img, idx) => {
                console.log(`  [${idx}]: "${img}"`);
            });
            console.log('-----------------------------------');
        });

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkImages();
