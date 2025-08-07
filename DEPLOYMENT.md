# SnackGPT Deployment Guide

## 🚀 Quick Deployment

### Prerequisites

- Node.js 18+
- npm or yarn
- Comput3 API key
- Git

### Local Development

1. **Clone and setup:**
```bash
git clone <your-repo-url>
cd snackgpt
chmod +x scripts/setup.sh
./scripts/setup.sh
```

2. **Configure environment:**
```bash
# Edit server/.env
OPENAI_API_KEY=your_comput3_api_key
OPENAI_API_URL=https://api.comput3.ai/v1
PORT=3001
NODE_ENV=development
```

3. **Start development servers:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🌐 Production Deployment

### Frontend Deployment (Vercel)

1. **Build the frontend:**
```bash
cd client
npm run build
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

3. **Configure environment variables in Vercel:**
- `REACT_APP_API_URL`: Your backend URL

### Backend Deployment (Railway/Render)

1. **Prepare for deployment:**
```bash
cd server
npm install --production
```

2. **Deploy to Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

3. **Configure environment variables:**
```bash
railway variables set OPENAI_API_KEY=your_comput3_api_key
railway variables set OPENAI_API_URL=https://api.comput3.ai/v1
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Alternative: Render Deployment

1. **Connect your GitHub repository to Render**

2. **Create a new Web Service**

3. **Configure the service:**
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Environment Variables:**
     ```
     OPENAI_API_KEY=your_comput3_api_key
     OPENAI_API_URL=https://api.comput3.ai/v1
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-domain.vercel.app
     ```

## 🔧 Environment Configuration

### Required Environment Variables

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
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# MCP Configuration
MCP_VERSION=2024-11-05
MCP_SERVER_NAME=snackgpt
MCP_SERVER_VERSION=1.0.0
```

### Optional Environment Variables

```bash
# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

## 📊 Monitoring and Logging

### Health Checks

The server provides a health check endpoint:
```
GET /health
```

### Logging

Logs are automatically generated and can be viewed:
- **Development:** Console output
- **Production:** Platform-specific logging (Railway, Render, etc.)

### Error Monitoring

Consider integrating error monitoring services:
- Sentry
- LogRocket
- Bugsnag

## 🔒 Security Considerations

### Production Security

1. **HTTPS Only:** Ensure all production deployments use HTTPS
2. **CORS Configuration:** Set appropriate CORS origins
3. **Rate Limiting:** Implement rate limiting for API endpoints
4. **Input Validation:** All inputs are validated using Joi schemas
5. **Error Handling:** Sensitive information is not exposed in error messages

### API Key Security

1. **Environment Variables:** Never commit API keys to version control
2. **Rotation:** Regularly rotate your Comput3 API key
3. **Access Control:** Limit API key access to necessary services only

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test
```

### Manual Testing

1. **Health Check:**
```bash
curl http://localhost:3001/health
```

2. **MCP Initialize:**
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

3. **Recipe Generation:**
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "$/invoke",
    "params": {
      "name": "suggest_dish",
      "arguments": {
        "ingredients": ["banana", "pasta"],
        "mood": "happy",
        "weather": "sunny",
        "style": "five_year_old"
      }
    }
  }'
```

## 📈 Performance Optimization

### Frontend Optimization

1. **Code Splitting:** React Router and dynamic imports
2. **Image Optimization:** Use WebP format and lazy loading
3. **Bundle Analysis:** Regular bundle size monitoring
4. **Caching:** Implement proper caching strategies

### Backend Optimization

1. **Response Caching:** Cache AI responses when appropriate
2. **Connection Pooling:** Optimize database connections
3. **Compression:** Enable gzip compression
4. **Rate Limiting:** Prevent abuse

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy SnackGPT

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm run install-all
        
      - name: Run tests
        run: npm test
        
      - name: Build frontend
        run: cd client && npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./client
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check CORS_ORIGIN configuration
   - Ensure frontend and backend URLs match

2. **API Key Issues:**
   - Verify Comput3 API key is valid
   - Check API key permissions

3. **Port Conflicts:**
   - Change PORT in environment variables
   - Check if ports 3000/3001 are available

4. **Build Failures:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Support

For deployment issues:
- Check platform-specific documentation
- Review error logs
- Contact platform support

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and responding to health checks
- [ ] MCP endpoint responding correctly
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] SSL certificates configured
- [ ] Monitoring and logging set up
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Documentation updated with production URLs
