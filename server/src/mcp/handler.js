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
        description: "Generates a creative dish based on user ingredients, mood, and weather using Eliza AI agent.",
        inputSchema: {
          type: "object",
          properties: {
            ingredients: {
              type: "array",
              items: { type: "string" },
              description: "List of available ingredients"
            },
            mood: {
              type: "string",
              enum: ["happy", "tired", "sad", "excited", "stressed"],
              description: "User's current mood"
            },
            weather: {
              type: "string",
              enum: ["sunny", "rainy", "cloudy", "snowy", "windy"],
              description: "Current weather conditions"
            },
            style: {
              type: "string",
              enum: ["shakespeare", "gordon_ramsay", "five_year_old"],
              description: "Cooking style voice"
            }
          },
          required: ["ingredients"]
        },
        outputSchema: {
          type: "object",
          properties: {
            dish_name: { type: "string" },
            ingredients: { type: "array", items: { type: "string" } },
            instructions: { type: "string" },
            style_description: { type: "string" },
            eliza_enhanced: { type: "boolean" },
            context_analysis: { 
              type: "object",
              properties: {
                mood_adapted: { type: "string" },
                weather_considered: { type: "string" },
                style_applied: { type: "string" }
              }
            }
          }
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
    
    console.log('🔌 MCP Initialize called:', { protocolVersion, clientInfo });
    
    // Initialize Eliza agent
    if (!elizaAgent) {
      elizaAgent = new ElizaAgent();
      const elizaInfo = await elizaAgent.initialize();
      console.log('🤖 Eliza Agent initialized:', elizaInfo);
    }
    
    return {
      protocolVersion: process.env.MCP_VERSION || "2024-11-05",
      capabilities: SERVER_CAPABILITIES,
      serverInfo: {
        name: process.env.MCP_SERVER_NAME || "snackgpt",
        version: process.env.MCP_SERVER_VERSION || "1.0.0",
        eliza_agent: elizaAgent ? {
          name: elizaAgent.name,
          version: elizaAgent.version,
          capabilities: elizaAgent.capabilities
        } : null
      }
    };
  },

  // Handle tool invocations
  "$/invoke": async (params) => {
    const { name, arguments: args } = params;
    
    console.log('🔧 MCP Tool invocation:', { name, args });
    
    switch (name) {
      case 'suggest_dish':
        return await suggestDish(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  },

  // Handle ping requests
  "$/ping": async () => {
    return { 
      timestamp: new Date().toISOString(),
      eliza_status: elizaAgent ? 'active' : 'inactive'
    };
  }
};

// Main MCP handler
async function mcpHandler(req, res) {
  try {
    const { jsonrpc, id, method, params } = req.body;

    // Validate JSON-RPC 2.0 request
    const validationError = validateMCPRequest(req.body);
    if (validationError) {
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
      
      res.json({
        jsonrpc: "2.0",
        id,
        result
      });
    } catch (error) {
      console.error('MCP Handler error:', error);
      
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
    console.error('MCP Handler fatal error:', error);
    
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
