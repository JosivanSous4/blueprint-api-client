# Blueprint - Professional API Client for Developers

A professional API testing tool built with React and Node.js.

## Features

- HTTP methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- Custom headers management
- Request body support (JSON, form data)
- Collections to organize requests
- Save and load requests
- Export/Import collections as JSON
- Beautiful dark theme interface
- Docker support
- Rate limiting and security
- Production-ready deployment configs

## Quick Start with Docker

1. Make sure Docker and Docker Compose are installed
2. Run the application:
   ```bash
   docker-compose up -d
   ```

## Deployment Options

### 🚀 Option 1: Vercel + Railway (Recommended)

**Frontend on Vercel (Free)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Backend on Railway ($5/month)**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy backend
railway login
railway up
```

### 🚀 Option 2: Render (Free Tier)

**Full Stack on Render**

```bash
# Install Render CLI
npm i -g render-cli

# Deploy using render-service.yaml
render deploy
```

### 🚀 Option 3: GitHub Actions (CI/CD)

**Automatic Deploy on Push**

1. Fork this repository
2. Add secrets to your GitHub repo:
   - `VERCEL_TOKEN`
   - `RAILWAY_TOKEN`
   - `RENDER_TOKEN`
3. Push to main branch

## Environment Setup

1. Copy `.env.example` to `.env`
2. Configure your environment variables:
   ```bash
   cp .env.example .env
   ```

### Required Variables

- `NODE_ENV`: development or production
- `PORT`: Backend port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS

### Optional Variables

- `MONGODB_URI`: For external database
- `REDIS_URL`: For caching
- `JWT_SECRET`: For authentication

## Development Setup

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Local Development

```bash
# Clone repository
git clone https://github.com/your-username/blueprint-api-client.git
cd blueprint-api-client

# Setup environment
cp .env.example .env

# Start with Docker
docker-compose up -d

# Or start individually
cd backend && npm start
cd frontend && npm start
```

## Production Deployment

### Security Features

- Rate limiting (100 requests/hour)
- CORS configuration
- Input validation
- Error handling
- Health checks
- Graceful shutdown

### Monitoring

- Health endpoint: `/health`
- Memory usage tracking
- Uptime monitoring
- Error logging

### Performance Optimizations

- Gzip compression
- Static asset caching
- Lazy loading
- Bundle optimization

## API Endpoints

### Collections Management

- `GET /collections` - List all collections
- `POST /collections` - Save collections
- `DELETE /collections/:id` - Delete collection

### Saved Responses

- `GET /saved-responses` - List saved responses
- `POST /saved-responses` - Save response
- `DELETE /saved-responses/:id` - Delete response

### Request Proxy

- `POST /api/request` - Proxy HTTP requests

## Cost Comparison

| Platform            | Frontend | Backend | Database | Total/Month |
| ------------------- | -------- | ------- | -------- | ----------- |
| Vercel + Railway    | $0       | $5      | $5       |
| Render (Full Stack) | $0       | $0      | $0       |
| Netlify + Heroku    | $0       | $7      | $7       |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

- 📧 Issues: [GitHub Issues](https://github.com/your-username/blueprint-api-client/issues)
- 📖 Documentation: [Wiki](https://github.com/your-username/blueprint-api-client/wiki)
- 🚀 Live Demo: [https://blueprint-client.vercel.app](https://blueprint-client.vercel.app)

---

**Made with ❤️ for the developer community**
