const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const dummyProducts = [
    {
        name: 'Royal Gold Anti-Aging Serum',
        description: 'Infused with 24K gold flakes, this serum revitalizes skin and reduces fine lines for a radiant glow.',
        price: 2499,
        originalPrice: 3299,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        stockStatus: 'In Stock',
        isFeatured: true,
        discount: 25,
        skinType: 'All',
    },
    {
        name: 'Velvet Matte Lipstick - Rubi',
        description: 'Long-lasting, highly pigmented matte lipstick that glides on smoothly without drying lips.',
        price: 899,
        originalPrice: 1200,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Makeup',
        stockStatus: 'In Stock',
        isFeatured: false,
        discount: 15,
        skinType: 'All',
    },
    {
        name: 'Hydrating Rose Water Toner',
        description: 'Natural rose water toner to balance pH levels and hydrate skin instantly.',
        price: 450,
        originalPrice: 600,
        image: 'https://images.unsplash.com/photo-1608248598279-f9c349195b0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        stockStatus: 'Coming Soon',
        isFeatured: false,
        discount: 0,
        skinType: 'All',
    },
    {
        name: 'Silk peptide Night Cream',
        description: 'Deeply nourishing night cream that repairs skin barrier while you sleep.',
        price: 1599,
        originalPrice: 2000,
        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        stockStatus: 'In Stock',
        isFeatured: true,
        discount: 10,
        skinType: 'Dry',
    },
    {
        name: 'Charcoal Detox Face Mask',
        description: 'Activated charcoal mask to draw out impurities and unclog pores.',
        price: 799,
        originalPrice: 999,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        stockStatus: 'In Stock',
        isFeatured: false,
        discount: 20,
        skinType: 'Oily',
    },
    {
        name: 'Golden Glow Body Oil',
        description: 'Luxurious body oil with shimmering particles for a sun-kissed look.',
        price: 1299,
        originalPrice: 1800,
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        stockStatus: 'In Stock',
        isFeatured: true,
        discount: 30,
        skinType: 'All',
    },
    {
        name: 'Exfoliating Coffee Scrub',
        description: 'Natural coffee scrub to exfoliate dead skin cells and improve blood circulation.',
        price: 599,
        originalPrice: 850,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        stockStatus: 'In Stock',
        isFeatured: false,
        discount: 25,
        skinType: 'All',
    },
    {
        name: 'Vitamin C Brightening Serum',
        description: 'Potent Vitamin C serum to fade dark spots and even out skin tone.',
        price: 1899,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        stockStatus: 'In Stock',
        isFeatured: true,
        discount: 15,
        skinType: 'All',
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        await Product.deleteMany(); // Clear existing products
        await Product.insertMany(dummyProducts);
        
        console.log('Dummy Products Imported Successfully');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedProducts();
