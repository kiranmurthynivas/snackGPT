const axios = require('axios');
const { generateRecipePrompt } = require('./prompts');

class ElizaAgent {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = process.env.OPENAI_API_URL || 'https://api.comput3.ai/v1';
    this.model = process.env.MEDIUM_OPENAI_MODEL || 'llama3:70b';
    this.name = 'Eliza';
    this.version = '1.0.0';
  }

  async initialize() {
    console.log('🤖 Eliza Agent initializing...');
    return {
      name: this.name,
      version: this.version,
      capabilities: ['recipe_generation', 'prompt_engineering', 'context_analysis']
    };
  }

  async processRequest(requestType, data) {
    console.log(`🔮 Eliza Agent processing ${requestType} request:`, data);
    
    switch (requestType) {
      case 'suggest_dish':
        return await this.generateRecipe(data);
      case 'analyze_mood':
        return await this.analyzeMood(data);
      case 'weather_adaptation':
        return await this.adaptToWeather(data);
      default:
        throw new Error(`Unknown request type: ${requestType}`);
    }
  }

  async generateRecipe({ ingredients, mood, weather, style }) {
    // Eliza's role: Analyze context and create the perfect prompt
    const contextAnalysis = await this.analyzeContext(mood, weather, style);
    const enhancedPrompt = await this.enhancePrompt(ingredients, contextAnalysis);
    
    // Eliza's role: Route to Comput3 AI with enhanced prompt
    const recipe = await this.callComput3AI(enhancedPrompt);
    
    // Eliza's role: Post-process and validate the response
    return await this.postProcessRecipe(recipe, ingredients, mood, weather, style);
  }

  async analyzeContext(mood, weather, style) {
    const contextPrompt = `Analyze the following context for recipe generation:
- Mood: ${mood}
- Weather: ${weather}
- Style: ${style}

Provide insights on:
1. What type of food would be most appropriate
2. How the mood should influence the recipe
3. How the weather should affect cooking methods
4. What tone/style would work best

Respond in JSON format:
{
  "food_type": "comfort/light/hearty/etc",
  "mood_influence": "how mood affects the recipe",
  "weather_adaptation": "how weather affects cooking",
  "style_recommendation": "recommended approach"
}`;

    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are Eliza, an AI agent specializing in context analysis for recipe generation. Provide thoughtful, detailed analysis.'
            },
            {
              role: 'user',
              content: contextPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Context analysis failed:', error);
      return {
        food_type: 'balanced',
        mood_influence: 'comfort',
        weather_adaptation: 'indoor',
        style_recommendation: style
      };
    }
  }

  async enhancePrompt(ingredients, contextAnalysis) {
    const basePrompt = generateRecipePrompt(ingredients, contextAnalysis.mood_influence, contextAnalysis.weather_adaptation, contextAnalysis.style_recommendation);
    
    const enhancement = `Based on my analysis:
- Food Type: ${contextAnalysis.food_type}
- Mood Influence: ${contextAnalysis.mood_influence}
- Weather Adaptation: ${contextAnalysis.weather_adaptation}

Please consider these factors when generating the recipe.`;

    return `${basePrompt}\n\n${enhancement}`;
  }

  async callComput3AI(prompt) {
    console.log('🔗 Eliza routing to Comput3 AI...');
    
    const response = await axios.post(
      `${this.apiUrl}/chat/completions`,
      {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are SnackGPT, a creative AI chef that generates fun and unique recipes. Always respond with valid JSON in the exact format specified.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  }

  async postProcessRecipe(recipe, ingredients, mood, weather, style) {
    // Eliza's final touch: Validate and enhance the recipe
    const validation = await this.validateRecipe(recipe, ingredients);
    
    if (!validation.isValid) {
      console.log('⚠️ Eliza detected issues, regenerating...');
      return await this.regenerateRecipe(ingredients, mood, weather, style);
    }

    // Add Eliza's signature touch
    recipe.eliza_enhanced = true;
    recipe.context_analysis = {
      mood_adapted: mood,
      weather_considered: weather,
      style_applied: style
    };

    return recipe;
  }

  async validateRecipe(recipe, ingredients) {
    const requiredFields = ['dish_name', 'ingredients', 'instructions', 'style_description'];
    const missingFields = requiredFields.filter(field => !recipe[field]);
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      hasIngredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
    };
  }

  async regenerateRecipe(ingredients, mood, weather, style) {
    console.log('🔄 Eliza regenerating recipe...');
    const fallbackPrompt = generateRecipePrompt(ingredients, mood, weather, style);
    return await this.callComput3AI(fallbackPrompt);
  }

  async analyzeMood(moodData) {
    // Eliza can analyze mood patterns and suggest recipe types
    const moodAnalysis = {
      happy: { energy: 'high', comfort: 'medium', complexity: 'medium' },
      tired: { energy: 'low', comfort: 'high', complexity: 'low' },
      sad: { energy: 'low', comfort: 'high', complexity: 'low' },
      excited: { energy: 'high', comfort: 'medium', complexity: 'high' },
      stressed: { energy: 'low', comfort: 'high', complexity: 'low' }
    };

    return moodAnalysis[moodData.mood] || moodAnalysis.happy;
  }

  async adaptToWeather(weatherData) {
    // Eliza can suggest weather-appropriate cooking methods
    const weatherAdaptations = {
      sunny: { method: 'grilling', style: 'fresh', temperature: 'cool' },
      rainy: { method: 'baking', style: 'comfort', temperature: 'warm' },
      cloudy: { method: 'stovetop', style: 'balanced', temperature: 'moderate' },
      snowy: { method: 'slow_cooking', style: 'hearty', temperature: 'hot' }
    };

    return weatherAdaptations[weatherData.weather] || weatherAdaptations.sunny;
  }
}

module.exports = ElizaAgent;
