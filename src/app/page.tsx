'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] flex flex-col items-center justify-center p-6">
      {/* Background Noise Effect */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-4xl">
        {/* Heading */}
        <motion.h1
          className="text-6xl font-bold text-white mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to{' '}
          <span className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-transparent bg-clip-text">
            Blink Workshop
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg text-[#CBD5E1] mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Blink Workshop is your go-to platform for creating, managing, and participating in interactive workshops. Whether you are an organizer or a participant, we provide the tools you need to make your workshop experience seamless and engaging. Create workshops, manage attendees, and track progress—all in one place.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex gap-6 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/create-workshop"
            className="bg-[#2563EB] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#1E40AF] transition-colors shadow-lg"
          >
            Create Workshop
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-[#1E40AF] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#CBD5E1] transition-colors shadow-lg"
          >
            Dashboard
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-8 text-[#CBD5E1] text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        © 2025 Blink Workshop. All rights reserved.
      </motion.footer>
    </div>
  )
}