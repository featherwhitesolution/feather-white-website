const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HomeContent = require('./models/HomeContent');

dotenv.config({ path: './backend/.env' });

const privacyContent = `Feather White respects your privacy. We collect personal information only to process your orders and improve your shopping experience.

We do not sell or share your personal data with third parties, except as necessary to fulfil your order (e.g., shipping providers).`;

const returnsContent = `We accept returns only if the product delivered is wrong or physically damaged. 

Unopened and unused products may be requested for replacement within 15 days of purchase, provided the original seal, packaging, and invoice are intact. Used or tampered products will not be accepted. 

Shipping charges are non-refundable. 

All return requests must be supported with proper proof (unboxing video/images). We reserve the right to approve or reject any return based on verification.`;

const disclaimerContent = `For external use only. Avoid contact with eyes. We recommend a patch test on a small area of skin before full use. If irritation or a rash develops, discontinue use immediately and consult a healthcare professional. Individual results may vary. This product is not intended to diagnose, treat, cure, or prevent any disease. 

While our products are formulated to achieve high-quality results, outcomes are not guaranteed and may vary depending on individual factors, usage frequency, and application methods. Feather White is not responsible for any adverse effects or lack of results arising from improper use.`;

const termsContent = `By accessing and using Feather White, you agree to comply with the following terms:

1. Product Use: All our products are handcrafted with natural essences. We recommend a patch test before regular use. Feather White is not liable for individual skin reactions.

2. Intellectual Property: All content, designs, and logos are the property of Feather White. Unauthorized use is strictly prohibited.

3. Pricing & Availability: We reserve the right to change prices and product availability without prior notice.

4. Legal Jurisdiction: Any disputes arising from the use of this website shall be governed by the laws of India and subject to Mumbai jurisdiction.`;

const seedPolicies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB to seed policies...');

        const sections = [
            { section: 'privacy', data: { title: 'Privacy Policy', content: privacyContent } },
            { section: 'returns', data: { title: 'Return Policy', content: returnsContent } },
            { section: 'disclaimer', data: { title: 'Disclaimer', content: disclaimerContent } },
            { section: 'terms', data: { title: 'Terms of Service', content: termsContent } }
        ];

        for (const item of sections) {
            await HomeContent.findOneAndUpdate(
                { section: item.section },
                item,
                { upsert: true, new: true }
            );
            console.log(`Seeded ${item.section} content`);
        }

        console.log('Policy seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedPolicies();
