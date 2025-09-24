# 🍔 FastFood Tables Manager

Sistema completo de gerenciamento de mesas para restaurantes fastfood, desenvolvido com NestJS, Prisma, PostgreSQL, Next.js e Socket.io.

## 🚀 Funcionalidades

### Frontend (Next.js + Tailwind)
- **Página do Cliente:**
  - Listagem das mesas disponíveis e ocupadas em tempo real
  - Opção para reservar mesa (com limite de tempo de 15 minutos)
  - Fila de espera quando todas as mesas estiverem ocupadas
  - Visualização do cardápio integrado

- **Página do Admin:**
  - Dashboard com status das mesas (livre, ocupada, aguardando limpeza)
  - Atribuir pedidos às mesas
  - Finalizar e liberar mesa
  - Gerenciamento da fila de espera

### Backend (NestJS + Prisma + PostgreSQL)
- **CRUD de Mesas:**
  - Criar mesas com capacidade (2, 4, 6 lugares)
  - Atualizar status da mesa (livre, ocupada, aguardando)

- **CRUD de Reservas:**
  - Reservas feitas pelos clientes (com tempo limite)
  - Cancelamento automático após expiração

- **CRUD de Pedidos:**
  - Vincular pedidos às mesas
  - Fechar pedido e liberar mesa

- **Sistema de Fila de Espera:**
  - Se todas as mesas estiverem ocupadas, salvar clientes em fila
  - Aviso quando mesa ficar disponível

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Socket.io** - Comunicação em tempo real
- **bcryptjs** - Criptografia de senhas

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Socket.io Client** - Comunicação em tempo real
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de dados
- **Axios** - Cliente HTTP

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd fastfood-tables-manager
```

### 2. Configure o Backend
```bash
cd backend
npm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrações do banco
npx prisma migrate dev
npx prisma generate

# Inicie o servidor de desenvolvimento
npm run start:dev
```

### 3. Configure o Frontend
```bash
cd frontend
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local com:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Inicie o servidor de desenvolvimento
npm run dev
```

### 4. Execute ambos simultaneamente
```bash
# Na raiz do projeto
npm run dev
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- **users** - Usuários (clientes e admins)
- **tables** - Mesas do restaurante
- **reservations** - Reservas de mesas
- **orders** - Pedidos vinculados às mesas
- **queue_entries** - Fila de espera

### Enums
- **UserRole**: CLIENT, ADMIN
- **TableStatus**: FREE, OCCUPIED, WAITING_CLEANUP, RESERVED
- **ReservationStatus**: ACTIVE, EXPIRED, CANCELLED, COMPLETED
- **OrderStatus**: PENDING, IN_PREPARATION, READY, DELIVERED, CANCELLED

## 🔧 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/fastfood_tables?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
```

## 🚀 Deploy

### Backend (Railway/Render)
1. Conecte seu repositório ao Railway ou Render
2. Configure as variáveis de ambiente
3. O deploy será automático

### Frontend (Vercel)
1. Conecte seu repositório ao Vercel
2. Configure a variável `NEXT_PUBLIC_BACKEND_URL`
3. O deploy será automático

## 📱 Como Usar

### Para Clientes
1. Acesse a aplicação
2. Faça login ou crie uma conta
3. Visualize as mesas disponíveis
4. Reserve uma mesa ou entre na fila de espera
5. Acompanhe seu pedido em tempo real

### Para Administradores
1. Faça login como admin
2. Acesse o dashboard
3. Gerencie o status das mesas
4. Monitore pedidos e fila de espera
5. Notifique clientes quando mesas ficarem disponíveis

## 🔒 Autenticação

O sistema utiliza JWT para autenticação:
- Tokens são armazenados no localStorage
- Interceptadores automáticos adicionam o token nas requisições
- Redirecionamento automático para login em caso de token inválido

## ⚡ Tempo Real

Socket.io é utilizado para:
- Atualização do status das mesas
- Notificações de disponibilidade
- Atualização da fila de espera
- Status dos pedidos

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Roadmap

- [ ] Integração com sistemas de pagamento
- [ ] App mobile (React Native)
- [ ] Relatórios e analytics
- [ ] Integração com delivery
- [ ] Sistema de avaliações
- [ ] Notificações push

---

Desenvolvido com ❤️ para otimizar o gerenciamento de mesas em restaurantes fastfood.
# Backend-mesas-faastfood
