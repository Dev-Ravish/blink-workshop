'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [text, setText] = useState('Initializing Blink Project')
  const [progress, setProgress] = useState(0)
  const [loadingMessages, setLoadingMessages] = useState<string[]>([])

  useEffect(() => {
    const textInterval = setInterval(() => {
      setText(prevText => prevText.length < 25 ? prevText + '.' : 'Initializing Blink Project')
    }, 500)

    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress < 100) {
          return prevProgress + 1
        } else {
          clearInterval(progressInterval)
          return 100
        }
      })
    }, 50) // Adjust the speed of the progress bar

    const messageInterval = setInterval(() => {
      setLoadingMessages(prevMessages => {
        const newMessage = getRandomLoadingMessage()
        return [...prevMessages, newMessage].slice(-5) // Keep only the last 5 messages
      })
    }, 600)

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [])

  const getRandomLoadingMessage = () => {
    const messages = [
      'Setting up workspace...',
      'Configuring application environment...',
      'Loading core modules...',
      'Compiling project assets...',
      'Establishing database connections...',
      'Optimizing performance...',
      'Initializing user interface...',
      'Deploying backend services...',
      'Securing application endpoints...',
      'Finalizing project setup...'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF]">
      <div className="text-[#2563EB] font-serif bg-[#1E293B] p-8 rounded-2xl shadow-2xl">
        <motion.div
          className="text-4xl mb-8 font-bold"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {text}
        </motion.div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-[#2563EB]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mb-8 text-xl">{progress}%</div>
        <div className="text-sm space-y-2">
          {loadingMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {message}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}