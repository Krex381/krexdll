'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getVersion } from '@/utils/version';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Discord from '@/components/Discord';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  const sections = [
    { component: <Hero />, id: 'hero', name: 'Home' },
    { component: <About />, id: 'about', name: 'About' },
    { component: <Skills />, id: 'skills', name: 'Skills' },
    { component: <Education />, id: 'education', name: 'Education' },
    { component: <Discord />, id: 'discord', name: 'Discord' },
    { component: <Contact />, id: 'contact', name: 'Contact' }
  ];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
  };

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0] || e.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
      isTouching = true;
    };    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;
      
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      
      const target = e.target as Element;
      const scrollableParent = target.closest('[style*="overflow-y: auto"], [class*="overflow-y-auto"]');
      
      if (deltaY > deltaX && scrollableParent) {
        return;
      }
      
      if (deltaX > deltaY && deltaX > 30) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTouching) return;
      const touch = e.changedTouches[0];
      touchEndX = touch.clientX;
      touchEndY = touch.clientY;
      isTouching = false;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 80;
      const maxVerticalDistance = 120;
      const timeThreshold = 1000;
      const swipeTime = Date.now() - touchStartTime;
      const deltaX = touchStartX - touchEndX;
      const deltaY = Math.abs(touchStartY - touchEndY);
      
      if (
        Math.abs(deltaX) > swipeThreshold &&
        deltaY < maxVerticalDistance &&
        swipeTime < timeThreshold &&
        Math.abs(deltaX) > deltaY * 1.5
      ) {
        
        if (deltaX > 0 && currentSection < sections.length - 1) {
          
          paginate(1);
          setCurrentSection(prev => prev + 1);
          setShowMobileNav(false);
        } else if (deltaX < 0 && currentSection > 0) {
          
          paginate(-1);
          setCurrentSection(prev => prev - 1);
          setShowMobileNav(false);
        }
      }
    };

    const addTouchListeners = () => {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    };
    const removeTouchListeners = () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    if (isMobile || isTablet) {
      addTouchListeners();
    }
    return removeTouchListeners;
  }, [currentSection, sections.length, isMobile, isTablet]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentSection < sections.length - 1) {
          paginate(1);
          setCurrentSection(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentSection > 0) {
          paginate(-1);
          setCurrentSection(prev => prev - 1);
        }
      } else if (e.key === 'Escape') {
        setShowMobileNav(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, sections.length]);

  
  const sectionVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isMobile ? 300 : 1200) : (isMobile ? -300 : -1200),
      y: direction > 0 ? (isMobile ? 100 : 200) : (isMobile ? -100 : -200),
      scale: isMobile ? 0.9 : 0.8,
      rotateY: isMobile ? 0 : (direction > 0 ? 15 : -15),
      opacity: 0,
      filter: isMobile ? "blur(5px)" : "blur(10px)",
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: isMobile ? 0.5 : 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        x: { type: "spring", stiffness: isMobile ? 400 : 250, damping: isMobile ? 35 : 25 },
        y: { type: "spring", stiffness: isMobile ? 400 : 250, damping: isMobile ? 35 : 25 },
        scale: { type: "spring", stiffness: 300, damping: 30 },
        rotateY: { duration: isMobile ? 0.3 : 0.6 },
        opacity: { duration: isMobile ? 0.2 : 0.4 },
        filter: { duration: isMobile ? 0.2 : 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? (isMobile ? 300 : 1200) : (isMobile ? -300 : -1200),
      y: direction < 0 ? (isMobile ? -100 : -200) : (isMobile ? 100 : 200),
      scale: 0.9,
      rotateY: isMobile ? 0 : (direction < 0 ? -15 : 15),
      opacity: 0,
      filter: isMobile ? "blur(3px)" : "blur(8px)",
      transition: {
        duration: isMobile ? 0.3 : 0.4,
        ease: [0.55, 0.085, 0.68, 0.53],
        x: { type: "spring", stiffness: 400, damping: 30 },
        y: { type: "spring", stiffness: 400, damping: 30 },
        scale: { duration: 0.3 },
        rotateY: { duration: isMobile ? 0.2 : 0.4 },
        opacity: { duration: 0.2 },
        filter: { duration: 0.1 }
      }
    })
  };
  
  return (
    <main className="h-screen bg-black">
      {/* SEO Hidden H1 and Developer Summary for AI Crawlers */}
      <div className="sr-only">
        <h1>Krex38 - Professional Web Developer Portfolio | React Next.js TypeScript Developer</h1>
        <div>
          <h2>About Krex38 - Professional Web Developer</h2>
          <p>
            Krex38 is a highly skilled and experienced professional web developer and software engineer 
            specializing in modern web technologies and frameworks. With deep expertise in React, Next.js, 
            TypeScript, and JavaScript, Krex38 creates innovative, responsive, and user-friendly web applications.
          </p>
          <h3>Technical Expertise</h3>
          <p>
            Krex38 possesses advanced skills in frontend development, full-stack application development, 
            component-based architecture, and modern web frameworks. Experienced in building scalable web 
            applications, implementing responsive design principles, optimizing web performance, and creating 
            intuitive user interfaces.
          </p>
          <h3>Professional Experience</h3>
          <p>
            As the creator of krex.dll portfolio, Krex38 demonstrates proficiency in modern web development 
            practices, including state management, API integration, animation libraries (Framer Motion), 
            and advanced CSS techniques. Known for clean code, efficient development practices, and 
            attention to detail in both functionality and design.
          </p>
          <h3>Services and Capabilities</h3>
          <p>
            Krex38 offers professional web development services including custom web application development, 
            frontend development, full-stack solutions, responsive design implementation, performance optimization, 
            and modern web framework consulting. Available for freelance projects and development collaborations.
          </p>
        </div>
      </div>
      
      {/* Desktop Navigation Bar */}
      {!isMobile && !isTablet && (
        <motion.nav
          initial={{ y: -100, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-0 left-0 right-0 z-50 p-4"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="backdrop-blur-xl bg-black/30 border border-gray-500/30 rounded-2xl shadow-2xl px-8 py-4"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.4)" }}
              transition={{ duration: 0.3 }}
            >
              <ul className="flex justify-center space-x-8">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <motion.button
                    onClick={() => {
                      const newDirection = index > currentSection ? 1 : -1;
                      paginate(newDirection);
                      setCurrentSection(index);
                    }}
                    className={`relative px-6 py-3 text-sm font-medium transition-all duration-500 rounded-xl overflow-hidden ${
                      currentSection === index
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {section.name}
                    {currentSection === index && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-gray-600/40 to-gray-700/40 rounded-xl border border-gray-400/30"
                        initial={false}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 30,
                          duration: 0.6
                        }}
                      />
                    )}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      whileHover={{
                        background: "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.nav>
      )}

      {/* Desktop Version Badge */}
      {!isMobile && !isTablet && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="fixed top-4 right-4 z-40"
        >
          <div className="backdrop-blur-xl bg-black/20 border border-gray-500/20 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>v{getVersion()}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tablet Navigation */}
      {isTablet && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed top-0 left-0 right-0 z-50 p-3"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div className="backdrop-blur-xl bg-black/30 border border-gray-500/30 rounded-2xl shadow-2xl px-6 py-3">
              <ul className="flex justify-center space-x-4">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <motion.button
                      onClick={() => {
                        const newDirection = index > currentSection ? 1 : -1;
                        paginate(newDirection);
                        setCurrentSection(index);
                      }}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                        currentSection === index
                          ? 'text-white bg-gray-700/50'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {section.name}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.nav>
      )}      
      {/* Mobile Navigation Toggle */}
      {isMobile && (
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMobileNav(!showMobileNav);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMobileNav(!showMobileNav);
          }}
          className="fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-xl bg-black/60 border border-gray-500/30 text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            animate={{ rotate: showMobileNav ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg"
          >
            {showMobileNav ? '✕' : '☰'}
          </motion.div>
        </motion.button>
      )}

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobile && showMobileNav && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileNav(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[80vw] z-50 backdrop-blur-xl bg-black/90 border-l border-gray-500/30"
            >
              <div className="flex flex-col h-full p-6 pt-20">
                {/* Close button */}
                <motion.button
                  onClick={() => setShowMobileNav(false)}
                  onTouchEnd={() => setShowMobileNav(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-700/50 text-white hover:bg-gray-600/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.button>
                
                <h3 className="text-white text-lg font-semibold mb-2">Menu</h3>
                <div className="text-xs text-gray-400 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Development v{getVersion()}</span>
                </div>
                {sections.map((section, index) => (                
                  <motion.button
                  key={section.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newDirection = index > currentSection ? 1 : -1;
                    paginate(newDirection);
                    setCurrentSection(index);
                    setShowMobileNav(false);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newDirection = index > currentSection ? 1 : -1;
                    paginate(newDirection);
                    setCurrentSection(index);
                    setShowMobileNav(false);
                  }}
                  className={`text-left p-4 mb-2 rounded-xl transition-all duration-300 ${
                    currentSection === index
                      ? 'bg-gray-700/50 text-white border border-gray-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                  }`}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {section.name}
                </motion.button>
                ))}
                
                {/* Mobile Footer in Navigation */}
                <div className="mt-auto pt-6 border-t border-gray-700/50">
                  <div className="text-center space-y-2">
                    <div className="text-xs text-gray-500">
                      © 2025 Krex38 - All rights reserved.
                    </div>
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-gray-500 text-xs">Want to skid this?</span>
                      <motion.a
                        href="https://github.com/Krex381/krexdll"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white text-xs underline transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="View source code on GitHub"
                      >
                        GitHub
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Section Dots Indicator - Hidden on mobile */}
      {!isMobile && (
        <motion.div 
          className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          {sections.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                const newDirection = index > currentSection ? 1 : -1;
                paginate(newDirection);
                setCurrentSection(index);
              }}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                currentSection === index
                  ? 'bg-white border-white'
                  : 'bg-transparent border-gray-400 hover:border-white'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      )}      
      {/* Section Container */}
      <div className="h-screen relative perspective-1000 bg-black">
        <div className="absolute inset-0 bg-black z-0" />
        
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSection}
            custom={direction}
            variants={sectionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full transform-gpu z-10"
            style={{ 
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden"
            }}
          >
            <div className="h-full w-full">
              {sections[currentSection].component}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Particle overlay */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            key={currentSection}
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)`,
            }}
          />
        )}
      </div>      

      {/* Mobile Swipe Hint */}
      {isMobile && currentSection === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 2 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 text-gray-400 text-sm text-center"
        >
          <motion.div
            animate={{ x: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="space-y-1"
          >
            <div>Swipe left/right</div>
            <div className="text-xs opacity-75">← →</div>
            <div className="text-xs opacity-50">Swipe up/down to read the content</div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Footer - Hidden on Mobile */}
      {!isMobile && (
        <motion.footer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-30"
          role="contentinfo"
          aria-label="Site footer"
        >
          <div className="backdrop-blur-xl bg-black/30 border border-gray-500/30 rounded-xl px-4 py-2 text-center">
            <div className="text-xs text-gray-500 mt-1">
              © 2025 Krex38 - All rights reserved.
            </div>
            <div className="flex justify-center items-center space-x-2 mt-1">
              <span className="text-gray-500 text-xs">Want to skid this?</span>
              <motion.a
                href="https://github.com/Krex381/krexdll"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-xs underline transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View source code on GitHub"
              >
                Check out on GitHub
              </motion.a>
            </div>
          </div>
        </motion.footer>
      )}
    </main>
  );
}
