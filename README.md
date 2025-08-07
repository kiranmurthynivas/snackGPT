# 🍽️ SnackGPT - AI-Powered Recipe Generator

**Fun AI recipe generator that responds to fridge items, mood, and weather using the MCP protocol. Features Eliza AI agent for intelligent context analysis and enhanced recipe generation with different cooking styles like Shakespeare, Gordon Ramsay, or 5-year-old voice.**

[![MCP Protocol](https://img.shields.io/badge/MCP-Protocol-blue)](https://modelcontextprotocol.io/)
[![Eliza AI Agent](https://img.shields.io/badge/Eliza-AI%20Agent-purple)](https://github.com/your-username/snackgpt)
[![Comput3 AI](https://img.shields.io/badge/Comput3-AI-green)](https://comput3.ai/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

## ✨ Features

### 🎯 Core Features
- **AI-Powered Recipe Generation** - Create unique recipes from your available ingredients
- **Eliza AI Agent Integration** - Intelligent context analysis and enhanced prompt engineering
- **Mood-Based Cooking** - Recipes adapt to your current emotional state (happy, tired, sad, excited, stressed)
- **Weather-Aware Recipes** - Cooking suggestions based on weather conditions (sunny, rainy, cloudy, snowy, windy)
- **Multiple Cooking Styles** - Choose from Shakespeare, Gordon Ramsay, or 5-year-old voice
- **MCP-Compliant Protocol** - Full JSON-RPC 2.0 implementation for AI tool communication

### 🆕 New Features (Latest Update)

#### 🕒 **Cooking Timer & Instructions**
- **Step-by-step timer** with automatic time detection from instructions
- **Progress tracking** with visual progress bars
- **Step completion** with checkmarks and animations
- **Skip and reset** functionality for flexible cooking
- **Voice-guided cooking** with real-time feedback

#### 🍎 **Nutrition Information**
- **Calorie estimation** with visual indicators (Low/Medium/High)
- **Macronutrient breakdown** (Protein, Carbs, Fat, Fiber)
- **Nutrition grade** (A, B, C, D) based on recipe healthiness
- **Daily value percentages** for each nutrient
- **Serving size adjustment** with automatic recalculation

#### 📚 **Recipe History & Favorites**
- **Persistent storage** using localStorage
- **Recipe history** with timestamps and metadata
- **Favorite recipes** with heart icons and filtering
- **Quick access** to previous recipes
- **Delete and manage** your recipe collection

#### 📊 **Enhanced Recipe Display**
- **Difficulty level** assessment (Easy/Medium/Hard)
- **Estimated cooking time** calculation
- **Servings adjustment** with +/- controls
- **AI analysis metadata** display
- **Enhanced sharing** with social media integration

#### 🔄 **Advanced Interactions**
- **Copy recipe** to clipboard with confirmation
- **Share recipes** via native sharing or social media
- **Recipe comparison** and rating system

## 🏗️ Architecture

### Frontend (React + Tailwind CSS + Framer Motion)
```
client/
├── src/
│   ├── components/
│   │   ├── RecipeForm.js          # Main form component
│   │   ├── RecipeCard.js          # Enhanced recipe display
│   │   ├── CookingTimer.js        # Step-by-step cooking timer
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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Comput3 API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/snackgpt.git
cd snackgpt
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment**
```bash
# Copy environment template
cp server/env.example server/.env

# Edit server/.env and add your Comput3 API key
OPENAI_API_KEY=your_comput3_api_key_here
```

4. **Start the application**
```bash
npm run dev
```

5. **Open in browser**
- Frontend: http://localhost:3000
- Backend MCP: http://localhost:3001/mcp

## 🎮 Usage

### Basic Recipe Generation
1. **Enter ingredients** in the text area
2. **Select your mood** (happy, tired, sad, excited, stressed)
3. **Choose weather** (sunny, rainy, cloudy, snowy, windy)
4. **Pick cooking style** (Shakespeare, Gordon Ramsay, 5-year-old)
5. **Generate recipe** and enjoy!

### Cooking Timer
- Click **"Cooking Timer"** on any recipe
- Follow step-by-step instructions with automatic timing
- Track progress with visual indicators
- Skip steps or reset as needed

### Recipe Management
- **View history** using the floating book icon
- **Favorite recipes** by clicking the heart icon
- **Load previous recipes** from history
- **Delete recipes** you no longer need

## 🤖 Eliza AI Agent

SnackGPT features a sophisticated **Eliza AI agent** that acts as an intelligent intermediary between the MCP server and Comput3 AI:

### Agent Capabilities
- **Context Analysis** - Analyzes mood, weather, and style preferences
- **Prompt Engineering** - Creates context-aware prompts for better recipes
- **Response Validation** - Ensures quality and completeness of AI responses
- **Mood Analysis** - Processes emotional state for recipe adaptation
- **Weather Adaptation** - Suggests weather-appropriate cooking methods

### Agent Workflow
1. **User Request** → MCP Server
2. **MCP Server** → Eliza Agent
3. **Eliza Agent** → Context Analysis (mood, weather, style)
4. **Eliza Agent** → Enhanced Prompt Generation
5. **Eliza Agent** → Comput3 AI (with optimized prompt)
6. **Eliza Agent** → Response Validation & Enhancement
7. **Eliza Agent** → MCP Server → User

## 🔧 MCP Protocol

SnackGPT implements the **Model Context Protocol (MCP)** for AI tool communication:

### Endpoints
- **POST /mcp** - MCP JSON-RPC 2.0 requests
- **GET /mcp** - Server-Sent Events (SSE) for real-time communication
- **GET /health** - Health check endpoint

### Methods
- **`initialize`** - Server capability advertisement
- **`$/invoke`** - Tool execution (suggest_dish)
- **`$/ping`** - Connection testing

### Tool Schema
```json
{
  "name": "suggest_dish",
  "description": "Generates a creative dish based on user ingredients, mood, and weather using Eliza AI agent for context analysis and enhanced prompt engineering.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ingredients": {
        "type": "array",
        "items": { "type": "string" },
        "description": "List of available ingredients"
      },
      "mood": {
        "type": "string",
        "enum": ["happy", "tired", "sad", "excited", "stressed"],
        "description": "User's current mood"
      },
      "weather": {
        "type": "string",
        "enum": ["sunny", "rainy", "cloudy", "snowy", "windy"],
        "description": "Current weather conditions"
      },
      "style": {
        "type": "string",
        "enum": ["shakespeare", "gordon_ramsay", "five_year_old"],
        "description": "Cooking style voice"
      }
    },
    "required": ["ingredients"]
  }
}
```

## 🎨 Design System

### Color Palette
- **Mint** (`#4ade80`) - Primary actions, success states
- **Pink** (`#ec4899`) - Secondary actions, highlights
- **Lemon** (`#fbbf24`) - Accents, warnings
- **Gray** (`#6b7280`) - Text, borders

### Typography
- **Fredoka One** - Headings, titles
- **Pacifico** - Decorative elements
- **Inter** - Body text, UI elements

### Animations
- **Framer Motion** - Smooth transitions and micro-interactions
- **Custom keyframes** - Floating ingredients, cooking animations
- **Hover effects** - Interactive feedback

## 📊 Performance

### Frontend
- **React 18** with concurrent features
- **Tailwind CSS** for optimized styling
- **Framer Motion** for 60fps animations
- **LocalStorage** for offline recipe storage

### Backend
- **Node.js** with Express.js
- **JSON-RPC 2.0** for efficient communication
- **Eliza AI agent** for intelligent processing
- **Comput3 AI** integration for recipe generation

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway/Render)
```bash
# Set environment variables
OPENAI_API_KEY=your_key
PORT=3001
NODE_ENV=production

# Deploy
railway up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aya MCP Hackathon** - For the amazing opportunity
- **Eliza AI Agent** - Intelligent recipe enhancement
- **Comput3 AI** - Powerful recipe generation
- **Framer Motion** - Beautiful animations
- **Tailwind CSS** - Utility-first styling

## 📞 Support

- **Email**: snackgpt@example.com
- **GitHub**: [Issues](https://github.com/your-username/snackgpt/issues)
- **Documentation**: [Wiki](https://github.com/your-username/snackgpt/wiki)

---

**Made with ❤️ for the Aya MCP Hackathon**

*Powered by Eliza AI Agent & Comput3 AI*
