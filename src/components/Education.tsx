'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const educationData = [
  {
    degree: "Information Technology",
    school: "HTL Spengergasse Wien",
    period: "2023 - still studying",
    description: "Databases, Backend & Frontend Development.",
    courses: ["React, Next.js", "PHP, Javascript", "MySQL"],
    icon: "🎓"
  },
  {
    degree: "Self-Taught Developer",
    school: "No School",
    period: "2019",
    description: "Started learning programming on my own.",
    courses: ["HTML, CSS", "JavaScript", "Python", "C#"],
    icon: "💻"
  }
];
export default function Education() {
  const [currentEducation, setCurrentEducation] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEducation(prev => (prev + 1) % educationData.length);
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
              Education
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full" />
          </motion.div>

          {/* Education Timeline */}
          <div className="relative">            
            {/* Center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full" />

            <motion.div
              key={currentEducation}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Education Card */}
              <div className={`${currentEducation % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <motion.div
                  initial={{ opacity: 0, x: currentEducation % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}                  
                  className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-8 shadow-lg hover:bg-black/30 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{educationData[currentEducation].icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {educationData[currentEducation].degree}
                      </h3>
                      <p className="text-gray-300 font-semibold">
                        {educationData[currentEducation].school}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {educationData[currentEducation].period}
                      </p>
                    </div>
                  </div>                  
                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {educationData[currentEducation].description}
                  </p>                
                  {/* Courses */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Core Subjects/Topics:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {educationData[currentEducation].courses.map((course, index) => (
                        <motion.div
                          key={course}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-200 text-sm py-2 px-3 rounded-lg border border-gray-600/30"
                        >
                          {course}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Visual Element */}
              <div className={`${currentEducation % 2 === 0 ? 'md:order-2' : 'md:order-1'} flex justify-center`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >                  
                {/* Main circle */}
                  <div className="w-80 h-80 bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-full shadow-2xl flex items-center justify-center">
                    <div className="text-8xl">{educationData[currentEducation].icon}</div>
                  </div>
                  
                  {/* Floating elements around */}
                  {educationData[currentEducation].courses.slice(0, 4).map((_, index) => (
                    <motion.div
                      key={index}
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 6 + index,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className={`absolute w-12 h-12 bg-gradient-to-r from-gray-700/30 to-gray-800/30 backdrop-blur-sm rounded-full border border-gray-500/30 ${
                        index === 0 ? '-top-6 left-1/2 transform -translate-x-1/2' :
                        index === 1 ? 'top-1/2 -right-6 transform -translate-y-1/2' :
                        index === 2 ? '-bottom-6 left-1/2 transform -translate-x-1/2' :
                        'top-1/2 -left-6 transform -translate-y-1/2'
                      }`}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>            
            {/* Timeline dot */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full border-4 border-gray-600/30 shadow-lg" />
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-12 space-x-2">
            {educationData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentEducation(index)}                
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentEducation === index
                    ? 'bg-gradient-to-r from-gray-500 to-gray-700 scale-125'
                    : 'bg-gray-700/50 hover:bg-gray-600/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating background elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}        
        className="absolute top-20 left-20 w-20 h-20 bg-gray-700/20 backdrop-blur-sm rounded-xl border border-gray-500/30"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
          rotate: [0, -45, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-20 w-16 h-16 bg-gray-600/20 backdrop-blur-sm rounded-full border border-gray-500/30"
      />
    </section>
  );
}
