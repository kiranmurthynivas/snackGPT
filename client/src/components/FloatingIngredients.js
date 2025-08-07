import React from 'react';
import { motion } from 'framer-motion';

const FloatingIngredients = () => {
  const ingredients = [
    { emoji: '🍎', delay: 0, duration: 6 },
    { emoji: '🍌', delay: 1, duration: 8 },
    { emoji: '🥕', delay: 2, duration: 7 },
    { emoji: '🧀', delay: 3, duration: 9 },
    { emoji: '🥚', delay: 4, duration: 6 },
    { emoji: '🍞', delay: 5, duration: 8 },
    { emoji: '🥛', delay: 6, duration: 7 },
    { emoji: '🍅', delay: 7, duration: 9 },
    { emoji: '🥬', delay: 8, duration: 6 },
    { emoji: '🧈', delay: 9, duration: 8 },
    { emoji: '🥔', delay: 10, duration: 7 },
    { emoji: '🧅', delay: 11, duration: 9 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {ingredients.map((ingredient, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl md:text-3xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: ingredient.duration,
            repeat: Infinity,
            delay: ingredient.delay,
            ease: "easeInOut"
          }}
        >
          {ingredient.emoji}
        </motion.div>
      ))}
      
      {/* Additional decorative elements */}
      <motion.div
        className="absolute top-20 left-10 text-4xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        🍽️
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 right-10 text-4xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        👨‍🍳
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 left-5 text-3xl opacity-15"
        animate={{
          y: [0, -50, 0],
          x: [0, 20, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🥘
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 right-5 text-3xl opacity-15"
        animate={{
          y: [0, 50, 0],
          x: [0, -20, 0]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        🍳
      </motion.div>
    </div>
  );
};

export default FloatingIngredients;
