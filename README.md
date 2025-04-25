## ✂️ Sistema de Agendamentos Backend

Este projeto é uma API backend para sistemas de agendamento, como barbearias, clínicas ou outros prestadores de serviço. Foi desenvolvido com foco em escalabilidade, segurança e flexibilidade na gestão de horários.

### 🚀 Funcionalidades

- 🔐 **Autenticação com JWT + Cookies HTTP-only**  
  Login seguro com proteção contra XSS e CSRF.

- 👤 **Gestão de usuários**

  - Cadastro e login
  - Perfis com função (`admin` ou `client`)
  - CRUD completo para usuários (admin)

- 📅 **Sistema de agendamentos**

  - Cadastro de serviços com **duração** e **preço**
  - Definição de horários de trabalho por dia da semana
  - Configuração de **pausas** e **dias fechados**
  - Lógica que **evita conflitos** com agendamentos existentes
  - Retorno de **horários disponíveis** com base em todas as regras

- 🧑‍💼 **Administração**
  - Criação automática de usuário administrador
  - CRUD para serviços e horários de funcionamento
  - Filtros e validações para manter integridade dos dados

### 🛠️ Tecnologias utilizadas

- **Node.js + Express**
- **MongoDB + Mongoose**
- **Day.js** (com suporte a fuso horário)
- **JWT** para autenticação
- **Docker + Docker Compose** (aplicação conteinerizada)
- **TypeScript** para segurança e organização do código

### 📦 Como rodar

```bash
# Clone o projeto
git clone https://github.com/eddi3ms/scheduler-bd.git
cd scheduler-bd

# Copie o .env.example para .env e ajuste as variáveis
cp .env.example .env

# Suba os containers
make up

# Pronto! A API estará disponível em http://localhost:3000
```
