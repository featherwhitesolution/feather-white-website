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
  
  return (
    <div className="py-20 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 font-sans w-full">
      <div className="w-full max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-6 ">
          Connect <span className="text-white">With Us</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Join our community and stay updated with the latest news, releases, and exclusive content
        </p>
      </div>
      
      <div className="relative w-full max-w-2xl">
        {/* 3D Glowing Container */}
        <div 
          className={`rounded-3xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-3xl overflow-hidden p-8 transition-all duration-500 hover:scale-105`}
          style={{
            boxShadow:  '0 0 50px rgba(139, 92, 246, 0.6), 0 0 80px rgba(124, 58, 237, 0.4)'
          }}
        >
          <div className="flex flex-wrap justify-center gap-8">
            <a href={safeGetLink(safeData.instagram)} target="_blank" rel="noopener noreferrer" className="social-icon instagram">
              <div className="icon-container">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <span className="icon-label">Instagram</span>
            </a>
            
            <a href={safeGetLink(safeData.youtube)} target="_blank" rel="noopener noreferrer" className="social-icon youtube">
              <div className="icon-container">
                 <Youtube className="w-8 h-8 text-white" />
              </div>
              <span className="icon-label">YouTube</span>
            </a>
            
            <a href={safeGetLink(safeData.facebook)} target="_blank" rel="noopener noreferrer" className="social-icon facebook">
              <div className="icon-container">
                <Facebook className="w-8 h-8 text-white fill-transparent" />
              </div>
              <span className="icon-label">Facebook</span>
            </a>
            
            <a href={safeData.whatsapp ? `https://wa.me/${safeData.whatsapp}` : '#'} target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
              <div className="icon-container">
                 <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <span className="icon-label">WhatsApp</span>
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
          width: 80px;
          height: 80px;
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
        
        .social-icon:hover .icon-container {
          transform: translateY(-10px) scale(1.1);
        }
        
        .social-icon:hover .icon-label {
          opacity: 1;
          transform: translateY(5px);
        }
        
        .icon-label {
          margin-top: 12px;
          color: white;
          font-weight: 500;
          opacity: 0.7;
          transition: all 0.3s ease;
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
