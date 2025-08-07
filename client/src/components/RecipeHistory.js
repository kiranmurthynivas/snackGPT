import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Heart, Trash2, BookOpen } from 'lucide-react';

const RecipeHistory = ({ recipes, onLoadRecipe, onDeleteRecipe, onToggleFavorite }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, favorites, recent

  const filteredRecipes = recipes.filter(recipe => {
    switch (filter) {
      case 'favorites':
        return recipe.favorite;
      case 'recent':
        return new Date(recipe.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-mint-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <BookOpen className="w-6 h-6" />
      </motion.button>

      {/* History Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-80 max-h-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-mint-500 to-pink-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Recipe History</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
              
              {/* Filters */}
              <div className="flex space-x-2 mt-3">
                {['all', 'recent', 'favorites'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === f 
                        ? 'bg-white text-mint-600' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredRecipes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recipes yet</p>
                  <p className="text-sm">Generate your first recipe!</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onLoadRecipe(recipe)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {recipe.dish_name}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(recipe.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-mint-100 text-mint-700 text-xs rounded-full"
                              >
                                {ingredient}
                              </span>
                            ))}
                            {recipe.ingredients.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{recipe.ingredients.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(recipe);
                            }}
                            className={`p-1 rounded-full transition-colors ${
                              recipe.favorite 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${recipe.favorite ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteRecipe(recipe);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeHistory;
