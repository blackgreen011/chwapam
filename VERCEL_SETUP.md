# 🔗 Guia Completo: Conectar GitHub com Vercel

## 🎯 **Passo 1: Preparar o Repositório GitHub**

### 1.1 Verificar se o código está no GitHub
- Acesse seu repositório no GitHub
- Confirme que todos os arquivos estão commitados
- URL deve ser algo como: `https://github.com/seu-usuario/chans-paw-raffles`

### 1.2 Se não estiver no GitHub ainda:
```bash
# No terminal, dentro da pasta do projeto:
git init
git add .
git commit -m "Initial commit - CHANS PAW Raffles"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/chans-paw-raffles.git
git push -u origin main
```

## 🚀 **Passo 2: Conectar com Vercel**

### 2.1 Acessar Vercel
1. Vá para [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"** (se não tem conta) ou **"Log In"**

### 2.2 Login com GitHub
1. Clique em **"Continue with GitHub"**
2. Se solicitado, faça login no GitHub
3. **IMPORTANTE**: Autorize a Vercel a acessar seus repositórios

### 2.3 Autorizar Repositórios
1. Na tela de autorização, escolha:
   - **"All repositories"** (recomendado) OU
   - **"Only select repositories"** e escolha seu projeto
2. Clique em **"Install & Authorize"**

## 📁 **Passo 3: Importar o Projeto**

### 3.1 Na Dashboard da Vercel
1. Clique no botão **"New Project"**
2. Você verá uma lista dos seus repositórios GitHub
3. Encontre **"chans-paw-raffles"** (ou o nome do seu repositório)
4. Clique em **"Import"**

### 3.2 Configurar o Projeto
- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `./` (deixe padrão)
- **Build Command**: `npm run build` (deixe padrão)
- **Output Directory**: `.next` (deixe padrão)
- **Install Command**: `npm install` (deixe padrão)

## ⚙️ **Passo 4: Configurar Variáveis de Ambiente**

### 4.1 Antes de fazer deploy, adicione as variáveis:
1. Na tela de configuração do projeto, role para baixo
2. Encontre a seção **"Environment Variables"**
3. Adicione cada variável:

**Variável 1:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://ataeueqpwdzghunwnvxa.supabase.co`
- **Environments**: Marque todas (Production, Preview, Development)

**Variável 2:**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0YWV1ZXFwd2R6Z2h1bndudnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjQxNzgsImV4cCI6MjA3MDI0MDE3OH0.-oT0enfAxiUR-3uN2tfBKE7bPYAcPRN1lESrHElNxZU`
- **Environments**: Marque todas (Production, Preview, Development)

### 4.2 Finalizar Deploy
1. Clique em **"Deploy"**
2. Aguarde o build completar (2-5 minutos)

## 🔧 **Passo 5: Verificar Deploy**

### 5.1 Após o deploy:
1. Vercel mostrará uma URL como: `https://chans-paw-raffles.vercel.app`
2. Clique na URL para testar
3. Teste o login admin: `admin@chanspaw.com` / `admin123`

### 5.2 Se houver erros:
1. Clique na aba **"Functions"** no painel da Vercel
2. Clique em **"View Function Logs"** para ver detalhes
3. Verifique se as variáveis de ambiente estão corretas

## 🚨 **Soluções para Problemas Comuns**

### Problema: "Repository not found"
**Solução:**
1. Vá para [github.com/settings/installations](https://github.com/settings/installations)
2. Encontre "Vercel" na lista
3. Clique em "Configure"
4. Adicione o repositório ou escolha "All repositories"

### Problema: "Build failed"
**Solução:**
1. Verifique se o package.json está correto
2. Confirme que as variáveis de ambiente foram adicionadas
3. Tente fazer deploy novamente

### Problema: "Permission denied"
**Solução:**
1. Vá para GitHub → Settings → Applications
2. Encontre Vercel e revogue acesso
3. Reconecte seguindo os passos acima

## ✅ **Checklist Final**

- [ ] Código está no GitHub
- [ ] Conta Vercel criada
- [ ] GitHub conectado com Vercel
- [ ] Repositório importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Site funcionando na URL da Vercel
- [ ] Login admin testado

## 📞 **Precisa de Ajuda?**

Se ainda tiver problemas:

1. **Verifique logs**: Na Vercel, vá em Project → Functions → View Logs
2. **Teste local**: Execute `npm run build` localmente primeiro
3. **Variáveis**: Confirme que as variáveis estão exatamente como mostrado acima

---

**🎉 Sucesso! Seu sistema estará online em poucos minutos!**