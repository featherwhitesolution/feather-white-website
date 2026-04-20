const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
    section: { type: String, required: true, unique: true }, // 'hero', 'about', 'featured_subtitle'
    data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

module.exports = HomeContent;
