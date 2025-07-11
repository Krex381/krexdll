'use client';

import { motion } from 'framer-motion';

interface NavbarProps {
  currentSection: number;
  setCurrentSection: (index: number) => void;
  sections: { component: React.ReactNode; id: string }[];
}

export default function Navbar({ currentSection, setCurrentSection }: NavbarProps) {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
    { id: 'discord', label: 'Discord' }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      <div className="max-w-4xl mx-auto">        
        <div className="backdrop-blur-md bg-black/20 border border-white/30 rounded-xl shadow-lg px-6 py-3">
          <ul className="flex justify-center space-x-8">
            {navItems.map((item, index) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentSection(index)}                  
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                    currentSection === index
                      ? 'text-white bg-white/30 shadow-lg'
                      : 'text-white/90 hover:text-white hover:bg-white/20'
                  }`}
                >
                  {item.label}
                  {currentSection === index && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/30 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}
