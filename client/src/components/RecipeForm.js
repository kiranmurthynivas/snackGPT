import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Heart, Zap, Coffee, Frown, Smile, Sun, Cloud, CloudRain, CloudSnow, Wind, Send } from 'lucide-react';
import axios from 'axios';

const RecipeForm = ({ onRecipeGenerated, onError, setLoading }) => {
  const [ingredients, setIngredients] = useState('');
  const [mood, setMood] = useState('happy');
  const [weather, setWeather] = useState('sunny');
  const [style, setStyle] = useState('five_year_old');

  const moods = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-500' },
    { value: 'tired', label: 'Tired', icon: Coffee, color: 'text-blue-500' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'text-gray-500' },
    { value: 'excited', label: 'Excited', icon: Zap, color: 'text-orange-500' },
    { value: 'stressed', label: 'Stressed', icon: Heart, color: 'text-red-500' }
  ];

  const weathers = [
    { value: 'sunny', label: 'Sunny', icon: Sun, color: 'text-yellow-500' },
    { value: 'rainy', label: 'Rainy', icon: CloudRain, color: 'text-blue-500' },
    { value: 'cloudy', label: 'Cloudy', icon: Cloud, color: 'text-gray-500' },
    { value: 'snowy', label: 'Snowy', icon: CloudSnow, color: 'text-blue-300' },
    { value: 'windy', label: 'Windy', icon: Wind, color: 'text-gray-400' }
  ];

  const styles = [
    { value: 'shakespeare', label: 'Shakespeare', description: 'Elizabethan English' },
    { value: 'gordon_ramsay', label: 'Gordon Ramsay', description: 'Passionate & Direct' },
    { value: 'five_year_old', label: '5-Year-Old', description: 'Excited & Simple' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ingredients.trim()) {
      onError('Please enter at least one ingredient');
      return;
    }

    const ingredientList = ingredients
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (ingredientList.length === 0) {
      onError('Please enter at least one ingredient');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/mcp', {
        jsonrpc: '2.0',
        id: 1,
        method: '$/invoke',
        params: {
          name: 'suggest_dish',
          arguments: {
            ingredients: ingredientList,
            mood,
            weather,
            style
          }
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error.message || 'Failed to generate recipe');
      }

      onRecipeGenerated(response.data.result);
    } catch (error) {
      console.error('Recipe generation error:', error);
      onError(error.response?.data?.error?.message || error.message || 'Failed to generate recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ingredients Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🥘 What ingredients do you have?
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., banana, pasta, eggs, cheese..."
            className="input-field h-24 resize-none"
            required
          />
        </div>

        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            😊 How are you feeling today?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {moods.map((moodOption) => {
              const Icon = moodOption.icon;
              return (
                <motion.button
                  key={moodOption.value}
                  type="button"
                  onClick={() => setMood(moodOption.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                    mood === moodOption.value
                      ? 'border-mint-500 bg-mint-50 text-mint-700'
                      : 'border-gray-200 bg-white hover:border-mint-300 hover:bg-mint-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={`w-6 h-6 ${moodOption.color}`} />
                  <span className="text-xs font-medium">{moodOption.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Weather Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🌤️ What's the weather like?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {weathers.map((weatherOption) => {
              const Icon = weatherOption.icon;
              return (
                <motion.button
                  key={weatherOption.value}
                  type="button"
                  onClick={() => setWeather(weatherOption.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                    weather === weatherOption.value
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={`w-6 h-6 ${weatherOption.color}`} />
                  <span className="text-xs font-medium">{weatherOption.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🎭 Choose your cooking style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {styles.map((styleOption) => (
              <motion.button
                key={styleOption.value}
                type="button"
                onClick={() => setStyle(styleOption.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  style === styleOption.value
                    ? 'border-lemon-500 bg-lemon-50 text-lemon-700'
                    : 'border-gray-200 bg-white hover:border-lemon-300 hover:bg-lemon-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-semibold">{styleOption.label}</div>
                <div className="text-sm opacity-75">{styleOption.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="btn-primary w-full flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChefHat className="w-5 h-5" />
          <span>Generate Recipe</span>
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default RecipeForm;
