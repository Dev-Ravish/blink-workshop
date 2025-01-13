'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] relative overflow-hidden">
        {/* Background Noise Effect */}
        <div
            className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"
            style={{ mixBlendMode: 'overlay' }}
        />

        {/* Content Container */}
        <div className="relative  text-center max-w-2xl w-full px-4">
            {/* Animated "Still in Development" Text */}
            <motion.h1
            className="text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            >
            Still in Development
            </motion.h1>

            {/* Subtle Glowing Effect */}
            <motion.div
            className="absolute inset-0 bg-white/10 rounded-full blur-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            />

            {/* Animated Dots */}
            <motion.div
            className="flex justify-center space-x-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            >
            {[1, 2, 3].map((dot) => (
                <motion.div
                key={dot}
                className="w-3 h-3 bg-white rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: dot * 0.3,
                }}
                />
            ))}
            </motion.div>

            {/* Back to Home Link */}
            
        </div>
        <div>
        <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            >
            <Link
                href="/" // Ensure this points to your home route
                className="text-white/80 hover:text-white transition-colors text-lg"
            >
                Go back to Home
            </Link>
            </motion.div>
        </div>
        </div>
    );
}