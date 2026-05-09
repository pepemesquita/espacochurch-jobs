# Espaço Church Jobs

Uma plataforma profissional independente e exclusiva para a comunidade **Espaço Church Pelotas**, projetada para conectar talentos, serviços e oportunidades de trabalho entre os membros e a cidade.

## 🚀 Sobre o Projeto

O **Espaço Church Jobs** nasceu da necessidade de organizar e dar visibilidade aos profissionais da nossa comunidade. A plataforma funciona como um diretório inteligente, onde cada membro pode cadastrar seu perfil, descrever suas habilidades e facilitar o contato direto via WhatsApp ou LinkedIn.

### Funcionalidades Principais
- **🔍 Diretório Inteligente**: Busca por mais de 50 categorias profissionais com filtro em tempo real.
- **👤 Perfis Detalhados**: Cartões profissionais com bio, área de atuação e links sociais.
- **🔐 Área do Membro**: Sistema de autenticação (Login/Cadastro) integrado ao Supabase.
- **📱 Cadastro Simplificado**: Formulário dedicado para novos profissionais inserirem seus dados.
- **💎 Design Premium**: Interface moderna, responsiva e focada na melhor experiência de uso (UX).

## 🛠️ Tecnologias Utilizadas

- **Next.js 15 (App Router)**: Framework React para performance e SEO.
- **TypeScript**: Garantia de robustez e segurança no código.
- **Supabase**: Backend-as-a-Service para Banco de Dados e Autenticação.
- **Phosphor Icons**: Iconografia profissional e consistente.
- **CSS Modules**: Estilização isolada e otimizada.

## ⚙️ Configuração do Ambiente

1. **Instalação**:
   ```bash
   npm install
   ```

2. **Banco de Dados**:
   - Crie um projeto no [Supabase](https://supabase.com).
   - Execute o script contido em `supabase_schema.sql` no SQL Editor do Supabase.

3. **Variáveis de Ambiente**:
   - Renomeie `.env.local.example` para `.env.local`.
   - Adicione suas credenciais:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
     ```

4. **Execução**:
   ```bash
   npm run dev
   ```

## 📂 Estrutura de Pastas

- `src/app/`: Rotas e páginas da aplicação (Home, Login, Register).
- `src/lib/`: Configurações de bibliotecas externas (Supabase Client).
- `public/`: Ativos estáticos e imagens.
- `supabase_schema.sql`: Definição das tabelas e políticas de segurança (RLS).

---

*Desenvolvido com carinho para fortalecer a nossa comunidade.*
