# ✅ Próximos Passos - Admin Dashboard

## Status Atual

- ✅ **npm install** - Concluído
- ✅ **Arquivo .env** - Criado
- ✅ **SQL Views** - Executado com sucesso!
- ⏳ **Usuário Admin** - Próximo passo
- ⏳ **Testar Dashboard** - Após criar admin

---

## 📋 Passo 4: Criar Usuário Admin

### Opção A: Se você já tem um usuário cadastrado

1. **Acesse:** Supabase Dashboard > SQL Editor
2. **Execute este SQL** (substitua o email):

```sql
UPDATE public.profiles 
SET is_admin = true,
    status = 'active',
    updated_at = now()
WHERE email = 'seu_email@exemplo.com';

-- Verificar se funcionou
SELECT email, is_admin, status 
FROM public.profiles 
WHERE email = 'seu_email@exemplo.com';
```

### Opção B: Usar o arquivo SQL

1. **Abra:** `admin-dashboard/SQL_CRIAR_USUARIO_ADMIN.sql`
2. **Substitua** `'seu_email@exemplo.com'` pelo seu email
3. **Copie** e **cole** no SQL Editor do Supabase
4. **Execute**

---

## 📋 Passo 5: Testar o Dashboard

### 1. Iniciar o servidor

```bash
cd admin-dashboard
npm run dev
```

### 2. Acessar no navegador

Abra: **http://localhost:3000**

### 3. Fazer login

- **Email:** O email do usuário admin que você configurou
- **Senha:** A senha do usuário no Supabase Auth

### 4. Verificar se funcionou

Você deve ver:
- ✅ Tela de login
- ✅ Após login, dashboard principal
- ✅ Cards com estatísticas (usuários, grupos, códigos, receita)
- ✅ Navegação funcionando

---

## 🐛 Troubleshooting

### Erro: "Acesso Negado"

**Causa:** Usuário não tem `is_admin = true`

**Solução:**
1. Verifique se o SQL do passo 4 foi executado
2. Confirme o email está correto:
```sql
SELECT email, is_admin FROM profiles WHERE email = 'seu_email@exemplo.com';
```
3. Se `is_admin` for `false`, execute o SQL novamente

### Erro: "Missing Supabase environment variables"

**Causa:** Arquivo .env não está correto

**Solução:**
1. Verifique se o arquivo `.env` existe em `admin-dashboard/`
2. Verifique se tem as variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Reinicie o servidor: `npm run dev`

### Erro: "relation does not exist"

**Causa:** Views SQL não foram executadas

**Solução:**
1. Execute o arquivo `SQL_FINAL_EXECUTAR.sql` novamente
2. Verifique se as views foram criadas:
```sql
SELECT * FROM admin_statistics;
```

---

## ✅ Checklist Final

- [x] npm install executado
- [x] Arquivo .env criado
- [x] SQL views executado no Supabase
- [ ] Usuário admin criado (próximo passo)
- [ ] Dashboard testado e funcionando

---

## 🎯 Depois que funcionar

Após o dashboard funcionar, podemos implementar:

1. **Módulo de Usuários** - Lista, detalhes, edição
2. **Módulo de Grupos** - Lista, detalhes, membros
3. **Módulo de Códigos** - Lista, geração, histórico
4. **Relatórios e Gráficos** - Estatísticas visuais

---

**Próximo passo:** Execute o SQL para criar usuário admin e depois teste o dashboard! 🚀

