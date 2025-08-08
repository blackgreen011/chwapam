# 🚀 Guia Completo de Deploy GitHub → Vercel

## 📋 Pré-requisitos

1. **Conta GitHub** com repositório do projeto
2. **Conta Vercel** (gratuita)
3. **Projeto Supabase** configurado

## 🔗 Passo 1: Conectar GitHub com Vercel

### 1.1 Acesse a Vercel
- Vá para [vercel.com](https://vercel.com)
- Clique em **"Sign Up"** ou **"Login"**
- Escolha **"Continue with GitHub"**

### 1.2 Autorizar Vercel no GitHub
- Autorize a Vercel a acessar seus repositórios
- Selecione **"All repositories"** ou repositórios específicos
- Clique em **"Install & Authorize"**

## 📁 Passo 2: Importar Projeto

### 2.1 Na Dashboard da Vercel
- Clique em **"New Project"**
- Encontre seu repositório **"chans-paw-raffles"**
- Clique em **"Import"**

### 2.2 Configurar Deploy
- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `./` (padrão)
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install` (padrão)

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

### 3.1 Adicionar Variáveis
Na página de configuração do projeto, adicione:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ataeueqpwdzghunwnvxa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0YWV1ZXFwd2R6Z2h1bndudnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjQxNzgsImV4cCI6MjA3MDI0MDE3OH0.-oT0enfAxiUR-3uN2tfBKE7bPYAcPRN1lESrHElNxZU
```

### 3.2 Configurar para Todos os Ambientes
- Marque **"Production"**
- Marque **"Preview"** 
- Marque **"Development"**

## 🚀 Passo 4: Deploy

### 4.1 Iniciar Deploy
- Clique em **"Deploy"**
- Aguarde o build completar (2-5 minutos)

### 4.2 Verificar Deploy
- Acesse a URL fornecida pela Vercel
- Teste login: admin@chanspaw.com / admin123
- Verifique sorteios em `/pt/raffles`

## 🔧 Passo 5: Configurações Avançadas (Opcional)

### 5.1 Domínio Customizado
- Vá em **Settings → Domains**
- Adicione seu domínio personalizado
- Configure DNS conforme instruções

### 5.2 Configurações de Build
- **Node.js Version**: 18.x (recomendado)
- **Package Manager**: npm
- **Build & Development Settings**: usar padrões

## 🐛 Solução de Problemas Comuns

### Erro: "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Build failed"
- Verifique variáveis de ambiente
- Confirme que todas as dependências estão no package.json
- Verifique logs de build na Vercel

### Erro: "Database connection"
- Confirme URLs do Supabase
- Verifique se RLS está configurado
- Teste conexão local primeiro

## ✅ Checklist Final

- [ ] GitHub conectado à Vercel
- [ ] Repositório importado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Site acessível na URL da Vercel
- [ ] Login administrativo funcionando
- [ ] Sorteios carregando corretamente
- [ ] Banco de dados conectado

## 📞 Suporte

Se encontrar problemas:

1. **Logs da Vercel**: Verifique na aba "Functions" → "View Logs"
2. **Supabase**: Verifique na aba "Logs" do projeto
3. **GitHub**: Confirme que o código foi commitado

---

**🎉 Parabéns! Seu sistema está no ar!**

Acesse: `https://seu-projeto.vercel.app`