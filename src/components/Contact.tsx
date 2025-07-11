'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  const contactMethods = [
    {
      platform: 'Discord',
      handle: 'krex_dll',
      link: 'https://discord.com/users/644313519147319297',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
      color: 'from-indigo-500 to-blue-600',
      bgGlow: 'shadow-indigo-500/20',
      description: 'Gaming and chat'
    },
    {
      platform: 'Instagram',
      handle: '@werzy381',
      link: 'https://instagram.com/werzy381',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.771 1.691 4.919 4.919c.058 1.265.069 1.645.069 4.849c0 3.205-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919c-1.266.058-1.644.07-4.85.07c-3.204 0-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92c-.058-1.265-.07-1.644-.07-4.849c0-3.204.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919c1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072c-4.358.2-6.78 2.618-6.98 6.98c-.059 1.281-.073 1.689-.073 4.948c0 3.259.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98c1.281.058 1.689.072 4.948.072c3.259 0 3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98c.059-1.28.073-1.689.073-4.948c0-3.259-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98c-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162c0 3.403 2.759 6.163 6.162 6.163c3.403 0 6.162-2.76 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'from-pink-500 to-purple-600',
      bgGlow: 'shadow-pink-500/20',
      description: 'Projects and daily posts'
    },
    {
      platform: 'E-mail',
      handle: 'krexdll@proton.me',
      link: 'mailto:krexdll@proton.me',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.16 1.04-.8 1.52-1.44 1.84-.64.32-1.84.68-2.16 1.04-.32.36-.8 1.04-.8 1.04s-.48-.68-.8-1.04c-.32-.36-1.52-.72-2.16-1.04-.64-.32-1.28-.8-1.44-1.84-.16-1.04.16-2.56.16-2.56s1.6-.8 4.24-.8 4.24.8 4.24.8.32 1.52.16 2.56zm-4.64 7.2c-2.72 0-4.8-1.84-5.04-4.32-.08-.8.16-1.6.72-2.24.56-.64 1.36-1.04 2.24-1.04h4.16c.88 0 1.68.4 2.24 1.04.56.64.8 1.44.72 2.24-.24 2.48-2.32 4.32-5.04 4.32z"/>
        </svg>
      ),
      color: 'from-purple-500 to-indigo-600',
      bgGlow: 'shadow-purple-500/20',
      description: 'Business offers and official matters'
    }
  ];
  const openLink = (link: string) => {
    window.open(link, '_blank');
  };
  return (    
  <section 
      id="contact" 
      ref={ref}
      className="min-h-screen flex items-start justify-center relative bg-black overflow-y-auto"
      style={{ maxHeight: '100vh' }}
    >

      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-900/40 to-black/50" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container mx-auto px-6 z-10 w-full py-8 pb-32 md:pb-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-8 md:mb-16 mt-16 md:mt-27">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Contact</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full" />
          </motion.div>        

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method) => (
            <motion.div 
              key={method.platform}
              variants={itemVariants}
              className="group relative"
            >
              <div 
                className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-8 shadow-lg hover:bg-black/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2"
                onClick={() => openLink(method.link)}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${method.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                <div className="text-center relative z-10">

                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center text-white group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                      {method.icon}
                    </div>

                    <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${method.color} opacity-30 group-hover:scale-125 group-hover:opacity-50 transition-all duration-500`}></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {method.platform}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors duration-300">
                    {method.description}
                  </p>
                  
                  <div className="bg-black/50 rounded-lg p-3 border border-gray-600/30 group-hover:border-gray-500/50 transition-all duration-300">
                    <p className="text-gray-300 font-mono text-sm break-all group-hover:text-white transition-colors duration-300">
                      {method.handle}
                    </p>
                  </div>
                  
                  <div className={`mt-4 px-4 py-2 rounded-full bg-gradient-to-r ${method.color} text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                    Contact
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>        

        <motion.div variants={itemVariants}>          
          <div className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-8 shadow-lg text-center relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                🤝 Let&apos;s Create Amazing Things Together!
              </h3>              
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-lg leading-relaxed">
                If you want to develop innovative projects, grow together in the tech world, or just chat, 
                you can reach me through the platforms above! 🚀
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-base flex items-center gap-2"
                  onClick={() => openLink('mailto:krexdll@proton.me')}
                >
                  ✉️ Send Email
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all duration-300 text-base flex items-center gap-2"
                  onClick={() => openLink('https://instagram.com/werzy381')}                
                  >
                  📸 DM on Instagram
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>        
        </div>
      </motion.div>
    </section>
  );
}
