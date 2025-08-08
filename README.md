# CHANS PAW - Sorteios Premium

Sistema completo de sorteios online com autenticação, pagamentos e administração.

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta na Vercel
- Projeto Supabase configurado
- Variáveis de ambiente configuradas

### Variáveis de Ambiente Necessárias

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Passos para Deploy

1. **Conectar Repositório**
   - Conecte seu repositório GitHub à Vercel
   - A Vercel detectará automaticamente que é um projeto Next.js

2. **Configurar Variáveis de Ambiente**
   - No painel da Vercel, vá em Settings > Environment Variables
   - Adicione as variáveis listadas acima

3. **Deploy Automático**
   - O deploy será executado automaticamente
   - O build está otimizado para evitar erros comuns

### Funcionalidades

- ✅ **Autenticação completa** com Supabase
- ✅ **Sistema de sorteios** com números
- ✅ **Dashboard administrativo**
- ✅ **Pagamentos** (estrutura preparada)
- ✅ **Multilíngue** (PT, EN, FR, HT)
- ✅ **Responsivo** para todos os dispositivos

### Login Administrativo

- **Email**: admin@chanspaw.com
- **Senha**: admin123

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Estrutura do Projeto

```
src/
├── app/                 # App Router do Next.js
├── components/          # Componentes React
├── lib/                # Utilitários e configurações
└── hooks/              # Custom hooks

supabase/
├── migrations/         # Migrações do banco
└── functions/          # Edge functions
```

### Tecnologias

- **Framework**: Next.js 15 com App Router
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **UI**: Shadcn/UI + Tailwind CSS
- **Deploy**: Vercel

---

_Sistema otimizado para produção com deploy automático na Vercel._