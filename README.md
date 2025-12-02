# 🎓 CaughtTweaking - Detector de Plágio para Professores

Sistema completo para detecção de similaridade entre trabalhos acadêmicos em PDF.

## 📋 Características

- ✅ Upload de até 100 PDFs simultaneamente
- 🎨 Interface moderna e intuitiva
- 🔍 Análise de similaridade por TF-IDF e Cosine Similarity
- 🎯 Sistema de cores:
  - 🟡 Amarelo: 40-59% similar
  - 🟠 Laranja: 60-79% similar
  - 🔴 Vermelho: 80%+ similar
- 📊 Visualização detalhada de comparações

## 🚀 Como Configurar

### 1️⃣ Backend (Railway)

1. **Criar conta no Railway**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Fazer deploy do backend**
   ```bash
   # Na pasta backend/
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **No Railway Dashboard:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte o repositório
   - O Railway detectará automaticamente Python
   - Deploy automático será iniciado

4. **Configurar variáveis (se necessário):**
   - Railway auto-detecta `PORT`
   - Adicione `PYTHON_VERSION=3.11` se precisar

5. **Obter URL do backend:**
   - Após deploy, copie a URL (ex: `https://seu-app.up.railway.app`)

### 2️⃣ Frontend (Vercel)

1. **Atualizar API_URL no index.js**
   ```javascript
   const API_URL = 'https://seu-app.up.railway.app';
   ```

2. **Deploy na Vercel**
   - Acesse: https://vercel.com
   - Clique em "Add New Project"
   - Importe a pasta `frontend/`
   - Configurações:
     - Framework Preset: Other
     - Root Directory: ./
     - Build Command: (deixe vazio)
     - Output Directory: (deixe vazio)
   - Clique em "Deploy"

## 💻 Rodando Localmente

### Backend Local:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend rodará em: `http://localhost:5000`

### Frontend Local:
Abra `index.html` diretamente no navegador ou use um servidor local:
```bash
cd frontend
python -m http.server 8000
```

Acesse: `http://localhost:8000`

## 📁 Estrutura do Projeto

```
CaughtTweaking/
│
├── frontend/
│   ├── index.html      # Interface principal
│   ├── index.css       # Estilização
│   └── index.js        # Lógica do frontend
│
├── backend/
│   ├── app.py          # API Flask
│   ├── requirements.txt # Dependências Python
│   └── .gitignore      # Arquivos ignorados
│
└── README.md           # Documentação
```

## 🔧 Tecnologias Utilizadas

### Frontend:
- HTML5
- CSS3 (Gradientes, Flexbox, Grid)
- JavaScript (Vanilla)
- Drag & Drop API

### Backend:
- Python 3.11+
- Flask (Framework web)
- PyPDF2 (Extração de texto)
- scikit-learn (TF-IDF e Cosine Similarity)
- NumPy (Cálculos numéricos)

## 🎨 Paleta de Cores

- `#254E70` - Azul Escuro (Primary)
- `#37718E` - Azul Médio (Secondary)
- `#8EE3EF` - Azul Claro (Accent)
- `#AEF3E7` - Verde Água (Light)
- `#C33C54` - Vermelho (Danger/High Similarity)

## 📊 Como Funciona

1. **Upload**: Professor envia múltiplos PDFs
2. **Extração**: Sistema extrai texto de cada PDF
3. **Vetorização**: Textos são convertidos em vetores TF-IDF
4. **Comparação**: Calcula similaridade de cosseno entre todos os pares
5. **Visualização**: Mostra resultados com código de cores

## ⚠️ Limitações

- Máximo 100 PDFs por análise
- PDFs devem ter texto extraível (não imagens escaneadas)
- Funciona melhor com textos em português
- Tempo de processamento aumenta com número de arquivos

## 🐛 Problemas Comuns

### "Erro ao analisar arquivos"
- Verifique se o backend está rodando
- Confirme se a URL no `index.js` está correta
- Verifique CORS no backend

### "Nenhum texto extraído"
- PDF pode ser imagem escaneada
- Tente converter para PDF com texto real
- Verifique se o arquivo não está corrompido

### Deploy Railway não funciona
- Verifique se `requirements.txt` está correto
- Confirme que `Procfile` ou Railway detectou Python
- Veja logs no Railway Dashboard

## 📞 Suporte

Para problemas ou sugestões, abra uma issue no repositório.

## 📄 Licença

Projeto educacional - Livre para uso e modificação.

---

Feito com 💙 para facilitar a vida dos professores!
