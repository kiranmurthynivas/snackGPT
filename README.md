# 🍽️ SnackGPT - AI-Powered Recipe Generator

**MCP Hackathon Submission - Standard Category**

## 📞 Contact Information
- **Primary Contact**: Kiran Murthy K S
- **Telegram Handle**: @kiranmurthyks
- **Team Name**: delta
- **Project Title**: SnackGPT

## 🎯 One-Sentence Elevator Pitch
**SnackGPT**: An AI-powered recipe generator that whips up wild dishes based on your fridge, mood, and weather—with a hilarious twist!

## 📖 Detailed Project Description

### Project Title: 🥗 SnackGPT – The AI Mood & Fridge-Based Recipe Generator

**Description:**

SnackGPT is a fun, interactive AI-powered web app that generates creative, often hilarious recipes based on what users have in their fridge or how they're feeling. By leveraging ElizaOS and Comput3's LLaMA3-based MCP tooling, SnackGPT takes simple inputs like ingredients, mood, and weather—and transforms them into unique dishes like "Banana Blaster Noodles" or "Melancholy Rainy Day Toast."

Users can toggle between different narrative styles—such as Shakespearean drama, Gordon Ramsay's fiery sarcasm, or the whimsical logic of a 5-year-old—making each recipe a personalized performance. Whether you're cooking with scraps or craving food that matches your vibes, SnackGPT adds humor, utility, and AI magic to your kitchen experience.

### 🔧 Features

- **`suggest_dish(ingredients, mood, weather, style)`**: Generates a recipe based on fridge contents, mood, and weather conditions
- **Eliza AI Agent**: Intelligent context analysis and enhanced prompt engineering
- **Multiple Cooking Styles**: Shakespearean drama, Gordon Ramsay's fiery sarcasm, or 5-year-old whimsy
- **Mood-Based Cooking**: Recipes adapt to your emotional state (happy, tired, sad, excited, stressed)
- **Weather-Aware Recipes**: Cooking suggestions based on weather conditions (sunny, rainy, cloudy, snowy, windy)
- **Fun and Colorful UI**: Animated floating food, emoji inputs, and confetti when a dish is revealed
- **Recipe History**: Save and manage your favorite recipes
- **Step-by-Step Cooking Guide**: Interactive cooking instructions
- **Nutrition Information**: Calorie estimation and macronutrient breakdown

### ⚙️ Tech Stack

- **Frontend**: React 18, TailwindCSS, Framer Motion
- **Backend**: Node.js with Express (ElizaOS MCP Agent)
- **AI Model**: LLaMA3-70B via Comput3
- **Protocol**: MCP (Model Context Protocol) with JSON-RPC 2.0
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Database**: LocalStorage (stateless)

## 🚀 Installation Steps

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Comput3 API key

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/snackgpt-team/snackgpt.git
cd snackgpt
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**
```bash
# Copy environment template
cp server/env.example server/.env

# Edit server/.env and add your Comput3 API key
OPENAI_API_KEY=your_comput3_api_key_here
OPENAI_API_URL=https://api.comput3.ai/v1
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. **Start the application**
```bash
npm run dev
```

5. **Open in browser**
- Frontend: http://localhost:3000
- Backend MCP: http://localhost:3001/mcp
- Health Check: http://localhost:3001/health

## 🌐 Production Deployment

### Backend (Render)
- **URL**: https://snackgpt-mcp-server.onrender.com
- **MCP Endpoint**: https://snackgpt-mcp-server.onrender.com/mcp
- **Health Check**: https://snackgpt-mcp-server.onrender.com/health

### Frontend (Vercel)
- **URL**: https://snackgpt.vercel.app

## 🔧 Environment Variables

### Required Environment Variables
```bash
# Comput3 API Configuration
OPENAI_API_KEY=your_comput3_api_key_here
OPENAI_API_URL=https://api.comput3.ai/v1

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# MCP Configuration
MCP_VERSION=2024-11-05
MCP_SERVER_NAME=snackgpt
MCP_SERVER_VERSION=1.0.0

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=combined

# Health Check Configuration
HEALTH_CHECK_ENABLED=true
```

## 🎮 Usage Examples

### Basic Recipe Generation
1. **Enter ingredients** in the text area (e.g., "banana, pasta, eggs, cheese")
2. **Select your mood** (happy, tired, sad, excited, stressed)
3. **Choose weather** (sunny, rainy, cloudy, snowy, windy)
4. **Pick cooking style** (Shakespeare, Gordon Ramsay, 5-year-old)
5. **Generate recipe** and enjoy!

### MCP Protocol Usage

#### Initialize MCP Connection
```bash
curl -X POST https://snackgpt-mcp-server.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    }
  }'
```

#### Generate a Recipe
```bash
curl -X POST https://snackgpt-mcp-server.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "$/invoke",
    "params": {
      "name": "suggest_dish",
      "arguments": {
        "ingredients": ["chicken", "rice", "tomato"],
        "mood": "happy",
        "weather": "sunny",
        "style": "shakespeare"
      }
    }
  }'
```

### Example Recipe Output
```json
{
  "dish_name": "Merry Sunshine Chicken Delight",
  "ingredients": ["chicken", "rice", "tomato", "olive oil", "herbs", "garlic"],
  "instructions": "Step 1. Thou shalt begin by seasoning the chicken with herbs and garlic, verily, to taste.\nStep 2. In a pan, heat olive oil over medium heat, then add the chicken and cook until golden brown.\nStep 3. Add rice and tomatoes to the pan, stirring gently that all ingredients doth mingle.\nStep 4. Cover and simmer until rice is tender and chicken is cooked through.\nStep 5. Serve hot and enjoy this merry feast!",
  "style_description": "O, fair cook, this dish doth bring joy to the heart and warmth to the soul! The golden chicken, the fluffy rice, and the sweet tomatoes create a symphony of flavors that shall delight thy senses on this sunny day!",
  "eliza_enhanced": true,
  "context_analysis": {
    "mood_adapted": "happy",
    "weather_considered": "sunny",
    "style_applied": "shakespeare"
  }
}
```

## 🐛 Known Issues

### Current Issues
1. **ESLint Warnings**: Some unused imports in App.js (non-critical)
2. **Favicon 404**: Missing favicon.ico causing 404 errors in browser console
3. **Manifest 404**: Missing manifest.json causing 404 errors in browser console
4. **Voice Commands**: Feature has been removed as requested

### Limitations
1. **API Rate Limits**: Comput3 API has rate limits that may affect high-volume usage
2. **Ingredient Recognition**: Limited to common ingredients, may not recognize very specific or regional ingredients
3. **Recipe Complexity**: Generated recipes are generally simple to moderate complexity
4. **Language Support**: Currently only supports English

### Future Improvements
1. **Multi-language Support**: Add support for multiple languages
2. **Recipe Validation**: Implement recipe validation and safety checks
3. **User Accounts**: Add user authentication and recipe saving
4. **Recipe Sharing**: Social media integration for recipe sharing
5. **Voice Integration**: Re-implement voice commands with better UX

## 🏗️ Architecture

### Frontend (React + Tailwind CSS + Framer Motion)
```
client/
├── src/
│   ├── components/
│   │   ├── RecipeForm.js          # Main form component
│   │   ├── RecipeCard.js          # Enhanced recipe display
│   │   ├── CookingSteps.js        # Step-by-step cooking guide
│   │   ├── NutritionInfo.js       # Nutritional analysis
│   │   ├── RecipeHistory.js       # Recipe history & favorites
│   │   ├── LoadingSpinner.js      # Animated loading
│   │   └── FloatingIngredients.js # Background animations
│   ├── App.js                     # Main app component
│   └── index.js                   # Entry point
```

### Backend (Node.js + Express + MCP Protocol)
```
server/
├── src/
│   ├── eliza/
│   │   ├── agent.js               # Eliza AI agent implementation
│   │   └── prompts.js             # Dynamic prompt generation
│   ├── mcp/
│   │   └── handler.js             # MCP protocol handlers
│   ├── tools/
│   │   └── recipeGenerator.js     # Recipe generation logic
│   └── utils/
│       ├── validation.js          # Input validation
│       └── errorHandler.js        # Error handling
```

## 🔒 Security Features

- **Rate Limiting** - 100 requests per 15 minutes per IP
- **HTTPS** - Secure communication with valid SSL certificates
- **CORS** - Configurable CORS with secure defaults
- **Helmet** - Security headers enabled
- **Input Validation** - Comprehensive validation using Joi
- **Error Handling** - Graceful error handling with proper JSON-RPC responses

## 📊 Monitoring & Health

### Health Check Endpoint
```bash
curl https://snackgpt-mcp-server.onrender.com/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-07T14:35:37.000Z",
  "service": "snackgpt-mcp-server",
  "version": "1.0.0",
  "uptime": 1234.567,
  "environment": "production"
}
```

## 🤖 Eliza AI Agent

Eliza is an intelligent AI agent that enhances recipe generation by:

- **Context Analysis** - Analyzes user mood, weather, and preferences
- **Prompt Engineering** - Optimizes prompts for better AI responses
- **Response Enhancement** - Post-processes AI responses for better quality
- **Adaptive Learning** - Adapts to user preferences over time

### Eliza Capabilities
- Recipe generation optimization
- Context-aware prompt engineering
- Mood and weather adaptation
- Style voice application
- Response quality enhancement

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. **Build the frontend:**
```bash
cd client
npm run build
```

2. **Deploy to Vercel:**
```bash
vercel --prod
```

### Backend Deployment (Render)
1. **Connect GitHub repository to Render**
2. **Create new Web Service**
3. **Configure environment variables:**
   - `OPENAI_API_KEY` - Your Comput3 API key
   - `NODE_ENV` - production
   - `CORS_ORIGIN` - Your frontend URL

## 📝 API Documentation

### MCP Endpoints

#### POST /mcp
Main MCP protocol endpoint supporting JSON-RPC 2.0.

**Methods:**
- `initialize` - Initialize MCP connection
- `$/invoke` - Invoke tools (suggest_dish)
- `$/ping` - Health check

#### GET /mcp
SSE endpoint for real-time communication.

#### GET /health
Health check endpoint for monitoring.

## 🔧 Development

### Running Tests
```bash
cd server
npm test
```

### Linting
```bash
cd server
npm run lint
```

### Environment Variables
See `server/env.example` for all available configuration options.

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Email**: kiranmurthynivas29@gmail.com

---

**Made with ❤️ for the MCP Hackathon by Team delta**
