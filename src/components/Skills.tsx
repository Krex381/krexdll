'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const skills = [
  {
    category: "Frontend",
    items: [
      { name: "HTML5", level: 95, icon: "🌐" },
      { name: "CSS3", level: 90, icon: "🎨" },
      { name: "JavaScript", level: 85, icon: "⚡" },
      { name: "TypeScript", level: 80, icon: "📘" },
      { name: "React", level: 85, icon: "⚛️" },
      { name: "Next.js", level: 80, icon: "🔺" },
      { name: "Tailwind CSS", level: 90, icon: "💨" },
      { name: "Framer Motion", level: 75, icon: "✨" },
      { name: "Chakra UI", level: 70, icon: "🔧" },
      { name: "Shadcn UI", level: 75, icon: "🎯" }
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "PHP", level: 90, icon: "🐘" },
      { name: "C#", level: 85, icon: "🔷" },
      { name: "Golang", level: 80, icon: "🐹" },
      { name: "Ruby", level: 75, icon: "💎" },
      { name: "Python", level: 70, icon: "🐍" },
      { name: "Node.js", level: 80, icon: "💚" },
      { name: "Express.js", level: 85, icon: "🚀" }
    ]
  },
  {
    category: "Database & Tools",
    items: [
      { name: "MySQL", level: 90, icon: "🗄️" },
      { name: "PostgreSQL", level: 85, icon: "🐘" },
      { name: "MongoDB", level: 75, icon: "🍃" },
      { name: "Redis", level: 70, icon: "🔴" },
      { name: "Git", level: 95, icon: "📂" },
      { name: "Docker", level: 80, icon: "🐳" },
      { name: "AWS", level: 75, icon: "☁️" },
      { name: "Vercel", level: 90, icon: "▲" },
      { name: "VS Code", level: 98, icon: "💻" }
    ]
  },
  {
    category: "Mobile & Others",
    items: [
      { name: "React Native", level: 70, icon: "📱" },
      { name: "Flutter", level: 65, icon: "🦋" },
      { name: "Unity", level: 10, icon: "🎮" },
      { name: "Adobe XD", level: 20, icon: "📐" },
      { name: "Linux", level: 90, icon: "🐧" },
      { name: "Nginx", level: 70, icon: "🌐" },
      { name: "Apache", level: 75, icon: "🪶" }
    ]
  }
];

export default function Skills() {
  const [currentCategory, setCurrentCategory] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategory(prev => (prev + 1) % skills.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="min-h-screen flex items-start md:items-center justify-center relative bg-black py-20 md:py-0">
      {/* Background with dark glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-900/40 to-black/50" />
      
      <div className="container mx-auto px-6 z-10 w-full">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >            
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Capabilities
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full" />
          </motion.div>

          {/* Category Navigation */}          
          <div className="flex justify-center mb-12">
            <div className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-full p-2 shadow-lg">
              {skills.map((category, index) => (
                <button
                  key={category.category}
                  onClick={() => setCurrentCategory(index)}                  
                  className={`px-6 py-3 rounded-full transition-all duration-800 ${
                    currentCategory === index
                      ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Display */}
          <motion.div
            key={currentCategory}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {skills[currentCategory].items.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}                
                className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-6 shadow-lg hover:bg-black/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{skill.icon}</span>                    
                    <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                  </div>
                  <span className="text-gray-300 text-sm">{skill.level}%</span>
                </div>
                  {/* Progress Bar */}
                <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    className="h-full bg-gradient-to-r from-gray-500 to-gray-600 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-12 space-x-2">
            {skills.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCategory(index)}                
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentCategory === index
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 scale-125'
                    : 'bg-gray-700/50 hover:bg-gray-600/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}        className="absolute top-10 right-10 w-20 h-20 bg-gray-700/20 backdrop-blur-sm rounded-lg border border-gray-500/30"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          rotate: [0, -90, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-10 left-10 w-16 h-16 bg-gray-600/20 backdrop-blur-sm rounded-full border border-gray-500/30"
      />
    </section>
  );
}
