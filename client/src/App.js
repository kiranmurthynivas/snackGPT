import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Frown } from 'lucide-react';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import LoadingSpinner from './components/LoadingSpinner';
import FloatingIngredients from './components/FloatingIngredients';
import RecipeHistory from './components/RecipeHistory';

function App() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipeHistory, setRecipeHistory] = useState([]);

  // Load recipe history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('snackgpt_history');
    if (savedHistory) {
      try {
        setRecipeHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Failed to load recipe history:', err);
      }
    }
  }, []);

  // Save recipe history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('snackgpt_history', JSON.stringify(recipeHistory));
  }, [recipeHistory]);

  const handleRecipeGenerated = (newRecipe) => {
    // Add timestamp and ID to the recipe
    const recipeWithMetadata = {
      ...newRecipe,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      favorite: false
    };

    setRecipe(recipeWithMetadata);
    setError(null);

    // Add to history (avoid duplicates)
    setRecipeHistory(prev => {
      const existingIndex = prev.findIndex(r => r.dish_name === newRecipe.dish_name);
      if (existingIndex >= 0) {
        // Update existing recipe
        const updated = [...prev];
        updated[existingIndex] = recipeWithMetadata;
        return updated;
      } else {
        // Add new recipe to the beginning
        return [recipeWithMetadata, ...prev.slice(0, 9)]; // Keep only last 10 recipes
      }
    });
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setRecipe(null);
  };

  const handleLoadRecipe = (selectedRecipe) => {
    setRecipe(selectedRecipe);
    setError(null);
  };

  const handleDeleteRecipe = (recipeToDelete) => {
    setRecipeHistory(prev => prev.filter(r => r.id !== recipeToDelete.id));
    if (recipe && recipe.id === recipeToDelete.id) {
      setRecipe(null);
    }
  };

  const handleToggleFavorite = (recipeToToggle) => {
    setRecipeHistory(prev => 
      prev.map(r => 
        r.id === recipeToToggle.id 
          ? { ...r, favorite: !r.favorite }
          : r
      )
    );
    
    if (recipe && recipe.id === recipeToToggle.id) {
      setRecipe({ ...recipe, favorite: !recipe.favorite });
    }
  };

  const handleShare = async (recipeToShare) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipeToShare.dish_name,
          text: `Check out this amazing recipe: ${recipeToShare.dish_name}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-pink-50 to-lemon-50 transition-colors duration-300">
      {/* Floating Ingredients Background */}
      <FloatingIngredients />
      
      {/* Header */}
      <motion.header 
        className="text-center py-8 px-4 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-fredoka bg-gradient-to-r from-mint-600 via-pink-600 to-lemon-600 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🍽️ SnackGPT
        </motion.h1>
        <p className="text-xl mt-2 font-medium text-gray-600">
          AI-Powered Recipe Generator
        </p>
        {recipeHistory.length > 0 && (
          <p className="text-sm mt-1 text-gray-500">
            {recipeHistory.length} recipe{recipeHistory.length !== 1 ? 's' : ''} in your history
          </p>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Recipe Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <RecipeForm 
              onRecipeGenerated={handleRecipeGenerated}
              onError={handleError}
              setLoading={setLoading}
            />
          </motion.div>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-8"
              >
                <LoadingSpinner />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <div className="card bg-red-50 border-red-200">
                  <div className="flex items-center space-x-3">
                    <Frown className="text-red-500 w-6 h-6" />
                    <div>
                      <h3 className="font-semibold text-red-800">
                        Oops! Something went wrong
                      </h3>
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recipe Display */}
          <AnimatePresence>
            {recipe && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <RecipeCard 
                  recipe={recipe}
                  onFavorite={handleToggleFavorite}
                  onShare={handleShare}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Recipe History */}
      {recipeHistory.length > 0 && (
        <RecipeHistory
          recipes={recipeHistory}
          onLoadRecipe={handleLoadRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Footer */}
      <motion.footer 
        className="text-center py-6 px-4 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="text-sm">
          Powered by Eliza AI Agent & Comput3 AI • Built for Aya MCP Hackathon
        </p>
        <div className="flex items-center justify-center space-x-4 mt-2">
          <span className="text-xs">🍳</span>
          <span className="text-xs">🤖</span>
          <span className="text-xs">✨</span>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
