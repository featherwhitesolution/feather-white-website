import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Save, Image, Type, Info, Share2, AlertCircle, CheckCircle2, RefreshCw, LayoutList, FileText, Upload, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

const AdminHomeContent = () => {
    const [subTab, setSubTab] = useState('hero');
    const [content, setContent] = useState({
        hero: { slides: [] },
        texts: { featuredTitle: '', featuredSubtitle: '' },
        about: { title: '', subtitle: '', description: '', image: '', buttonText: '' },
        social: { whatsapp: '', facebook: '', instagram: '', youtube: '', email: '', location: '' },
        privacy: { title: 'Privacy Policy', content: '' },
        terms: { title: 'Terms of Service', content: '' },
        returns: { title: 'Return Policy', content: '' },
        disclaimer: { title: 'Disclaimer', content: '' }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [uploading, setUploading] = useState({ index: null, status: false });
    const { userInfo } = useSelector((state) => state.user);

    const initConnection = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Admin CMS: Checking server connection...");
            const { data } = await api.get('/api/home');
            const newContent = { ...content };
            data.forEach(seg => { 
                if (seg.section && seg.data) {
                    newContent[seg.section] = seg.data; 
                }
            });
            setContent(newContent);
            setLoading(false);
            console.log("Admin CMS: Server connected successfully");
        } catch (err) {
            console.error('CMS Connection Error:', err);
            const failedUrl = err.config?.url || '/api/home';
            setError(`Connection Error: ${err.message}. (Attempted: ${failedUrl}). Ensure backend is on 5000.`);
            setLoading(false);
        }
    };

    useEffect(() => {
        initConnection();
    }, []);

    const handleSave = async (section) => {
        try {
            setError(null);
            setSuccess(false);
            const response = await api.post('/api/home', { 
                section, 
                data: content[section] 
            });
            if (response.data) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                alert(`${section.toUpperCase()} updated successfully!`);
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(`Save failed: ${msg}. If you see 404, it means the server is off or the URL is blocked.`);
        }
    };

    const uploadSliderImageHandler = async (e, index) => {
        const file = e.target.files[0];
        if (!file) {
            alert('No file detected by browser');
            return;
        }

        const formDataImage = new FormData();
        formDataImage.append('image', file);
        setUploading({ index, status: true });

        try {
            const { data } = await api.post('/api/upload', formDataImage, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            const safeUrl = (typeof data === 'object' && data !== null && data.url) ? data.url : data;
            const newSlides = [...content.hero.slides];
            newSlides[index].image = safeUrl;
            setContent({ ...content, hero: { slides: newSlides } });
            setUploading({ index: null, status: false });
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || error.message;
            alert(`File upload failed: ${errMsg}`);
            setUploading({ index: null, status: false });
        }
    };


    const updateNested = (section, field, value) => {
        setContent(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <RefreshCw className="w-10 h-10 text-gold-500 animate-spin" />
            <p className="mt-4 text-gold-400 font-serif">Connecting to Database...</p>
        </div>
    );

    const tabs = [
        { id: 'hero', name: 'Main Banner', icon: Image },
        { id: 'texts', name: 'Headings', icon: Type },
        { id: 'social', name: 'Social Links', icon: Share2 },
        { id: 'policies', name: 'Info Pages', icon: LayoutList }
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-100 p-6 rounded-2xl shadow-xl flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                        <AlertCircle className="shrink-0 text-red-500" />
                        <span className="font-bold">SYSTEM OFFLINE: {error}</span>
                    </div>
                    <button 
                        onClick={initConnection}
                        className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl transition-all w-fit font-bold shadow-lg"
                    >
                        <RefreshCw size={18} />
                        <span>RETRY CONNECTION NOW</span>
                    </button>
                </div>
            )}
            
            {success && (
                <div className="bg-green-500/20 border border-green-500 text-green-200 p-4 rounded-xl flex items-center space-x-3 shadow-lg">
                    <CheckCircle2 className="shrink-0" />
                    <span className="text-sm font-medium">Saved Successfully! Your site is live.</span>
                </div>
            )}

            <div className="flex bg-navy-800/80 p-2 rounded-2xl border border-white/10 overflow-x-auto">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSubTab(t.id)}
                        className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all whitespace-nowrap font-bold ${
                            subTab === t.id ? 'bg-gold-600 text-white shadow-lg' : 'text-cream-100/40 hover:bg-white/5 hover:text-cream-100'
                        }`}
                    >
                        <t.icon size={18} />
                        <span className="text-sm">{t.name}</span>
                    </button>
                ))}
            </div>

            <div className="min-h-[40vh] bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                {subTab === 'hero' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-8 bg-gold-600/10 -mx-8 -mt-8 p-8 rounded-t-3xl border-b border-gold-500/20">
                            <div>
                                <h3 className="text-3xl font-serif text-gold-400">Home Hero Slider</h3>
                                <p className="text-cream-100/50 text-sm mt-1">Manage the large rotating banners on your home page</p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setContent({...content, hero: { slides: [...content.hero.slides, { id: Date.now(), title: '', subtitle: '', image: '', cta: 'Shop Now' }] }})}
                                    className="px-6 py-3 bg-white/5 text-gold-400 border border-gold-400/30 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                                >
                                    <Plus size={20} />
                                    Add New Slide
                                </button>
                                <button 
                                    onClick={() => handleSave('hero')} 
                                    className="px-8 py-3 bg-gold-600 text-white font-black rounded-xl hover:bg-gold-500 active:bg-gold-700 shadow-lg shadow-gold-600/30 hover:shadow-gold-500/50 border border-gold-400 active:border-gold-600 flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 active:scale-95 active:translate-y-0"
                                >
                                    <Save size={20} />
                                    SAVE ALL CHANGES
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {content.hero.slides.map((s, i) => (
                                <div key={s._id || s.id || `slide-index-${i}`} className="bg-navy-800/50 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                                    <div className="flex justify-between items-center bg-white/5 -mx-6 -mt-6 p-4 rounded-t-2xl border-b border-white/5 mb-2">
                                        <span className="text-gold-500 font-bold text-sm">Slide #{i + 1}</span>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setContent({...content, hero: { slides: content.hero.slides.filter((_, idx) => idx !== i) }});
                                            }}
                                            className="text-red-500 hover:text-white hover:bg-red-500 p-3 rounded-lg transition-all shadow-sm border border-red-500/20 active:scale-95 flex items-center gap-2"
                                        >
                                            <Trash2 size={18} />
                                            <span className="text-xs font-bold uppercase">Remove Slide</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-cream-100/50 mb-1 block uppercase tracking-wider">Slide Image</label>
                                                <div className="flex gap-2">
                                                    <input 
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm" 
                                                        placeholder="Paste image URL..." 
                                                        value={s.image} 
                                                        onChange={(e) => {
                                                            const ns = [...content.hero.slides]; ns[i].image = e.target.value; setContent({...content, hero: {slides: ns}});
                                                        }} 
                                                    />
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            id={`slider-upload-${i}`}
                                                            onClick={(e) => e.target.value = null}
                                                            onChange={(e) => uploadSliderImageHandler(e, i)}
                                                            accept="image/*"
                                                        />
                                                        <label
                                                            htmlFor={`slider-upload-${i}`}
                                                            className="flex items-center justify-center bg-gold-600/20 hover:bg-gold-600/30 text-gold-500 p-2 rounded-xl cursor-pointer border border-gold-500/30 transition-all aspect-square"
                                                        >
                                                            {uploading.status && uploading.index === i ? (
                                                                <Loader2 size={18} className="animate-spin" />
                                                            ) : (
                                                                <Upload size={18} />
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {s.image && (
                                        <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-white/10">
                                            <img src={optimizeCloudinaryUrl(s.image, 'w_400,h_200,c_fill,q_auto,f_auto')} alt="Preview" className="w-full h-full object-cover opacity-50" />
                                            <div className="absolute inset-0 flex items-center justify-center text-xs text-cream-100/50 bg-black/40 font-bold uppercase tracking-widest">Preview Image</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-12 flex justify-center border-t border-white/10 pt-8">
                            <button 
                                onClick={() => handleSave('hero')} 
                                className="px-12 py-5 bg-gold-600 text-white font-black rounded-2xl hover:bg-gold-500 shadow-2xl shadow-gold-600/40 border-2 border-gold-400 flex items-center gap-3 text-xl transition-all hover:-translate-y-1 active:scale-95 group"
                            >
                                <Save size={28} className="group-hover:rotate-12 transition-transform" />
                                SAVE SLIDER CONTENT
                            </button>
                        </div>
                    </div>
                )}

                {subTab === 'texts' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h3 className="text-xl font-serif text-gold-400 border-b border-white/10 pb-4">Home Section Titles</h3>
                        <div>
                            <label className="text-sm opacity-60 block mb-2">Portfolio Heading</label>
                            <input className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white" value={content.texts.featuredTitle} onChange={(e) => updateNested('texts', 'featuredTitle', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm opacity-60 block mb-2">Description Subtitle</label>
                            <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white" value={content.texts.featuredSubtitle} onChange={(e) => updateNested('texts', 'featuredSubtitle', e.target.value)} />
                        </div>
                        <button onClick={() => handleSave('texts')} className="w-full py-4 bg-gold-600 text-white font-bold rounded-2xl shadow-lg border border-gold-500 transition-all uppercase tracking-widest text-lg">Update Titles</button>
                    </div>
                )}

                {subTab === 'social' && (
                    <div className="max-w-3xl mx-auto space-y-6 text-left">
                        <h3 className="text-xl font-serif text-gold-400 border-b border-white/10 pb-4 text-center">Social Media & Contacts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs opacity-50 block mb-1 uppercase tracking-wider">WhatsApp Number</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white" value={content.social.whatsapp} onChange={(e) => updateNested('social', 'whatsapp', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs opacity-50 block mb-1 uppercase tracking-wider">Instagram Page</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white" value={content.social.instagram} onChange={(e) => updateNested('social', 'instagram', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs opacity-50 block mb-1 uppercase tracking-wider">Support Email</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white" value={content.social.email} onChange={(e) => updateNested('social', 'email', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs opacity-50 block mb-1 uppercase tracking-wider">YouTube Link</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white" value={content.social.youtube} onChange={(e) => updateNested('social', 'youtube', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs opacity-50 block mb-1 uppercase tracking-wider">Facebook Page</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white" value={content.social.facebook} onChange={(e) => updateNested('social', 'facebook', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs opacity-50 block mb-1 uppercase tracking-wider">Store Location</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white" value={content.social.location} onChange={(e) => updateNested('social', 'location', e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleSave('social')} className="w-full py-4 bg-gold-600 text-white font-bold rounded-2xl shadow-lg border border-gold-500 uppercase tracking-widest text-lg mt-6">SAVE SOCIAL PROFILE</button>
                    </div>
                )}
                
                {subTab === 'policies' && (
                    <div className="max-w-4xl mx-auto space-y-8 text-left">
                        <h3 className="text-2xl font-serif text-gold-400 border-b border-white/10 pb-4">Legal & Information Pages</h3>
                        
                        {/* Privacy Policy */}
                        <div className="bg-navy-800/40 p-6 rounded-2xl border border-white/5 space-y-4">
                            <h4 className="flex items-center space-x-2 text-gold-500 font-bold">
                                <FileText size={18} />
                                <span>Privacy Policy</span>
                            </h4>
                            <textarea 
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white min-h-[150px] text-sm leading-relaxed" 
                                value={content.privacy.content} 
                                placeholder="Enter your privacy policy text here..."
                                onChange={(e) => updateNested('privacy', 'content', e.target.value)} 
                            />
                            <button onClick={() => handleSave('privacy')} className="px-6 py-2 bg-gold-600 text-white rounded-lg font-bold hover:bg-gold-500 test-xs uppercase tracking-wider transition-colors">Save Privacy Policy</button>
                        </div>

                        {/* Terms of Service */}
                        <div className="bg-navy-800/40 p-6 rounded-2xl border border-white/5 space-y-4">
                            <h4 className="flex items-center space-x-2 text-gold-500 font-bold">
                                <FileText size={18} />
                                <span>Terms of Service</span>
                            </h4>
                            <textarea 
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white min-h-[150px] text-sm leading-relaxed" 
                                value={content.terms?.content || ''} 
                                placeholder="Enter your terms of service text here..."
                                onChange={(e) => updateNested('terms', 'content', e.target.value)} 
                            />
                            <button onClick={() => handleSave('terms')} className="px-6 py-2 bg-gold-600 text-white rounded-lg font-bold hover:bg-gold-500 test-xs uppercase tracking-wider transition-colors">Save Terms of Service</button>
                        </div>

                        {/* Return Policy */}
                        <div className="bg-navy-800/40 p-6 rounded-2xl border border-white/5 space-y-4">
                            <h4 className="flex items-center space-x-2 text-gold-500 font-bold">
                                <RefreshCw size={18} />
                                <span>Return Policy</span>
                            </h4>
                            <textarea 
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white min-h-[150px] text-sm leading-relaxed" 
                                value={content.returns.content} 
                                placeholder="Enter your return policy text here..."
                                onChange={(e) => updateNested('returns', 'content', e.target.value)} 
                            />
                            <button onClick={() => handleSave('returns')} className="px-6 py-2 bg-gold-600 text-white rounded-lg font-bold hover:bg-gold-500 test-xs uppercase tracking-wider transition-colors">Save Return Policy</button>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-navy-800/40 p-6 rounded-2xl border border-white/5 space-y-4">
                            <h4 className="flex items-center space-x-2 text-gold-500 font-bold">
                                <AlertCircle size={18} />
                                <span>Disclaimer</span>
                            </h4>
                            <textarea 
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white min-h-[150px] text-sm leading-relaxed" 
                                value={content.disclaimer.content} 
                                placeholder="Enter your disclaimer text here..."
                                onChange={(e) => updateNested('disclaimer', 'content', e.target.value)} 
                            />
                            <button onClick={() => handleSave('disclaimer')} className="px-6 py-2 bg-gold-600 text-white rounded-lg font-bold hover:bg-gold-500 test-xs uppercase tracking-wider transition-colors">Save Disclaimer</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHomeContent;
