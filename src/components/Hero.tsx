'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (      
    <section 
      id="hero" 
      className="h-screen w-full flex items-center justify-center relative bg-black overflow-hidden"      
      style={{
        backgroundImage: "url('/assets/bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-center"
      >        
      {/* Glass card */}
        <div className="backdrop-blur-md bg-black/20 border border-gray-500/30 rounded-xl shadow-lg p-12 max-w-md mx-auto">
          {/* Profile image */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-gray-600 to-gray-800 p-1">
              <div className="w-full h-full rounded-full bg-gray-700 overflow-hidden relative">
                {/* Actual profile image */}
                <Image
                  src="/assets/main_pp.jpg"
                  alt="Krex Profile"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="128px"
                />
                {/* Fallback gradient overlay for glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Krex
          </motion.h1>

          {/* Role */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-xl text-white/90 font-light"
          >
            Full Stack Developer
          </motion.p>

          {/* Animated typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="mt-6 text-white/70"
          >
            <div className="h-6 flex items-center justify-center">
              <span className="animate-pulse">
                💻 Website & Software Engineering
              </span>
            </div>
          </motion.div>
        </div>

        </motion.div>
      </section>
  );
}
