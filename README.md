# 🚀 FastFood Tables - Backend API

API REST robusta e segura para gerenciamento de mesas de restaurantes fastfood, construída com NestJS, Prisma e PostgreSQL.

## 🛠️ Stack Tecnológica

- **Framework:** NestJS 10.x
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT + Passport
- **Real-time:** Socket.io
- **Security:** Helmet, Rate Limiting, Input Sanitization
- **Validation:** Class-validator + Class-transformer
- **Language:** TypeScript (strict mode)

## 🔧 Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env

# Configurar banco de dados
npx prisma migrate dev

# Popular banco com dados iniciais
npm run prisma:seed

# Iniciar em modo desenvolvimento
npm run start:dev
```

## 🔐 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fastfood_tables"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_EXPIRES_IN="24h"

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Server
PORT=3001
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia com hot-reload
npm run start:debug        # Inicia em modo debug

# Produção
npm run build              # Compila o projeto
npm run start:prod         # Inicia versão compilada

# Database
npm run prisma:generate    # Gera cliente Prisma
npm run prisma:migrate     # Executa migrações
npm run prisma:studio      # Interface visual do banco
npm run prisma:seed        # Popula banco com dados iniciais

# Qualidade de Código
npm run lint               # Executa ESLint
npm run format             # Formata código com Prettier
npm run test               # Executa testes unitários
npm run test:e2e           # Executa testes e2e
```

## 🏗️ Arquitetura

```
src/
├── auth/                  # Autenticação e autorização
│   ├── decorators/        # Decorators customizados
│   ├── dto/              # Data Transfer Objects
│   ├── guards/           # Guards de autenticação
│   └── strategies/       # Estratégias Passport
├── config/               # Configurações
├── filters/              # Filtros globais
├── interceptors/         # Interceptors
├── types/                # Tipos TypeScript
├── gateway/              # WebSocket Gateway
├── orders/               # Módulo de pedidos
├── reservations/         # Módulo de reservas
├── tables/               # Módulo de mesas
├── queue/                # Módulo de fila
└── users/                # Módulo de usuários
```

## 🔒 Recursos de Segurança

### Autenticação
- JWT com expiração configurável
- Senhas hasheadas com bcrypt (12 rounds)
- Validação de força de senha
- Proteção contra ataques de força bruta

### Rate Limiting
- 100 requisições por 15 minutos por IP
- Proteção contra DDoS
- Headers informativos

### Headers de Segurança
- Helmet.js configurado
- Content Security Policy
- XSS Protection
- CSRF Protection

### Sanitização
- Input sanitization automática
- Remoção de scripts maliciosos
- Validação de tipos estritos
- Filtros de dados sensíveis

## 📡 Endpoints da API

### Autenticação
```
POST /auth/login          # Login de usuário
POST /auth/register       # Registro de usuário
```

### Mesas
```
GET    /tables            # Listar todas as mesas
GET    /tables/available  # Mesas disponíveis
POST   /tables            # Criar mesa (ADMIN)
PATCH  /tables/:id/status # Atualizar status (ADMIN)
```

### Reservas
```
GET    /reservations      # Listar reservas
POST   /reservations      # Criar reserva
DELETE /reservations/:id  # Cancelar reserva
```

### Pedidos
```
GET    /orders            # Listar pedidos
POST   /orders            # Criar pedido
PATCH  /orders/:id/status # Atualizar status
```

### Fila
```
GET    /queue             # Listar fila
POST   /queue/join        # Entrar na fila
DELETE /queue/leave       # Sair da fila
```

## 🔌 WebSocket Events

### Cliente → Servidor
- `join-room` - Entrar em sala
- `leave-room` - Sair da sala
- `get-tables` - Buscar mesas
- `get-reservations` - Buscar reservas
- `get-orders` - Buscar pedidos
- `get-queue` - Buscar fila

### Servidor → Cliente
- `tables-updated` - Mesas atualizadas
- `reservations-updated` - Reservas atualizadas
- `orders-updated` - Pedidos atualizados
- `queue-updated` - Fila atualizada
- `table-available` - Mesa disponível
- `user-queue-position` - Posição na fila

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t fastfood-backend .

# Executar container
docker run -p 3001:3001 fastfood-backend
```

## 📊 Monitoramento

- Logs estruturados com Winston
- Métricas de performance
- Health checks
- Error tracking

## 🚀 Deploy

### Produção
```bash
npm run build
npm run start:prod
```

### Variáveis de Produção
- `NODE_ENV=production`
- `JWT_SECRET` (obrigatório)
- `DATABASE_URL` (obrigatório)
- `BCRYPT_ROUNDS=12`
- `RATE_LIMIT_MAX=50`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
