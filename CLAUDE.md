# Espaço Church Jobs - Guia de Desenvolvimento

## Comandos Principais
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera o build de produção.
- `npm install`: Instala as dependências do projeto.

## Arquitetura & Stack
- **Framework**: Next.js (App Router).
- **Estilo**: CSS Modules (Vanilla CSS).
- **Backend**: Supabase (Auth & Postgres).
- **Iconografia**: `@phosphor-icons/react`.

## Padrões de Código
- **Componentes**: Utilizar `"use client"` apenas quando necessário (interatividade).
- **Estilos**: Manter variáveis globais no `globals.css` e estilos específicos em `*.module.css`.
- **Database**: Sempre alinhar mudanças no schema com o arquivo `supabase_schema.sql`.
- **Nomenclatura**: Seguir o padrão camelCase para funções/variáveis e PascalCase para componentes.

## Fluxo de Autenticação
- O cliente Supabase está configurado em `src/lib/supabase.ts`.
- Possui um fallback de segurança (mock) para evitar crashes se o `.env.local` não estiver configurado.
- As políticas de RLS no Postgres garantem que apenas o dono do perfil possa editá-lo.
