# 🚀 Deployment Guide - Blueprint API Client

Guia completo para deploy da aplicação Blueprint API Client em produção.

## 📋 Pré-requisitos

- Conta no GitHub
- Node.js 18+
- Docker instalado
- Contas nas plataformas de hospedagem

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas configurações
nano .env
```

### 2. Repositório GitHub
```bash
# Inicializar Git
git init
git add .
git commit -m "Initial commit"

# Adicionar remote
git remote add origin https://github.com/seu-usuario/blueprint-api-client.git

# Push para main
git push -u origin main
```

## 🌐 Opções de Deploy

### Opção 1: Vercel + Railway (Recomendado)

**Custo:** $5/mês (após crédito gratuito)

#### Frontend no Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy do frontend
cd frontend
vercel --prod

# Responder perguntas:
# - Link ao projeto existente? N
# - Configurar domínio personalizado? Opcional
```

#### Backend no Railway
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login no Railway
railway login

# Criar projeto
railway create

# Deploy do backend
railway up --serviceless

# Configurar variáveis de ambiente
railway variables set NODE_ENV=production
railway variables set PORT=3001
```

### Opção 2: Render (Gratuito)

**Custo:** $0/mês (tier gratuito)

#### Deploy Completo
```bash
# Instalar Render CLI
npm i -g render-cli

# Login
render login

# Deploy usando configuração
render deploy --service-file render-service.yaml

# Ou deploy via dashboard
# 1. Acessar dashboard.render.com
# 2. Conectar repositório GitHub
# 3. Configurar serviço web
```

### Opção 3: GitHub Actions (CI/CD)

#### Configurar Secrets no GitHub
1. Acessar repositório > Settings > Secrets
2. Adicionar secrets:
   - `VERCEL_TOKEN`: Token do Vercel
   - `RAILWAY_TOKEN`: Token do Railway
   - `RENDER_TOKEN`: Token do Render

#### Deploy Automático
```bash
# Push para main branch
git push origin main

# GitHub Actions vai executar automaticamente
```

## 🔐 Segurança em Produção

### 1. CORS
```javascript
// server.js - Configuração de CORS para produção
const corsOptions = {
  origin: [
    'https://seu-dominio.vercel.app',
    'https://blueprint-client.vercel.app'
  ],
  credentials: true
};
```

### 2. Rate Limiting
```javascript
// Limite de 100 requests por hora por IP
const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 60 * 1000; // 1 hora
```

### 3. Variáveis de Ambiente
```bash
# Produção
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.vercel.app
PORT=3001

# Opcional: Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/blueprint
```

## 📊 Monitoramento

### Health Checks
```bash
# Endpoint de saúde
curl https://seu-backend.railway.app/health

# Response esperada
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "memory": { ... }
}
```

### Logs
```bash
# Railway
railway logs

# Render
render logs blueprint-backend

# Vercel
vercel logs
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. CORS Errors
```bash
# Verificar configuração de FRONTEND_URL
echo $FRONTEND_URL

# Testar CORS
curl -H "Origin: https://seu-dominio.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://seu-backend.railway.app/health
```

#### 2. Build Errors
```bash
# Limpar cache do npm
cd frontend && rm -rf node_modules package-lock.json
npm install

# Verificar versão do Node
node --version  # Deve ser 18+

# Build local para testar
npm run build
```

#### 3. Deploy Failures
```bash
# Verificar status dos serviços
railway status
render ps

# Verificar logs de erro
railway logs --tail 50
```

## 🎯 Boas Práticas

### 1. Versionamento
```bash
# Usar semantic versioning
git tag v1.0.0
git push origin v1.0.0
```

### 2. Branch Strategy
```bash
# main: produção
# develop: desenvolvimento
# feature/*: funcionalidades
```

### 3. Variáveis Sensíveis
```bash
# Nunca comitar secrets no código
# Usar sempre variáveis de ambiente
# Validar no .gitignore
echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
```

## 📈 Escalabilidade

### Horizontal Scaling
```yaml
# railway.toml
[[services]]
name = backend
scaling = {
  minInstances = 1,
  maxInstances = 10,
  targetMemoryPercent = 80
}
```

### Performance Optimization
```javascript
// Implementar cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Compressão de responses
app.use(compression());

// CDN para assets estáticos
const CDN_URL = process.env.CDN_URL || '';
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy commands
```

## 📱️ Pós-Deploy

### 1. Verificação
```bash
# Testar aplicação em produção
curl https://seu-dominio.vercel.app/health

# Testar funcionalidades principais
curl -X POST https://seu-backend.railway.app/api/request \
  -H "Content-Type: application/json" \
  -d '{"method":"GET","url":"https://api.github.com"}'
```

### 2. Monitoramento
```bash
# Configurar alertas
# Uptime monitoring
# Error tracking
# Performance metrics
```

### 3. Backup
```bash
# Backup das collections
curl https://seu-backend.railway.app/collections > backup.json

# Backup automatizado
0 2 * * * curl https://seu-backend.railway.app/collections >> /backup/collections-$(date +%Y%m%d).json
```

## 🆘 Suporte

### Documentação
- README.md atualizado
- API documentation
- Architecture decisions

### Comunidade
- Issues e PRs no GitHub
- Wiki com tutoriais
- Roadmap público

---

**Este guia cobre todo o necessário para colocar a Blueprint API Client em produção de forma segura e escalável.**
