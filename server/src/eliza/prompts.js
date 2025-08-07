// Eliza prompt templates for SnackGPT recipe generation

function generateRecipePrompt(ingredients, mood, weather, style) {
  const basePrompt = `Generate a creative and fun recipe using the following ingredients: ${ingredients.join(', ')}.

Context:
- Mood: ${mood}
- Weather: ${weather}
- Cooking Style: ${style}

Requirements:
1. Create a unique dish name that reflects the mood and weather
2. Use the provided ingredients as the base, but feel free to suggest additional common ingredients
3. Write clear, step-by-step instructions
4. Include a fun description in the specified style voice
5. Make the recipe appropriate for the given mood and weather

Cooking Style Voices:
- shakespeare: Use Elizabethan English with "thou", "doth", "verily", etc.
- gordon_ramsay: Use passionate, direct language with British expressions
- five_year_old: Use simple, excited language with lots of exclamation marks

Respond with a JSON object in this exact format:
{
  "dish_name": "Creative dish name",
  "ingredients": ["ingredient1", "ingredient2", "additional_ingredient3"],
  "instructions": "Step 1. Do this...\nStep 2. Do that...\nStep 3. Continue...",
  "style_description": "Fun description in the specified style voice"
}`;

  const styleSpecificPrompt = getStyleSpecificPrompt(style, mood, weather);
  
  return `${basePrompt}\n\n${styleSpecificPrompt}`;
}

function getStyleSpecificPrompt(style, mood, weather) {
  const stylePrompts = {
    shakespeare: `Thou must craft this culinary masterpiece in the voice of William Shakespeare himself. Use "thou", "doth", "verily", "forsooth", and other Elizabethan expressions. Make it sound like a soliloquy from a play about cooking. Consider how the ${mood} mood and ${weather} weather would be described in Shakespearean terms.`,
    
    gordon_ramsay: `Channel the energy and passion of Gordon Ramsay! Use direct, passionate language with British expressions like "bloody", "proper", "donut", "brilliant". Be enthusiastic about the cooking process and make it sound like you're giving a cooking show. The ${mood} mood should influence the energy level, and ${weather} weather should affect the cooking approach.`,
    
    five_year_old: `Write like an excited 5-year-old who just discovered cooking! Use simple words, lots of exclamation marks, and childlike wonder. Everything should be "yummy", "amazing", "super cool", or "the best ever!". The ${mood} mood should be expressed in simple emotional terms, and ${weather} weather should be described in basic terms a child would understand.`
  };

  return stylePrompts[style] || stylePrompts.five_year_old;
}

// Example prompts for different scenarios
const examplePrompts = {
  happy_sunny_shakespeare: `Verily, the sun doth shine upon our culinary endeavors! With hearts full of joy and spirits lifted by the golden rays, we shall craft a masterpiece worthy of the gods themselves.`,
  
  tired_rainy_ramsay: `Listen here, you donut! When you're tired and it's raining outside, you need proper comfort food that'll warm your soul and make you forget about the miserable weather!`,
  
  sad_cloudy_five_year_old: `Sometimes when you're feeling sad and the sky is all cloudy, you need super yummy food to make you feel better! It's like a big hug for your tummy!`
};

// Helper function to generate mood-appropriate cooking tips
function getMoodCookingTips(mood) {
  const tips = {
    happy: "Focus on bright, colorful ingredients and fun presentation",
    tired: "Keep it simple and comforting, avoid complex techniques",
    sad: "Choose warm, comforting foods that feel like a hug",
    excited: "Go bold with flavors and creative combinations",
    stressed: "Choose calming, easy-to-prepare dishes"
  };
  
  return tips[mood] || tips.happy;
}

// Helper function to get weather-appropriate cooking methods
function getWeatherCookingMethods(weather) {
  const methods = {
    sunny: "Light, fresh cooking methods like grilling or salads",
    rainy: "Warm, comforting methods like soups or baked dishes",
    cloudy: "Balanced cooking methods, neither too light nor too heavy",
    snowy: "Hearty, warming methods like stews or roasted dishes",
    windy: "Quick cooking methods that don't require outdoor cooking"
  };
  
  return methods[weather] || methods.sunny;
}

module.exports = {
  generateRecipePrompt,
  getStyleSpecificPrompt,
  getMoodCookingTips,
  getWeatherCookingMethods,
  examplePrompts
};
