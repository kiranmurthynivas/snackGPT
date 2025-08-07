import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Droplets, Apple } from 'lucide-react';

const NutritionInfo = ({ ingredients, servings = 1 }) => {
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock nutrition database - in a real app, this would come from an API
  const nutritionDatabase = useMemo(() => ({
    'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    'tomato': { calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.2 },
    'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
    'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
    'egg': { calories: 70, protein: 6, carbs: 0.6, fat: 5, fiber: 0 },
    'bread': { calories: 79, protein: 3.1, carbs: 14.7, fat: 1.1, fiber: 1.1 },
    'cheese': { calories: 113, protein: 7, carbs: 0.4, fat: 9.3, fiber: 0 },
    'butter': { calories: 102, protein: 0.1, carbs: 0.1, fat: 11.5, fiber: 0 },
    'olive oil': { calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0 },
    'garlic': { calories: 4, protein: 0.2, carbs: 1, fat: 0, fiber: 0.1 },
    'salt': { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    'pepper': { calories: 6, protein: 0.3, carbs: 1.5, fat: 0.1, fiber: 0.6 },
    'honey': { calories: 64, protein: 0.1, carbs: 17.3, fat: 0, fiber: 0 },
    'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
    'flour': { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7 },
    'sugar': { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    'banana': { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 },
    'apple': { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4 },
    'carrot': { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8 },
    'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
    'pork': { calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0 },
    'fish': { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0 },
    'shrimp': { calories: 85, protein: 20, carbs: 0.2, fat: 0.5, fiber: 0 },
    'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 },
    'lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9 },
    'quinoa': { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 }
  }), []);

  const calculateNutrition = useCallback(() => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let totalNutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      };

      ingredients.forEach(ingredient => {
        const cleanIngredient = ingredient.toLowerCase().replace(/[^a-z\s]/g, '').trim();
        
        // Find matching ingredient in database
        let found = false;
        for (const [key, nutrition] of Object.entries(nutritionDatabase)) {
          if (cleanIngredient.includes(key) || key.includes(cleanIngredient)) {
            totalNutrition.calories += nutrition.calories;
            totalNutrition.protein += nutrition.protein;
            totalNutrition.carbs += nutrition.carbs;
            totalNutrition.fat += nutrition.fat;
            totalNutrition.fiber += nutrition.fiber;
            found = true;
            break;
          }
        }
        
        // If not found, add estimated values
        if (!found) {
          totalNutrition.calories += 50; // Default estimate
          totalNutrition.protein += 2;
          totalNutrition.carbs += 5;
          totalNutrition.fat += 1;
          totalNutrition.fiber += 0.5;
        }
      });

      // Adjust for servings
      const perServing = {
        calories: Math.round(totalNutrition.calories / servings),
        protein: Math.round(totalNutrition.protein / servings * 10) / 10,
        carbs: Math.round(totalNutrition.carbs / servings * 10) / 10,
        fat: Math.round(totalNutrition.fat / servings * 10) / 10,
        fiber: Math.round(totalNutrition.fiber / servings * 10) / 10
      };

      setNutritionData(perServing);
      setLoading(false);
    }, 500);
  }, [ingredients, servings, nutritionDatabase]);

  useEffect(() => {
    calculateNutrition();
  }, [calculateNutrition]);

  const getCalorieLevel = (calories) => {
    if (calories < 200) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (calories < 400) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getNutritionGrade = (nutrition) => {
    let score = 0;
    if (nutrition.fiber > 3) score += 2;
    if (nutrition.protein > 10) score += 2;
    if (nutrition.fat < 10) score += 1;
    if (nutrition.calories < 300) score += 1;
    
    if (score >= 5) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 3) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 1) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card bg-gradient-to-br from-lemon-50 to-mint-50"
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-500"></div>
          <span className="ml-3 text-gray-600">Calculating nutrition...</span>
        </div>
      </motion.div>
    );
  }

  const calorieLevel = getCalorieLevel(nutritionData.calories);
  const nutritionGrade = getNutritionGrade(nutritionData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-lemon-50 to-mint-50 border-2 border-lemon-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-lemon-600" />
          Nutrition Information
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${nutritionGrade.bg} ${nutritionGrade.color}`}>
          Grade {nutritionGrade.grade}
        </div>
      </div>

      {/* Calories */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Calories per serving</span>
          <span className={`text-sm font-medium ${calorieLevel.color}`}>
            {calorieLevel.level}
          </span>
        </div>
        <div className="text-3xl font-bold text-gray-800">
          {nutritionData.calories} kcal
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <motion.div
            className={`h-2 rounded-full ${
              calorieLevel.level === 'Low' ? 'bg-green-500' :
              calorieLevel.level === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((nutritionData.calories / 600) * 100, 100)}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Macronutrients */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center mb-1">
            <Zap className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-600">Protein</span>
          </div>
          <div className="text-xl font-bold text-gray-800">
            {nutritionData.protein}g
          </div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center mb-1">
            <Apple className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-gray-600">Carbs</span>
          </div>
          <div className="text-xl font-bold text-gray-800">
            {nutritionData.carbs}g
          </div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center mb-1">
            <Droplets className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-gray-600">Fat</span>
          </div>
          <div className="text-xl font-bold text-gray-800">
            {nutritionData.fat}g
          </div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center mb-1">
            <Activity className="w-4 h-4 text-purple-500 mr-1" />
            <span className="text-sm text-gray-600">Fiber</span>
          </div>
          <div className="text-xl font-bold text-gray-800">
            {nutritionData.fiber}g
          </div>
        </div>
      </div>

      {/* Daily Values */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-3">Daily Values (per serving)</h4>
        <div className="space-y-2">
          {[
            { label: 'Protein', value: nutritionData.protein, target: 50, unit: 'g' },
            { label: 'Carbs', value: nutritionData.carbs, target: 275, unit: 'g' },
            { label: 'Fat', value: nutritionData.fat, target: 55, unit: 'g' },
            { label: 'Fiber', value: nutritionData.fiber, target: 28, unit: 'g' }
          ].map((item) => {
            const percentage = Math.round((item.value / item.target) * 100);
            return (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-mint-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {item.value}{item.unit} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        *Nutritional information is estimated and may vary based on actual ingredients and preparation methods.
      </div>
    </motion.div>
  );
};

export default NutritionInfo;
