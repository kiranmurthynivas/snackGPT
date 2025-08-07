# SnackGPT API Documentation

## Overview

SnackGPT is an MCP-compliant server that provides AI-powered recipe generation capabilities. The server implements the JSON-RPC 2.0 protocol and exposes a single tool for generating creative recipes based on user inputs.

## Base URL

```
http://localhost:3001
```

## Endpoints

### MCP Endpoint

**POST** `/mcp`

Main endpoint for MCP protocol communication.

**Headers:**
```
Content-Type: application/json
```

**Request Format:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "method_name",
  "params": {}
}
```

### Health Check

**GET** `/health`

Returns server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "snackgpt-mcp-server",
  "version": "1.0.0"
}
```

### SSE Endpoint

**GET** `/mcp`

Server-Sent Events endpoint for real-time communication.

## MCP Methods

### Initialize

Initializes the MCP server and returns capabilities.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "snackgpt-client",
      "version": "1.0.0"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {
        "listChanged": false,
        "tools": [
          {
            "name": "suggest_dish",
            "description": "Generates a creative dish based on user ingredients, mood, and weather.",
            "inputSchema": {
              "type": "object",
              "properties": {
                "ingredients": {
                  "type": "array",
                  "items": { "type": "string" }
                },
                "mood": {
                  "type": "string",
                  "enum": ["happy", "tired", "sad", "excited", "stressed"]
                },
                "weather": {
                  "type": "string",
                  "enum": ["sunny", "rainy", "cloudy", "snowy", "windy"]
                },
                "style": {
                  "type": "string",
                  "enum": ["shakespeare", "gordon_ramsay", "five_year_old"]
                }
              },
              "required": ["ingredients"]
            },
            "outputSchema": {
              "type": "object",
              "properties": {
                "dish_name": { "type": "string" },
                "ingredients": { "type": "array", "items": { "type": "string" } },
                "instructions": { "type": "string" },
                "style_description": { "type": "string" }
              }
            }
          }
        ]
      }
    },
    "serverInfo": {
      "name": "snackgpt",
      "version": "1.0.0"
    }
  }
}
```

### Invoke Tool

Invokes the `suggest_dish` tool to generate a recipe.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "$/invoke",
  "params": {
    "name": "suggest_dish",
    "arguments": {
      "ingredients": ["banana", "pasta", "eggs"],
      "mood": "tired",
      "weather": "rainy",
      "style": "five_year_old"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "dish_name": "Cozy Banana Pasta Comfort",
    "ingredients": ["banana", "pasta", "eggs", "butter", "honey"],
    "instructions": "1. Boil pasta until al dente\n2. Mash banana with butter\n3. Scramble eggs\n4. Mix everything together\n5. Drizzle with honey and enjoy!",
    "style_description": "This is the most yummy tired food ever! It's like magic in your tummy and makes you want to dance around the kitchen!"
  }
}
```

### Ping

Simple ping method for testing connectivity.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "$/ping"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

All errors follow the JSON-RPC 2.0 error format:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Internal error",
    "data": "Additional error information"
  }
}
```

### Error Codes

- `-32700`: Parse error
- `-32600`: Invalid request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error

## Examples

### Complete Recipe Generation Flow

1. **Initialize the server:**
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05"
    }
  }'
```

2. **Generate a recipe:**
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "$/invoke",
    "params": {
      "name": "suggest_dish",
      "arguments": {
        "ingredients": ["chicken", "rice", "vegetables"],
        "mood": "happy",
        "weather": "sunny",
        "style": "gordon_ramsay"
      }
    }
  }'
```

## Rate Limiting

The server implements basic rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## Authentication

Currently, the server doesn't require authentication for local development. For production deployment, consider implementing API key authentication.

## Environment Variables

Required environment variables:

```bash
# Comput3 API Configuration
OPENAI_API_KEY=your_comput3_api_key
OPENAI_API_URL=https://api.comput3.ai/v1

# Model Configuration
SMALL_OPENAI_MODEL=llama3:70b
MEDIUM_OPENAI_MODEL=llama3:70b
LARGE_OPENAI_MODEL=llama3:70b

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Support

For issues and questions:
- GitHub: https://github.com/your-username/snackgpt
- Email: snackgpt@example.com
