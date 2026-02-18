import React from 'react';
import Hero from '../components/Hero';

const Home = () => {
    return (
        <div className="bg-navy-900 min-h-screen">
            <Hero />

            {/* Featured Section Placeholder */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="font-serif text-4xl text-cream-100 mb-4">Our Featured Collection</h2>
                    <p className="font-sans text-cream-100/70 mb-12">Experience the best of nature and luxury combined.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                        {/* Featured Item 1: Luxury Hair Oil */}
                        <div className="group relative overflow-hidden rounded-lg shadow-xl border border-gold-500/20">
                            <div className="aspect-[3/4] bg-navy-800 relative">
                                <img
                                    src="/assets/hair_oil.png"
                                    alt="Luxury Hair Oil"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button className="bg-gold-500 text-navy-900 px-6 py-2 font-bold uppercase tracking-wider hover:bg-cream-100 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-navy-800 text-center">
                                <h3 className="text-xl font-serif text-gold-500 mb-1">Feel The Royal Hair Growth</h3>
                                <p className="text-cream-100/70 text-sm">Nourish your scalp with goodness of nature-infused oils.</p>
                            </div>
                        </div>

                        {/* Featured Item 2: Velvet Night Cream */}
                        <div className="group relative overflow-hidden rounded-lg shadow-xl border border-gold-500/20">
                            <div className="aspect-[3/4] bg-navy-800 relative">
                                <img
                                    src="/assets/Moisturiser.png"
                                    alt="Velvet Night Cream"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button className="bg-gold-500 text-navy-900 px-6 py-2 font-bold uppercase tracking-wider hover:bg-cream-100 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-navy-800 text-center">
                                <h3 className="text-xl font-serif text-gold-500 mb-1">Non Oilly Non Sticky Moisturiser</h3>
                                <p className="text-cream-100/70 text-sm">Rich hydration for an elegant glow.</p>
                            </div>
                        </div>

                        {/* Featured Item 3: Feather White Special */}
                        <div className="group relative overflow-hidden rounded-lg shadow-xl border border-gold-500/20">
                            <div className="aspect-[3/4] bg-navy-800 relative">
                                <img
                                    src="/assets/Feather white.png"
                                    alt="Feather White Special"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button className="bg-gold-500 text-navy-900 px-6 py-2 font-bold uppercase tracking-wider hover:bg-cream-100 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-navy-800 text-center">
                                <h3 className="text-xl font-serif text-gold-500 mb-1">Signature Collection</h3>
                                <p className="text-cream-100/70 text-sm">The essence of purity in every drop.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
