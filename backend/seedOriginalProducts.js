const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const originalProducts = [
    {
        name: 'Night Fairness Cream',
        description: 'Awaken to a brighter, more even complexion. This luxurious night cream repairs and rejuvenates your skin while you sleep, reducing dark spots and promoting a youthful, radiant fairness.',
        price: 1850,
        originalPrice: 2200,
        discount: 15,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop',
        category: 'Skincare',
        skinType: 'All',
        stockStatus: 'In Stock',
        isFeatured: true,
    },
    {
        name: 'Radiance Kojic Acid Soap',
        description: 'Experience the ultimate skin brightening with our Kojic Acid Soap. Crafted to gently exfoliate, lighten pigmentation, and reveal a significantly smoother, more radiant skin texture.',
        price: 499,
        originalPrice: 650,
        discount: 23,
        image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=2000&auto=format&fit=crop',
        category: 'Skincare',
        skinType: 'All',
        stockStatus: 'In Stock',
        isFeatured: true,
    },
    {
        name: 'Lavender Soap',
        description: 'A calming artisan soap infused with pure French lavender essential oil. It deeply cleanses while soothing your senses, providing a relaxing, spa-like bathing experience.',
        price: 399,
        originalPrice: 499,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=2000&auto=format&fit=crop',
        category: 'Skincare',
        skinType: 'Sensitive',
        stockStatus: 'In Stock',
        isFeatured: false,
    },
    {
        name: 'Hibiscus Hair Oil',
        description: 'Revitalize your roots with the power of nature. This potent blend of hibiscus extracts and botanical oils strengthens hair follicles, promotes thick growth, and adds a brilliant, healthy shine.',
        price: 850,
        originalPrice: 1100,
        discount: 22,
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2000&auto=format&fit=crop',
        category: 'Haircare',
        skinType: 'All',
        stockStatus: 'In Stock',
        isFeatured: true,
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Original Products Data');

        await Product.deleteMany(); // Clear existing temporary products
        await Product.insertMany(originalProducts);
        
        console.log('Original Products Restored Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error Restoring Products:', error);
        process.exit(1);
    }
};

seedProducts();
