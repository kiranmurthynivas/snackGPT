const Joi = require('joi');

// JSON-RPC 2.0 request schema
const jsonRpcSchema = Joi.object({
  jsonrpc: Joi.string().valid('2.0').required(),
  id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  method: Joi.string().required(),
  params: Joi.object().optional()
});

// MCP-specific validation schemas
const mcpSchemas = {
  initialize: Joi.object({
    protocolVersion: Joi.string().required(),
    capabilities: Joi.object().optional(),
    clientInfo: Joi.object({
      name: Joi.string().optional(),
      version: Joi.string().optional()
    }).optional()
  }),

  invoke: Joi.object({
    name: Joi.string().required(),
    arguments: Joi.object().required()
  }),

  suggestDish: Joi.object({
    ingredients: Joi.array().items(Joi.string()).min(1).required(),
    mood: Joi.string().valid('happy', 'tired', 'sad', 'excited', 'stressed').optional(),
    weather: Joi.string().valid('sunny', 'rainy', 'cloudy', 'snowy', 'windy').optional(),
    style: Joi.string().valid('shakespeare', 'gordon_ramsay', 'five_year_old').optional()
  })
};

function validateMCPRequest(request) {
  try {
    // Validate JSON-RPC 2.0 structure
    const { error: jsonRpcError } = jsonRpcSchema.validate(request);
    if (jsonRpcError) {
      return `Invalid JSON-RPC 2.0 request: ${jsonRpcError.message}`;
    }

    const { method, params } = request;

    // Validate method-specific parameters
    switch (method) {
      case 'initialize':
        if (params) {
          const { error } = mcpSchemas.initialize.validate(params);
          if (error) {
            return `Invalid initialize parameters: ${error.message}`;
          }
        }
        break;

      case '$/invoke':
        if (!params) {
          return 'Missing parameters for $/invoke method';
        }
        
        const { error: invokeError } = mcpSchemas.invoke.validate(params);
        if (invokeError) {
          return `Invalid invoke parameters: ${invokeError.message}`;
        }

        // Validate tool-specific parameters
        if (params.name === 'suggest_dish') {
          const { error: toolError } = mcpSchemas.suggestDish.validate(params.arguments);
          if (toolError) {
            return `Invalid suggest_dish arguments: ${toolError.message}`;
          }
        }
        break;

      case '$/ping':
        // No parameters required for ping
        break;

      default:
        return `Unknown method: ${method}`;
    }

    return null; // No validation errors
  } catch (error) {
    return `Validation error: ${error.message}`;
  }
}

function validateRecipeData(recipeData) {
  const recipeSchema = Joi.object({
    dish_name: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    instructions: Joi.string().required(),
    style_description: Joi.string().required()
  });

  const { error } = recipeSchema.validate(recipeData);
  return error ? error.message : null;
}

function sanitizeIngredients(ingredients) {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients
    .filter(ingredient => typeof ingredient === 'string' && ingredient.trim().length > 0)
    .map(ingredient => ingredient.trim().toLowerCase())
    .filter((ingredient, index, array) => array.indexOf(ingredient) === index); // Remove duplicates
}

function validateMood(mood) {
  const validMoods = ['happy', 'tired', 'sad', 'excited', 'stressed'];
  return validMoods.includes(mood) ? mood : 'happy';
}

function validateWeather(weather) {
  const validWeathers = ['sunny', 'rainy', 'cloudy', 'snowy', 'windy'];
  return validWeathers.includes(weather) ? weather : 'sunny';
}

function validateStyle(style) {
  const validStyles = ['shakespeare', 'gordon_ramsay', 'five_year_old'];
  return validStyles.includes(style) ? style : 'five_year_old';
}

module.exports = {
  validateMCPRequest,
  validateRecipeData,
  sanitizeIngredients,
  validateMood,
  validateWeather,
  validateStyle
};
