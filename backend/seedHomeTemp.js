const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HomeContent = require('./models/HomeContent');

dotenv.config();

const seedHomeContent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Complete Home Content seeding...');

        const heroContent = {
            section: 'hero',
            data: {
                slides: [
                    {
                        id: 1,
                        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1920&auto=format&fit=crop',
                        title: 'Royal Elegance',
                        subtitle: 'Discover the essence of pure luxury.',
                        cta: 'Shop Collection'
                    },
                    {
                        id: 2,
                        image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1920&auto=format&fit=crop',
                        title: 'Timeless Beauty',
                        subtitle: 'Crafted for the modern royalty.',
                        cta: 'Explore More'
                    }
                ]
            }
        };

        const texts = {
            section: 'texts',
            data: {
                featuredTitle: 'Our Featured Collection',
                featuredSubtitle: 'Experience the best of nature and luxury combined.',
            }
        };

        const aboutContent = {
            section: 'about',
            data: {
                title: 'Our Pure Essence',
                subtitle: 'The Story of Feather White',
                description: 'We believe that beauty is an art form. Our products are meticulously crafted using the finest natural ingredients infused with modern science to give you a royal experience that nourishes your soul and your skin.',
                image: 'https://images.unsplash.com/photo-1596462502278-27bfac4033c8?auto=format&fit=crop&q=80&w=800',
                buttonText: 'Read Our Story'
            }
        };

        const categoriesContent = {
            section: 'categories',
            data: [
                { id: 1, name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400', link: '/products?category=Skincare' },
                { id: 2, name: 'Makeup', image: 'https://images.unsplash.com/photo-1522335714187-ad2622630594?auto=format&fit=crop&q=80&w=400', link: '/products?category=Makeup' },
                { id: 3, name: 'Fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400', link: '/products?category=Fragrance' },
                { id: 4, name: 'Haircare', image: 'https://images.unsplash.com/photo-1527799822367-a05eb5702a51?auto=format&fit=crop&q=80&w=400', link: '/products?category=Haircare' }
            ]
        };

        const testimonialsContent = {
            section: 'testimonials',
            data: [
                { id: 1, name: 'Ananya S.', text: 'The Royal Gold Serum changed my skin texture in just 2 weeks. It feels like liquid luxury!', rating: 5 },
                { id: 2, name: 'Rahul V.', text: 'Finally a brand that understands modern luxury without losing natural essence.', rating: 5 },
                { id: 3, name: 'Priya M.', text: 'The packaging and the products are both 10/10. Definitely my new go-to.', rating: 5 }
            ]
        };

        const socialContent = {
            section: 'social',
            data: {
                whatsapp: '917977287353',
                facebook: '#',
                instagram: '#',
                youtube: '#',
                email: 'samsungin123@gmail.com',
                location: 'Mumbai, Maharashtra'
            }
        };

        await HomeContent.deleteMany({ section: { $in: ['hero', 'texts', 'about', 'categories', 'testimonials', 'social'] } });
        await HomeContent.create([heroContent, texts, aboutContent, categoriesContent, testimonialsContent, socialContent]);

        console.log('Complete home content seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding home content:', error);
        process.exit(1);
    }
};

seedHomeContent();
