# 🔧 Solução de Problemas - Deploy Vercel

## 🚨 **Erro: "Conecte as contas corretamente"**

### Causa Comum:
A Vercel não tem permissão para acessar seu repositório GitHub.

### Solução Passo a Passo:

#### 1. **Revogar Conexão Atual**
1. Vá para [github.com/settings/applications](https://github.com/settings/applications)
2. Clique na aba **"Authorized OAuth Apps"**
3. Encontre **"Vercel"** na lista
4. Clique em **"Revoke"** para remover a autorização

#### 2. **Verificar Instalações**
1. Vá para [github.com/settings/installations](https://github.com/settings/installations)
2. Procure por **"Vercel"** na lista
3. Se existir, clique em **"Configure"**
4. Se não existir, prossiga para o próximo passo

#### 3. **Reconectar do Zero**
1. Acesse [vercel.com](https://vercel.com)
2. Se estiver logado, faça logout
3. Clique em **"Sign Up"** ou **"Log In"**
4. Escolha **"Continue with GitHub"**
5. **IMPORTANTE**: Na tela de autorização, certifique-se de:
   - Ler todas as permissões solicitadas
   - Escolher **"All repositories"** (recomendado)
   - Clicar em **"Install & Authorize"**

#### 4. **Verificar Permissões**
Após conectar, a Vercel deve ter acesso a:
- ✅ Ler repositórios
- ✅ Ler metadados
- ✅ Criar webhooks
- ✅ Ler conteúdo dos repositórios

## 🔄 **Erro: "Repository not accessible"**

### Solução:
1. Vá para [github.com/settings/installations](https://github.com/settings/installations)
2. Clique em **"Vercel"**
3. Clique em **"Configure"**
4. Na seção **"Repository access"**:
   - Escolha **"All repositories"** OU
   - Escolha **"Selected repositories"** e adicione seu projeto
5. Clique em **"Save"**

## 📦 **Erro: "Build failed"**

### Verificações:
1. **Package.json correto?**
   - Verifique se todas as dependências estão listadas
   - Confirme que os scripts estão corretos

2. **Variáveis de ambiente configuradas?**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Código no GitHub atualizado?**
   ```bash
   git add .
   git commit -m "Fix deploy issues"
   git push origin main
   ```

## 🌐 **Erro: "Environment variables missing"**

### Solução:
1. Na Vercel, vá para seu projeto
2. Clique em **"Settings"**
3. Clique em **"Environment Variables"**
4. Adicione as variáveis necessárias:

```
NEXT_PUBLIC_SUPABASE_URL=https://ataeueqpwdzghunwnvxa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0YWV1ZXFwd2R6Z2h1bndudnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjQxNzgsImV4cCI6MjA3MDI0MDE3OH0.-oT0enfAxiUR-3uN2tfBKE7bPYAcPRN1lESrHElNxZU
```

5. **IMPORTANTE**: Marque todas as opções:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

6. Clique em **"Save"**
7. Faça um novo deploy

## 🔐 **Erro: "Permission denied to repository"**

### Solução Completa:
1. **No GitHub:**
   - Vá para Settings → Developer settings → Personal access tokens
   - Gere um novo token se necessário
   - Certifique-se que tem permissões de repo

2. **Na Vercel:**
   - Desconecte a conta GitHub
   - Reconecte com as permissões corretas
   - Importe o projeto novamente

## 📱 **Teste Final**

Após resolver os problemas:

1. **Acesse a URL da Vercel**
2. **Teste as funcionalidades:**
   - Página inicial carrega?
   - Login funciona? (admin@chanspaw.com / admin123)
   - Sorteios aparecem?
   - Dashboard admin acessível?

3. **Se algo não funcionar:**
   - Verifique logs na Vercel
   - Confirme variáveis de ambiente
   - Teste localmente primeiro

---

**💡 Dica:** Sempre teste localmente com `npm run build` antes de fazer deploy!