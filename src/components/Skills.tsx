'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { 
  FaHtml5, 
  FaCss3Alt, 
  FaJs, 
  FaReact, 
  FaGitAlt,
  FaDocker,
  FaPython,
  FaNodeJs,
  FaPhp,
  FaLinux,
  FaAws,
  FaServer,
  FaDatabase,
  FaCode,
  FaFigma
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiMongodb, 
  SiExpress, 
  SiPostgresql, 
  SiMysql,
  SiVercel,
  SiGo,
  SiRuby,
  SiFramer,
  SiChakraui
} from 'react-icons/si';

const skills = [
  {
    category: "Frontend",
    items: [
      { name: "HTML5", level: 95, icon: <FaHtml5 className="w-6 h-6" />, color: "text-orange-500" },
      { name: "CSS3", level: 90, icon: <FaCss3Alt className="w-6 h-6" />, color: "text-blue-500" },
      { name: "JavaScript", level: 85, icon: <FaJs className="w-6 h-6" />, color: "text-yellow-400" },
      { name: "TypeScript", level: 80, icon: <SiTypescript className="w-6 h-6" />, color: "text-blue-600" },
      { name: "React", level: 85, icon: <FaReact className="w-6 h-6" />, color: "text-cyan-400" },
      { name: "Next.js", level: 80, icon: <SiNextdotjs className="w-6 h-6" />, color: "text-white" },
      { name: "Tailwind CSS", level: 90, icon: <SiTailwindcss className="w-6 h-6" />, color: "text-cyan-500" },
      { name: "Framer Motion", level: 75, icon: <SiFramer className="w-6 h-6" />, color: "text-purple-400" },
      { name: "Chakra UI", level: 70, icon: <SiChakraui className="w-6 h-6" />, color: "text-green-400" },
      { name: "Shadcn UI", level: 75, icon: <FaCode className="w-6 h-6" />, color: "text-gray-400" }
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "PHP", level: 90, icon: <FaPhp className="w-6 h-6" />, color: "text-purple-500" },
      { name: "C#", level: 85, icon: <FaCode className="w-6 h-6" />, color: "text-purple-600" },
      { name: "Golang", level: 80, icon: <SiGo className="w-6 h-6" />, color: "text-blue-500" },
      { name: "Ruby", level: 75, icon: <SiRuby className="w-6 h-6" />, color: "text-red-500" },
      { name: "Python", level: 70, icon: <FaPython className="w-6 h-6" />, color: "text-blue-500" },
      { name: "Node.js", level: 80, icon: <FaNodeJs className="w-6 h-6" />, color: "text-green-500" },
      { name: "Express.js", level: 85, icon: <SiExpress className="w-6 h-6" />, color: "text-gray-300" }
    ]
  },
  {
    category: "Database & Tools",
    items: [
      { name: "MySQL", level: 90, icon: <SiMysql className="w-6 h-6" />, color: "text-blue-600" },
      { name: "PostgreSQL", level: 85, icon: <SiPostgresql className="w-6 h-6" />, color: "text-blue-700" },
      { name: "MongoDB", level: 75, icon: <SiMongodb className="w-6 h-6" />, color: "text-green-500" },
      { name: "Redis", level: 70, icon: <FaDatabase className="w-6 h-6" />, color: "text-red-600" },
      { name: "Git", level: 95, icon: <FaGitAlt className="w-6 h-6" />, color: "text-orange-500" },
      { name: "Docker", level: 80, icon: <FaDocker className="w-6 h-6" />, color: "text-blue-500" },
      { name: "AWS", level: 75, icon: <FaAws className="w-6 h-6" />, color: "text-orange-500" },
      { name: "Vercel", level: 90, icon: <SiVercel className="w-6 h-6" />, color: "text-white" },
      { name: "VS Code", level: 98, icon: <FaCode className="w-6 h-6" />, color: "text-blue-400" }
    ]
  },
  {
    category: "Mobile & Others",
    items: [
      { name: "React Native", level: 70, icon: <FaReact className="w-6 h-6" />, color: "text-cyan-400" },
      { name: "Flutter", level: 65, icon: <FaCode className="w-6 h-6" />, color: "text-blue-400" },
      { name: "Unity", level: 10, icon: <FaCode className="w-6 h-6" />, color: "text-gray-600" },
      { name: "Adobe XD", level: 20, icon: <FaFigma className="w-6 h-6" />, color: "text-pink-500" },
      { name: "Linux", level: 90, icon: <FaLinux className="w-6 h-6" />, color: "text-yellow-600" },
      { name: "Nginx", level: 70, icon: <FaServer className="w-6 h-6" />, color: "text-green-500" },
      { name: "Apache", level: 75, icon: <FaServer className="w-6 h-6" />, color: "text-red-600" }
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
    <section className="h-screen flex items-center justify-center relative bg-black overflow-hidden">
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
                    <span className={`${skill.color} opacity-80 hover:opacity-100 transition-opacity`}>
                      {skill.icon}
                    </span>                    
                    <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                  </div>
                  <span className="text-gray-300 text-sm">
                    <CountUp
                      start={0}
                      end={skill.level}
                      duration={2.5}
                      delay={index * 0.1}
                      suffix="%"
                    />
                  </span>
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
        }}
        className="absolute top-10 right-10 w-20 h-20 bg-gray-700/20 backdrop-blur-sm rounded-lg border border-gray-500/30"
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