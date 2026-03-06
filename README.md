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

## 🚀 Roadmap & TODO

### Versão 1.1 - Próximo Release

- [ ] **Import/Export Avançado**
  - [ ] Suporte para Postman Collections
  - [ ] Import de cURL commands
  - [ ] Export para múltiplos formatos (JSON, YAML, CSV)

- [ ] **Ambientes de Trabalho**
  - [ ] Switch entre Development/Staging/Production
  - [ ] Variáveis de ambiente globais
  - [ ] Configuração de domínios por ambiente

- [ ] **Autenticação & Autorização**
  - [ ] Suporte OAuth 2.0
  - [ ] API Key management
  - [ ] JWT token refresh automático
  - [ ] Basic Auth, Bearer Token, API Key

### Versão 1.2 - Colaboração

- [ ] **Workspace em Equipe**
  - [ ] Compartilhamento de collections
  - [ ] Permissões por usuário (view/edit/admin)
  - [ ] Histórico de alterações
  - [ ] Comments em requests

- [ ] **Sincronização em Nuvem**
  - [ ] Backup automático
  - [ ] Sync entre dispositivos
  - [ ] Versionamento de collections
  - [ ] Conflict resolution

### Versão 1.3 - Performance & UX

- [ ] **Performance Avançada**
  - [ ] Request chaining (sequenciamento)
  - [ ] Batch requests
  - [ ] Request templates
  - [ ] Auto-save automático

- [ ] **Interface Aprimorada**
  - [ ] Dark/Light theme toggle
  - [ ] Custom themes
  - [ ] Layout responsivo avançado
  - [ ] Shortcuts personalizáveis
  - [ ] Drag & drop de requests

### Versão 2.0 - Enterprise Features

- [ ] **API Testing Avançado**
  - [ ] GraphQL support
  - [ ] WebSocket testing
  - [ ] gRPC support
  - [ ] Mock server integrado
  - [ ] Performance testing

- [ ] **Integrações**
  - [ ] Git integration (version control)
  - [ ] CI/CD pipeline integration
  - [ ] Slack/Discord notifications
  - [ ] Jira integration
  - [ ] Swagger/OpenAPI import

- [ ] **Analytics & Monitoring**
  - [ ] Request analytics dashboard
  - [ ] Performance metrics
  - [ ] Error tracking
  - [ ] Usage statistics
  - [ ] Custom reports

### Versão 2.1 - Mobile & Desktop

- [ ] **Aplicações Nativas**
  - [ ] Mobile app (React Native)
  - [ ] Desktop app (Electron)
  - [ ] Browser extension
  - [ ] CLI tool

- [ ] **Offline Support**
  - [ ] PWA functionality
  - [ ] Offline mode
  - [ ] Sync quando online
  - [ ] Cache inteligente

### Versão 3.0 - AI & Automation

- [ ] **AI-Powered Features**
  - [ ] Auto-completion de APIs
  - [ ] Request optimization suggestions
  - [ ] Error analysis AI
  - [ ] Test case generation
  - [ ] Documentation assistant

- [ ] **Automation**
  - [ ] Visual workflow builder
  - [ ] Scheduled requests
  - [ ] Webhook support
  - [ ] Custom scripts
  - [ ] Macro recording

## 🤝 Contribuição para o Roadmap

### Como Contribuir

1. **Issues**: Abra uma issue descrevendo a feature
2. **Discussion**: Comente no roadmap para priorização
3. **Pull Request**: Implemente a feature com testes
4. **Documentation**: Atualize docs para novas features

### Labels de Issues

- `enhancement`: Novas funcionalidades
- `bug`: Correções de bugs
- `performance`: Melhorias de performance
- `documentation`: Atualizações na docs
- `good first issue`: Bom para iniciantes

### Processo de Desenvolvimento

1. **Planning**: Issue triage e priorização
2. **Development**: Implementação com testes
3. **Review**: Code review e feedback
4. **Testing**: QA e testes de aceitação
5. **Release**: Deploy e documentação

---

**Made with ❤️ for the developer community**
