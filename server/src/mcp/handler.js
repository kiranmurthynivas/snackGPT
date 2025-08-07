const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const { suggestDish } = require('../tools/recipeGenerator');
const { validateMCPRequest } = require('../utils/validation');
const ElizaAgent = require('../eliza/agent');

// Initialize Eliza agent
let elizaAgent = null;

// MCP Server capabilities
const SERVER_CAPABILITIES = {
  tools: {
    listChanged: false,
    tools: [
      {
        name: "suggest_dish",
        description: "Generates a creative dish based on user ingredients, mood, and weather using Eliza AI agent for context analysis and enhanced prompt engineering.",
        inputSchema: {
          type: "object",
          properties: {
            ingredients: {
              type: "array",
              items: { type: "string" },
              description: "List of available ingredients",
              minItems: 1
            },
            mood: {
              type: "string",
              enum: ["happy", "tired", "sad", "excited", "stressed"],
              description: "User's current mood",
              default: "happy"
            },
            weather: {
              type: "string",
              enum: ["sunny", "rainy", "cloudy", "snowy", "windy"],
              description: "Current weather conditions",
              default: "sunny"
            },
            style: {
              type: "string",
              enum: ["shakespeare", "gordon_ramsay", "five_year_old"],
              description: "Cooking style voice",
              default: "five_year_old"
            }
          },
          required: ["ingredients"]
        },
        outputSchema: {
          type: "object",
          properties: {
            dish_name: { 
              type: "string",
              description: "Creative name for the generated dish"
            },
            ingredients: { 
              type: "array", 
              items: { type: "string" },
              description: "List of ingredients for the recipe"
            },
            instructions: { 
              type: "string",
              description: "Step-by-step cooking instructions"
            },
            style_description: { 
              type: "string",
              description: "Fun description in the specified style voice"
            },
            eliza_enhanced: { 
              type: "boolean",
              description: "Whether the recipe was enhanced by Eliza agent"
            },
            context_analysis: { 
              type: "object",
              properties: {
                mood_adapted: { type: "string" },
                weather_considered: { type: "string" },
                style_applied: { type: "string" }
              },
              description: "Eliza agent's context analysis"
            }
          },
          required: ["dish_name", "ingredients", "instructions", "style_description"]
        }
      }
    ]
  }
};

// MCP Request handlers
const handlers = {
  // Initialize the MCP server
  initialize: async (params) => {
    const { protocolVersion, capabilities, clientInfo } = params;
    
    console.log('🔌 MCP Initialize called:', { 
      protocolVersion, 
      clientInfo,
      timestamp: new Date().toISOString()
    });
    
    // Initialize Eliza agent
    if (!elizaAgent) {
      try {
        elizaAgent = new ElizaAgent();
        const elizaInfo = await elizaAgent.initialize();
        console.log('🤖 Eliza Agent initialized:', elizaInfo);
      } catch (error) {
        console.error('❌ Failed to initialize Eliza agent:', error);
        // Continue without Eliza agent
      }
    }
    
    return {
      protocolVersion: process.env.MCP_VERSION || "2024-11-05",
      capabilities: SERVER_CAPABILITIES,
      serverInfo: {
        name: process.env.MCP_SERVER_NAME || "snackgpt",
        version: process.env.MCP_SERVER_VERSION || "1.0.0",
        description: "AI-powered recipe generator with Eliza AI agent for context analysis",
        eliza_agent: elizaAgent ? {
          name: elizaAgent.name,
          version: elizaAgent.version,
          capabilities: elizaAgent.capabilities,
          status: 'active'
        } : {
          status: 'inactive',
          reason: 'Failed to initialize'
        }
      }
    };
  },

  // Handle tool invocations
  "$/invoke": async (params) => {
    const { name, arguments: args } = params;
    
    console.log('🔧 MCP Tool invocation:', { 
      name, 
      args,
      timestamp: new Date().toISOString()
    });
    
    switch (name) {
      case 'suggest_dish':
        try {
          const result = await suggestDish(args);
          console.log('✅ Recipe generated successfully:', {
            dish_name: result.dish_name,
            ingredients_count: result.ingredients?.length || 0,
            eliza_enhanced: result.eliza_enhanced || false
          });
          return result;
        } catch (error) {
          console.error('❌ Recipe generation failed:', error);
          throw new Error(`Failed to generate recipe: ${error.message}`);
        }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  },

  // Handle ping requests
  "$/ping": async () => {
    return { 
      timestamp: new Date().toISOString(),
      eliza_status: elizaAgent ? 'active' : 'inactive',
      server_uptime: process.uptime(),
      version: process.env.MCP_SERVER_VERSION || '1.0.0'
    };
  }
};

// Main MCP handler
async function mcpHandler(req, res) {
  const startTime = Date.now();
  
  try {
    const { jsonrpc, id, method, params } = req.body;

    // Validate JSON-RPC 2.0 request
    const validationError = validateMCPRequest(req.body);
    if (validationError) {
      console.warn('⚠️ Invalid MCP request:', validationError);
      return res.status(400).json({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32600,
          message: "Invalid Request",
          data: validationError
        }
      });
    }

    // Check if method exists
    if (!handlers[method]) {
      console.warn('⚠️ Method not found:', method);
      return res.status(400).json({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32601,
          message: "Method not found",
          data: { method }
        }
      });
    }

    // Execute handler
    try {
      const result = await handlers[method](params);
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ MCP ${method} completed in ${responseTime}ms`);
      
      res.json({
        jsonrpc: "2.0",
        id,
        result
      });
    } catch (error) {
      console.error('❌ MCP Handler error:', error);
      
      res.status(500).json({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32603,
          message: "Internal error",
          data: error.message
        }
      });
    }

  } catch (error) {
    console.error('❌ MCP Handler fatal error:', error);
    
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id || null,
      error: {
        code: -32603,
        message: "Internal error",
        data: error.message
      }
    });
  }
}

module.exports = mcpHandler;
