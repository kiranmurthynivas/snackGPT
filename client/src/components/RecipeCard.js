import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, Heart, Clock, Users, Star } from 'lucide-react';
import CookingSteps from './CookingTimer';
import NutritionInfo from './NutritionInfo';

const RecipeCard = ({ recipe, onFavorite, onShare }) => {
  const [showTimer, setShowTimer] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [copied, setCopied] = useState(false);
  const [servings, setServings] = useState(1);

  const handleCopyRecipe = async () => {
    const recipeText = `
🍽️ ${recipe.dish_name}

📋 Ingredients:
${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}

👨‍🍳 Instructions:
${recipe.instructions}

✨ Description:
${recipe.style_description}

${recipe.eliza_enhanced ? '🤖 Enhanced by Eliza AI Agent' : ''}
    `;

    try {
      await navigator.clipboard.writeText(recipeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy recipe:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.dish_name,
          text: `Check out this amazing recipe: ${recipe.dish_name}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyRecipe();
    }
  };

  const getDifficultyLevel = () => {
    const stepCount = recipe.instructions.split(/\n|\./).filter(step => step.trim()).length;
    if (stepCount <= 3) return { level: 'Easy', color: 'text-green-600', bg: 'bg-green-100' };
    if (stepCount <= 6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Hard', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getEstimatedTime = () => {
    const stepCount = recipe.instructions.split(/\n|\./).filter(step => step.trim()).length;
    const baseTime = stepCount * 5; // 5 minutes per step
    if (baseTime <= 15) return '15 min';
    if (baseTime <= 30) return '30 min';
    if (baseTime <= 60) return '1 hour';
    return '1+ hours';
  };

  const difficulty = getDifficultyLevel();
  const estimatedTime = getEstimatedTime();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-white to-mint-50 border-2 border-mint-200 shadow-xl"
    >
      {/* Recipe Header */}
      <div className="relative">
        <motion.h2 
          className="text-3xl font-bold text-gray-800 mb-2 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {recipe.dish_name}
        </motion.h2>
        
        {/* Recipe Meta */}
        <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
          <div className={`px-3 py-1 rounded-full ${difficulty.bg} ${difficulty.color} font-medium`}>
            {difficulty.level}
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{servings} serving{servings > 1 ? 's' : ''}</span>
          </div>
          {recipe.eliza_enhanced && (
            <div className="flex items-center space-x-1 text-mint-600">
              <Star className="w-4 h-4 fill-current" />
              <span>AI Enhanced</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <motion.button
            onClick={() => setShowTimer(!showTimer)}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Clock className="w-4 h-4" />
            <span>Cooking Timer</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowNutrition(!showNutrition)}
            className="btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🍎 Nutrition</span>
          </motion.button>
        </div>
      </div>

      {/* Cooking Timer */}
      <AnimatePresence>
        {showTimer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <CookingSteps 
              instructions={recipe.instructions}
              onStepComplete={(step) => console.log(`Step ${step} completed!`)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nutrition Info */}
      <AnimatePresence>
        {showNutrition && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <NutritionInfo ingredients={recipe.ingredients} servings={servings} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Servings Adjuster */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Servings:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 rounded-full bg-mint-500 text-white hover:bg-mint-600 transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">{servings}</span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 rounded-full bg-mint-500 text-white hover:bg-mint-600 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Ingredients
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {recipe.ingredients.map((ingredient, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm"
            >
              <div className="w-2 h-2 bg-mint-500 rounded-full"></div>
              <span className="text-gray-700">{ingredient}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">👨‍🍳</span>
          Instructions
        </h3>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {recipe.instructions}
          </div>
        </div>
      </div>

      {/* Style Description */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">✨</span>
          Description
        </h3>
        <div className="bg-gradient-to-r from-mint-50 to-pink-50 rounded-lg p-4 border border-mint-200">
          <p className="text-gray-700 italic">{recipe.style_description}</p>
        </div>
      </div>

      {/* Context Analysis (if available) */}
      {recipe.context_analysis && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">🤖</span>
            AI Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Mood</div>
              <div className="text-blue-800">{recipe.context_analysis.mood_adapted}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">Weather</div>
              <div className="text-green-800">{recipe.context_analysis.weather_considered}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Style</div>
              <div className="text-purple-800">{recipe.context_analysis.style_applied}</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-200">
        <motion.button
          onClick={handleCopyRecipe}
          className="btn-secondary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? 'Copied!' : 'Copy Recipe'}</span>
        </motion.button>

        <motion.button
          onClick={handleShare}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </motion.button>

        {onFavorite && (
          <motion.button
            onClick={() => onFavorite(recipe)}
            className={`p-3 rounded-full transition-colors ${
              recipe.favorite 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-5 h-5 ${recipe.favorite ? 'fill-current' : ''}`} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default RecipeCard;
