import React, { useState } from 'react';
import { Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';

const SocialConnect = ({ socialData, getLink }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Safe fallbacks in case props are not passed immediately
  const safeData = socialData || {
      instagram: '#',
      youtube: '#',
      facebook: '#',
      whatsapp: ''
  };
  
  const safeGetLink = getLink || ((url) => url || '#');

  const handleLinkClick = (e, url) => {
    if (!url || url === '#' || url === '') {
      e.preventDefault();
      alert('Social link coming soon!');
    }
  };
  
  return (
    <div className="py-12 md:py-20 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 font-sans w-full overflow-hidden">
      <div className="w-full max-w-3xl mx-auto text-center mb-8 md:mb-16">
        <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-4 md:mb-6 leading-tight">
          Connect <span className="text-white">With Us</span>
        </h1>
        <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
          Join our community and stay updated with the latest news, releases, and exclusive content
        </p>
      </div>
      
      <div className="relative w-full max-w-2xl">
        {/* 3D Glowing Container */}
        <div 
          className={`rounded-[2rem] md:rounded-3xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-3xl overflow-hidden p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] md:hover:scale-105`}
          style={{
            boxShadow: '0 0 50px rgba(139, 92, 246, 0.3), 0 0 80px rgba(124, 58, 237, 0.2)'
          }}
        >
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <a 
              href={safeGetLink(safeData.instagram)} 
              onClick={(e) => handleLinkClick(e, safeData.instagram)}
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon instagram"
            >
              <div className="icon-container">
                <Instagram className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <span className="icon-label text-xs md:text-sm">Instagram</span>
            </a>
            
            <a 
              href={safeGetLink(safeData.youtube)} 
              onClick={(e) => handleLinkClick(e, safeData.youtube)}
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon youtube"
            >
              <div className="icon-container">
                 <Youtube className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <span className="icon-label text-xs md:text-sm">YouTube</span>
            </a>
            
            <a 
              href={safeGetLink(safeData.facebook)} 
              onClick={(e) => handleLinkClick(e, safeData.facebook)}
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon facebook"
            >
              <div className="icon-container">
                <Facebook className="w-6 h-6 md:w-8 md:h-8 text-white fill-transparent" />
              </div>
              <span className="icon-label text-xs md:text-sm">Facebook</span>
            </a>
            
            <a 
              href={safeData.whatsapp ? `https://wa.me/${safeData.whatsapp}` : '#'} 
              onClick={(e) => handleLinkClick(e, safeData.whatsapp)}
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon whatsapp"
            >
              <div className="icon-container">
                 <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <span className="icon-label text-xs md:text-sm">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .social-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        
        .icon-container {
          display: inline-flex;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          transition: all 0.3s ease;
          position: relative;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (min-width: 768px) {
          .icon-container {
            width: 80px;
            height: 80px;
          }
        }
        
        .social-icon:hover .icon-container {
          transform: translateY(-5px) scale(1.05);
        }
        
        @media (min-width: 768px) {
          .social-icon:hover .icon-container {
            transform: translateY(-10px) scale(1.1);
          }
        }
        
        .social-icon:hover .icon-label {
          opacity: 1;
          transform: translateY(2px);
        }

        @media (min-width: 768px) {
          .social-icon:hover .icon-label {
            transform: translateY(5px);
          }
        }
        
        .icon-label {
          margin-top: 8px;
          color: white;
          font-weight: 500;
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        @media (min-width: 768px) {
          .icon-label {
            margin-top: 12px;
          }
        }
        
        .social-icon.instagram:hover .icon-container {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
          box-shadow: 0 0 20px rgba(225, 48, 108, 0.6);
        }
        
        .social-icon.youtube:hover .icon-container {
          background: #FF0000;
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
        }
        
        .social-icon.facebook:hover .icon-container {
          background: #1877F2;
          box-shadow: 0 0 20px rgba(24, 119, 242, 0.6);
        }
        
        .social-icon.whatsapp:hover .icon-container {
          background: #25D366;
          box-shadow: 0 0 20px rgba(37, 211, 102, 0.6);
        }
        
        .social-icon:hover svg {
          animation: shake 0.5s;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          20% { transform: translateX(-5px) rotate(-5deg); }
          40% { transform: translateX(5px) rotate(5deg); }
          60% { transform: translateX(-5px) rotate(-5deg); }
          80% { transform: translateX(5px) rotate(5deg); }
        }
        
        .icon-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        
        .social-icon:hover .icon-container::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export { SocialConnect };
