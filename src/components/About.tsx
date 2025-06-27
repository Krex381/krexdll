'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <section 
      id="about"
      className="min-h-screen flex items-start md:items-center justify-center relative bg-black py-20 md:py-0"
    >
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
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full" />
          </motion.div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="w-80 h-80 mx-auto relative">                
                {/* Glassmorphism frame */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-full shadow-lg" />
                <div className="absolute inset-4 bg-gradient-to-br from-gray-800/20 to-gray-900/40 rounded-full" />
                
                {/* Actual profile image */}
                <div className="absolute inset-8 rounded-full overflow-hidden">
                  <Image
                    src="/assets/aboutme_pp.png"
                    alt="Profile Image"
                    fill
                    className="object-cover object-center"
                    sizes="256px"
                    priority
                  />
                  {/* Glassmorphism overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/30 rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* About Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >              
              <div className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-8 shadow-lg hover:bg-black/30 transition-all duration-300">                
                <h3 className="text-2xl font-semibold text-white mb-4">Who Am I?</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  I&apos;ll keep it short. I&apos;m 16 and I love my girlfriend.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                    <h4 className="text-gray-400 font-semibold mb-2">Experience</h4>
                    <p className="text-gray-300">4+ Years</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                    <h4 className="text-gray-400 font-semibold mb-2">Projects</h4>
                    <p className="text-gray-300">20+ Completed</p>
                  </div>
                </div>
              </div>                
              {/* Skills Preview */}
              <div className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-6 shadow-lg hover:bg-black/30 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4">Core Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'JavaScript', 'Ruby', 'Golang'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="px-3 py-1 bg-gray-800/50 text-white text-sm rounded-full border border-gray-600/30"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
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