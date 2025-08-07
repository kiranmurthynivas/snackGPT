const ElizaAgent = require('../eliza/agent');

class RecipeGenerator {
  constructor() {
    this.elizaAgent = new ElizaAgent();
  }

  async generateRecipe(ingredients, mood, weather, style) {
    try {
      console.log('🥘 Generating dish suggestion:', { ingredients, mood, weather, style });
      
      // Use Eliza agent to process the request
      const recipe = await this.elizaAgent.processRequest('suggest_dish', {
        ingredients,
        mood,
        weather,
        style
      });

      console.log('✅ Recipe generated:', recipe);
      return recipe;

    } catch (error) {
      console.error('Recipe generation error:', error);
      return this.generateFallbackRecipe(ingredients, mood, weather, style);
    }
  }

  generateFallbackRecipe(ingredients, mood, weather, style) {
    const dishName = this.generateDishName(ingredients, mood, weather);
    const instructions = this.generateInstructions(ingredients, mood, weather);
    const styleDescription = this.generateStyleDescription(style, mood);

    return {
      dish_name: dishName,
      ingredients: ingredients,
      instructions: instructions,
      style_description: styleDescription,
      eliza_enhanced: false,
      fallback: true
    };
  }

  generateDishName(ingredients, mood, weather) {
    const moodWords = {
      happy: ['Joyful', 'Happy', 'Sunny', 'Cheerful'],
      tired: ['Cozy', 'Comfort', 'Lazy', 'Relaxing'],
      sad: ['Comfort', 'Warm', 'Hug', 'Cozy'],
      excited: ['Explosive', 'Dynamic', 'Energetic', 'Vibrant'],
      stressed: ['Calming', 'Peaceful', 'Zen', 'Tranquil']
    };

    const weatherWords = {
      sunny: ['Bright', 'Sunny', 'Light', 'Fresh'],
      rainy: ['Cozy', 'Warm', 'Comfort', 'Indoor'],
      cloudy: ['Balanced', 'Mild', 'Gentle', 'Soft'],
      snowy: ['Hearty', 'Warm', 'Comfort', 'Winter'],
      windy: ['Quick', 'Fast', 'Dynamic', 'Energetic']
    };

    const moodWord = moodWords[mood] ? moodWords[mood][Math.floor(Math.random() * moodWords[mood].length)] : 'Delicious';
    const weatherWord = weatherWords[weather] ? weatherWords[weather][Math.floor(Math.random() * weatherWords[weather].length)] : 'Amazing';
    const ingredientWord = ingredients[0] ? ingredients[0].charAt(0).toUpperCase() + ingredients[0].slice(1) : 'Special';

    return `${moodWord} ${weatherWord} ${ingredientWord} Delight`;
  }

  generateInstructions(ingredients, mood, weather) {
    const baseSteps = [
      `Gather your ingredients: ${ingredients.join(', ')}`,
      'Prepare your cooking space and equipment',
      'Follow the recipe steps carefully',
      'Taste and adjust seasoning as needed',
      'Serve and enjoy your creation!'
    ];

    return baseSteps.map((step, index) => `Step ${index + 1}. ${step}`).join('\n');
  }

  generateStyleDescription(style, mood) {
    const descriptions = {
      shakespeare: `Verily, this dish doth bring forth joy and comfort to thy weary soul. 'Tis a masterpiece worthy of the finest banquet halls.`,
      gordon_ramsay: `Bloody brilliant! This dish is absolutely stunning - proper comfort food that'll make you forget all your troubles.`,
      five_year_old: `This is the BEST food ever! It's super yummy and makes you feel so happy! You're going to love it!`
    };

    return descriptions[style] || descriptions.five_year_old;
  }
}

async function suggestDish(args) {
  const generator = new RecipeGenerator();
  return await generator.generateRecipe(
    args.ingredients,
    args.mood,
    args.weather,
    args.style
  );
}

module.exports = {
  RecipeGenerator,
  suggestDish
};
