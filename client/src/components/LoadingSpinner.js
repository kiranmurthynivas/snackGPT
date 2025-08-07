import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Utensils } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Main Spinner */}
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 border-4 border-mint-200 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute inset-2 border-4 border-pink-200 rounded-full"
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Center Icon */}
        <motion.div
          className="absolute inset-4 bg-gradient-to-r from-mint-400 to-pink-400 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <ChefHat className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>

      {/* Floating Utensils */}
      <div className="relative mt-8">
        <motion.div
          className="absolute -left-8 top-0"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Utensils className="w-6 h-6 text-mint-400" />
        </motion.div>
        
        <motion.div
          className="absolute -right-8 top-0"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Utensils className="w-6 h-6 text-pink-400" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h3
          className="text-xl font-semibold text-gray-700 mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Cooking up your recipe...
        </motion.h3>
        
        <motion.p
          className="text-gray-500"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Our AI chef is working hard to create something amazing!
        </motion.p>
      </motion.div>

      {/* Progress Dots */}
      <div className="flex space-x-2 mt-6">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-mint-400 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
