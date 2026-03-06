#!/bin/bash

# 🚀 Blueprint API Client Deployment Script
# Script para deploy automatizado em múltiplas plataformas

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de utilidade
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar pré-requisitos
check_prerequisites() {
    log_info "Verificando pré-requisitos..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js não encontrado. Instale Node.js 18+"
        exit 1
    fi
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker não encontrado. Instale Docker"
        exit 1
    fi
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        log_error "Git não encontrado. Instale Git"
        exit 1
    fi
    
    log_success "Pré-requisitos verificados"
}

# Configurar ambiente
setup_environment() {
    log_info "Configurando ambiente..."
    
    if [ ! -f ".env" ]; then
        log_warning "Arquivo .env não encontrado. Criando a partir do exemplo..."
        cp .env.example .env
        log_warning "Edite o arquivo .env com suas configurações"
        read -p "Pressione Enter para continuar..."
    fi
    
    log_success "Ambiente configurado"
}

# Menu de deploy
deploy_menu() {
    echo -e "\n${BLUE}🚀 Blueprint API Client - Deployment Menu${NC}"
    echo "=================================="
    echo "1. Vercel (Frontend) + Railway (Backend)"
    echo "2. Render (Full Stack)"
    echo "3. GitHub Actions (CI/CD)"
    echo "4. Docker Compose (Local)"
    echo "5. Sair"
    echo "=================================="
    
    read -p "Escolha uma opção [1-5]: " choice
    
    case $choice in
        1)
            deploy_vercel_railway
            ;;
        2)
            deploy_render
            ;;
        3)
            setup_github_actions
            ;;
        4)
            deploy_local
            ;;
        5)
            log_info "Saindo..."
            exit 0
            ;;
        *)
            log_error "Opção inválida"
            deploy_menu
            ;;
    esac
}

# Deploy para Vercel + Railway
deploy_vercel_railway() {
    log_info "Iniciando deploy para Vercel + Railway..."
    
    # Verificar Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_info "Instalando Vercel CLI..."
        npm install -g vercel
    fi
    
    # Verificar Railway CLI
    if ! command -v railway &> /dev/null; then
        log_info "Instalando Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Deploy frontend
    log_info "Fazendo deploy do frontend para Vercel..."
    cd frontend
    vercel --prod
    
    # Deploy backend
    log_info "Fazendo deploy do backend para Railway..."
    cd ../backend
    railway up --serviceless
    
    log_success "Deploy concluído!"
    log_info "Frontend: https://blueprint-client.vercel.app"
    log_info "Backend: Verifique dashboard Railway"
}

# Deploy para Render
deploy_render() {
    log_info "Iniciando deploy para Render..."
    
    # Verificar Render CLI
    if ! command -v render &> /dev/null; then
        log_info "Instalando Render CLI..."
        npm install -g render-cli
    fi
    
    # Deploy
    log_info "Fazendo deploy para Render..."
    render deploy --service-file render-service.yaml
    
    log_success "Deploy concluído!"
    log_info "Acesse https://dashboard.render.com"
}

# Configurar GitHub Actions
setup_github_actions() {
    log_info "Configurando GitHub Actions..."
    
    echo -e "${YELLOW}Configure os seguintes secrets no seu repositório GitHub:${NC}"
    echo "- VERCEL_TOKEN: Token do Vercel"
    echo "- RAILWAY_TOKEN: Token do Railway"
    echo "- RENDER_TOKEN: Token do Render"
    echo ""
    echo -e "${BLUE}Passos:${NC}"
    echo "1. Vá para Settings > Secrets no seu repositório"
    echo "2. Adicione os 3 secrets acima"
    echo "3. Faça push para main branch"
    echo ""
    
    log_success "GitHub Actions configurado!"
    log_info "Faça git push origin main para ativar o deploy automático"
}

# Deploy local com Docker
deploy_local() {
    log_info "Iniciando deploy local com Docker..."
    
    # Parar containers existentes
    docker-compose down
    
    # Build e iniciar
    docker-compose up -d --build
    
    log_success "Aplicação rodando localmente!"
    log_info "Frontend: http://localhost:3000"
    log_info "Backend: http://localhost:3001"
    log_info "Health: http://localhost:3001/health"
}

# Testar deploy
test_deploy() {
    log_info "Testando deploy..."
    
    # Verificar se frontend está no ar
    if curl -s http://localhost:3000 > /dev/null; then
        log_success "Frontend está respondendo"
    else
        log_warning "Frontend não está respondendo"
    fi
    
    # Verificar se backend está no ar
    if curl -s http://localhost:3001/health > /dev/null; then
        log_success "Backend está respondendo"
    else
        log_warning "Backend não está respondendo"
    fi
}

# Função principal
main() {
    echo -e "${GREEN}🚀 Blueprint API Client Deployment Script${NC}"
    echo "=================================="
    
    check_prerequisites
    setup_environment
    deploy_menu
}

# Executar script
main "$@"
