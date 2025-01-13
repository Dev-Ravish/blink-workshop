'use client'

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1;
        } else {
          clearInterval(progressInterval);
          return 100;
        }
      });
    }, 30); // Adjust the speed of the progress bar

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] relative overflow-hidden">
      {/* Subtle animated dots */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 50 }).map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-white/20 rounded-full absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Progress Bar Container */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-lg p-8 w-full max-w-md">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-[#2563EB]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="text-white text-center font-mono">
          Loading... {progress}%
        </div>
      </div>
    </div>
  );
}