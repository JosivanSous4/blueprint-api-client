# 🚀 Blueprint - Documentação Completa para Agentes de AI

## 📋 Overview do Projeto

Este é um clone funcional do Blueprint desenvolvido como aplicação web moderna para testar APIs REST. O projeto demonstra boas práticas de desenvolvimento React, arquitetura cliente-servidor, e UI/UX profissional.

### Propósito Principal

- Permitir desenvolvedores testarem endpoints HTTP
- Organizar requests em collections
- Salvar e documentar responses
- Fornecer alternativa open-source ao Blueprint

## 🏗️ Arquitetura Técnica

### Frontend (React 18)

```
frontend/
├── src/
│   ├── components/          # Componentes React funcionais
│   │   ├── RequestPanel.js     # Configuração de requests HTTP
│   │   ├── ResponsePanel.js    # Visualização de responses
│   │   ├── Sidebar.js          # Gestão de collections
│   │   ├── CodeEditor.js       # Monaco Editor integrado
│   │   └── ResponseHistory.js  # Histórico de responses
│   ├── contexts/            # React Context API
│   │   └── ThemeContext.js  # Gerenciamento de temas
│   ├── hooks/               # Custom React Hooks
│   │   └── useKeyboardShortcuts.js
│   ├── App.js              # Componente raiz
│   ├── App.css            # Estilos tema escuro
│   └── App-light.css      # Estilos tema claro
```

**Tecnologias Frontend:**

- **React 18**: Hooks, componentes funcionais, Context API
- **Monaco Editor**: VS Code editor para syntax highlighting
- **Axios**: Cliente HTTP para requests
- **React Icons**: Biblioteca de ícones
- **CSS Modules**: Estilos escopados
- **CSS Variables**: Sistema de temas dinâmico

### Backend (Node.js + Express)

```
backend/
├── server.js              # Servidor Express principal
├── collections.json       # Persistência de collections
├── saved_responses.json   # Persistência de responses
└── Dockerfile
```

**Tecnologias Backend:**

- **Express.js**: Framework web REST API
- **CORS**: Cross-origin resource sharing
- **File System**: Persistência em arquivos JSON
- **Axios**: Proxy de requests HTTP

### Containerização

- **Docker**: Multi-stage builds otimizados
- **Docker Compose**: Orquestração de múltiplos serviços
- **Port Mapping**: Frontend (3000), Backend (3001)

## 🎯 Funcionalidades Implementadas

### 1. Sistema de Requests

```javascript
// Estrutura de uma request
{
  id: timestamp,
  name: "User Registration",
  method: "POST",
  url: "https://api.example.com/users",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  },
  body: '{"name": "John", "email": "john@example.com"}',
  bodyType: "raw"
}
```

**Métodos HTTP Suportados:**

- GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- Seleção via dropdown visual
- Indicadores coloridos por método

**Headers Management:**

- Adicionar/remover headers dinamicamente
- Key-value pairs com validação
- Headers comuns pré-configurados

**Body Types:**

- **None**: Requests sem corpo
- **Raw**: JSON, XML, HTML, JavaScript, Text
- **Form Data**: Placeholder (não implementado)
- **x-www-form-urlencoded**: Placeholder
- **Binary**: Upload de arquivos básico

### 2. Sistema de Responses

```javascript
// Estrutura de uma response
{
  status: 200,
  statusText: "OK",
  headers: {
    "content-type": "application/json",
    "content-length": "1234"
  },
  data: { /* response data */ },
  time: "14:30:25",
  duration: 245, // ms
  error: false
}
```

**Visualização em Abas Laterais:**

- **Body**: Conteúdo da response com syntax highlighting
- **Headers**: Headers formatados como JSON
- **Info**: Metadados (status, tempo, tamanho)

**Redimensionamento Dinâmico:**

- Handle visual para redimensionar
- Drag para ajustar altura
- Estado persistido durante sessão

### 3. Collections System

```javascript
// Estrutura de collections
{
  collections: [
    {
      id: timestamp,
      name: "API Users",
      requests: [
        {
          id: timestamp,
          name: "Create User",
          method: "POST",
          url: "https://api.example.com/users",
          // ... outros campos
        },
      ],
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T12:00:00.000Z",
    },
  ];
}
```

**CRUD Operations:**

- **Create**: Nova collection com nome customizado
- **Read**: Listar todas collections
- **Update**: Renomear collections
- **Delete**: Remover collection com confirmação

**Request Management:**

- Adicionar requests a collections
- Carregar requests ao clicar
- Deletar requests individualmente
- Salvar requests automaticamente

### 4. Response History

```javascript
// Estrutura de response salva
{
  id: timestamp,
  name: "User List Response",
  response: {
    status: 200,
    data: [/* array */],
    headers: {/* headers */},
    time: "14:30:25",
    duration: 245
  },
  request_info: {
    method: "GET",
    url: "https://api.example.com/users",
    headers: {/* headers enviados */}
  },
  saved_at: "2024-01-01T14:30:25.000Z"
}
```

**Funcionalidades:**

- Salvar responses importantes
- Buscar responses por nome
- Visualizar em modal
- Carregar response para comparação
- Deletar responses individuais

### 5. UI/UX Avançada

**Sistema de Temas:**

- **Tema Escuro**: Default, cores escuras profissionais
- **Tema Claro**: Alternativa com cores claras
- **CSS Variables**: Mudança dinâmica de cores
- **Persistência**: Tema salvo no localStorage

**Atalhos de Teclado:**

```javascript
// Mapeamento de atalhos
{
  "Ctrl+Enter": "Enviar request",
  "Ctrl+S": "Salvar na collection",
  "Ctrl+Shift+S": "Salvar response",
  "Ctrl+L": "Focar URL",
  "Ctrl+Shift+T": "Alternar tema"
}
```

**Layout Responsivo:**

- Desktop: Layout completo com todas funcionalidades
- Tablet: Adaptação de elementos
- Mobile: Versão simplificada

## 🔧 Detalhes Técnicos

### Component Architecture

**RequestPanel.js:**

```javascript
// Estado local
const [activeRequestTab, setActiveRequestTab] = useState("headers");
const [bodyRawType, setBodyRawType] = useState("json");
const [isResizing, setIsResizing] = useState(false);
const [editorHeight, setEditorHeight] = useState(200);

// Funcionalidades principais
- Gerenciar método HTTP e URL
- Configurar headers dinamicamente
- Editar body com Monaco Editor
- Redimensionamento via drag
```

**ResponsePanel.js:**

```javascript
// Estado local
const [activeTab, setActiveTab] = useState("body");
const [responseName, setResponseName] = useState("");
const [isResizing, setIsResizing] = useState(false);

// Funcionalidades principais
- Exibir response em abas laterais
- Syntax highlighting automático
- Salvar/copiar/baixar response
- Redimensionamento dinâmico
```

**Sidebar.js:**

```javascript
// Estado local
const [expandedCollections, setExpandedCollections] = useState({});
const [contextMenu, setContextMenu] = useState(null);
const [editingCollection, setEditingCollection] = useState(null);

// Funcionalidades principais
- Listar collections com expansão
- Menu de contexto para CRUD
- Import/export de collections
- Adicionar novas requests
```

### State Management

**Estado Global (App.js):**

```javascript
// Principais estados
const [collections, setCollections] = useState({ collections: [] });
const [savedResponses, setSavedResponses] = useState({ saved_responses: [] });
const [activeCollectionId, setActiveCollectionId] = useState(null);
const [currentRequest, setCurrentRequest] = useState({
  /* request atual */
});
const [response, setResponse] = useState(null);
const [activeTab, setActiveTab] = useState("request");
```

**Fluxo de Dados:**

1. User action → Component state
2. Component state → App.js (via props/callbacks)
3. App.js → Backend (API calls)
4. Backend → File system (JSON)
5. Backend response → App state update
6. App state → Component re-render

### Theme System

**CSS Variables Structure:**

```css
/* Tema escuro (default) */
:root {
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #252526;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --accent-color: #61dafb;
  --border-color: #3d3d3d;
}

/* Tema claro */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --accent-color: #007acc;
  --border-color: #dee2e6;
}
```

## 🚀 Setup e Deploy

### Desenvolvimento Local

```bash
# Pré-requisitos
Node.js 18+, Docker, Docker Compose

# Frontend
cd frontend
npm install
npm start  # Porta 3000

# Backend
cd backend
npm install
npm start  # Porta 3001
```

### Docker (Produção)

```bash
# Build e deploy
docker-compose up -d --build

# Serviços
- frontend: Node.js Alpine, port 3000
- backend: Node.js Alpine, port 3001
- volumes: persistência de dados
```

### Environment Variables

```bash
# Frontend
REACT_APP_API_URL=http://localhost:3001

# Backend (se necessário)
PORT=3001
NODE_ENV=production
```

## 📊 API Endpoints

### Collections Management

```javascript
// GET /collections
// Response: { collections: [...] }
// Lista todas collections salvas

// POST /collections
// Body: { collections: [...] }
// Salva estrutura completa de collections

// DELETE /collections/:id
// Params: id (collection ID)
// Remove collection específica
```

### Request Execution

```javascript
// POST /api/request
// Body: {
//   method: "GET",
//   url: "https://api.example.com",
//   headers: { "key": "value" },
//   body: "request body"
// }
// Response: { status, data, headers, time, duration }
```

### Saved Responses

```javascript
// GET /saved-responses
// Response: { saved_responses: [...] }
// Lista responses salvas

// POST /saved-responses
// Body: { saved_responses: [...] }
// Salva nova response

// DELETE /saved-responses/:id
// Params: id (response ID)
// Remove response salva
```

## 🐛 Issues Conhecidos e Limitações

### Limitações Técnicas

1. **Form Data**: Apenas UI placeholder, sem implementação real
2. **File Upload**: Upload básico, sem multipart completo
3. **Environment Variables**: Sem sistema de variáveis
4. **Test Scripts**: Sem suporte a scripts pós-request
5. **WebSocket**: Sem suporte a conexões WebSocket
6. **Large Responses**: Performance degradada acima de 10MB

### Bugs Conhecidos

1. **Memory Leak**: Possível leak em requests de longa duração
2. **Mobile Layout**: Quebras em dispositivos < 320px
3. **Monaco Editor**: Às vezes não carrega syntax highlighting
4. **Theme Persistence**: Raro não salvar tema no localStorage

### Performance Issues

1. **Large Collections**: Carregamento lento com >1000 requests
2. **JSON Parsing**: Timeout com responses muito grandes
3. **Re-renders**: Excesso de renders em Sidebar

## 🔮 Roadmap e Features Futuras

### High Priority (Próximas 2-3 semanas)

- [ ] **Environment Variables**: Sistema completo de variáveis
- [ ] **Form Data Support**: Implementação real de multipart
- [ ] **URL History**: Autocomplete baseado em histórico
- [ ] **Test Scripts**: JavaScript pós-request
- [ ] **GraphQL Support**: Query builder e syntax highlighting

### Medium Priority (Próximos 2-3 meses)

- [ ] **WebSocket Testing**: Conexões WebSocket em tempo real
- [ ] **Mock Servers**: Servidores mock integrados
- [ ] **API Documentation**: Geração automática de docs
- [ ] **Performance Metrics**: Gráficos de tempo de resposta
- [ ] **Team Collaboration**: Compartilhamento em tempo real

### Low Priority (Futuro distante)

- [ ] **Plugins System**: Arquitetura extensível
- [ ] **Custom Themes**: Editor visual de temas
- [ ] **Blueprint Import**: Migrar collections existentes
- [ ] **CLI Tool**: Interface de linha de comando
- [ ] **Desktop App**: Versão Electron desktop

## 🤝 Guia para Contribuição

### Setup de Desenvolvimento

```bash
# 1. Fork e clone
git clone https://github.com/user/Blueprint-clone.git
cd Blueprint-clone

# 2. Criar branch
git checkout -b feature/nova-funcionalidade

# 3. Desenvolvimento
npm install
npm start
# Desenvolver com testes

# 4. Commit e push
git add .
git commit -m "feat: add nova funcionalidade"
git push origin feature/nova-funcionalidade

# 5. Pull Request
# Criar PR com descrição detalhada
```

### Padrões de Código

```javascript
// Componentes funcionais
const Component = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Efeitos colaterais
  }, [dependencies]);

  return <div>{/* JSX */}</div>;
};

// Nomenclatura
- Components: PascalCase (RequestPanel)
- Functions: camelCase (handleClick)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)
- Files: kebab-case (request-panel.js)
```

### Code Style

- **ESLint**: Configuração padrão React
- **Prettier**: Formatação automática (2 espaços)
- **Convenções**: React hooks patterns
- **Imports**: Agrupados e ordenados

## 📞 Suporte e Contato

### Para Agentes de AI

Este documento serve como referência completa para:

1. **Entender Arquitetura**: Cliente-servidor React+Node.js
2. **Navegar Código**: Estrutura de componentes e pastas
3. **Identificar Padrões**: React hooks, Context API, CSS Modules
4. **Estender Funcionalidades**: Base para novas features
5. **Resolver Issues**: Conhecimento de limitações e bugs

### Pontos Críticos

- **Estado Centralizado**: App.js como single source of truth
- **Componentização**: Componentes pequenos e reutilizáveis
- **Performance**: Lazy loading e memoização onde necessário
- **Acessibilidade**: Semântica HTML e ARIA labels
- **Responsividade**: Mobile-first design

### Fluxos Principais

1. **Request → Response**: RequestPanel → Backend → ResponsePanel
2. **Collections**: Sidebar ↔ App.js ↔ Backend JSON
3. **Themes**: ThemeContext → Componentes → CSS Variables
4. **Persistence**: Backend files ←→ Frontend state

Este é um projeto educacional que demonstra desenvolvimento React moderno, com foco em código limpo, UI/UX profissional e arquitetura escalável.
