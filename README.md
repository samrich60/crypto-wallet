# 🪙 CryptoWallet — Monitorador de Criptomoedas

Projeto Prático Integrador em React Native  
**Disciplina:** Programação de Banco de Dados SQL  
**Professor:** Karython Gomes  
**UNIDESC**

---

## 📱 Sobre o App

O **CryptoWallet** é um aplicativo móvel de monitoramento e gestão de criptomoedas. O usuário pode visualizar as principais moedas do mercado em tempo real e gerenciar uma carteira simulada pessoal.

---

## 🔧 Requisitos Técnicos Atendidos

| Requisito | Implementação |
|---|---|
| ✅ Navegação (3+ telas) | Bottom Tab (Mercado / Carteira) + Stack (Detalhes) |
| ✅ API Externa | CoinGecko API (gratuita, sem chave) |
| ✅ CRUD Firebase | Firestore — Create, Read, Update, Delete na carteira |
| ✅ Animações | Fade-in do header, imagem pulsante, escala nos botões, slide-in nos detalhes |

---

## 🌐 API Utilizada

**CoinGecko** — https://www.coingecko.com/api/documentation  
- Gratuita, sem necessidade de API Key
- Endpoint principal: `/coins/markets` (listagem) e `/coins/{id}` (detalhes)
- Dados em BRL (Real Brasileiro)

---

## 🔥 Firebase — Como Configurar

1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"** e crie um projeto (ex: `crypto-wallet-app`)
3. Clique em **"Adicionar app"** → ícone Web (`</>`)
4. Copie as credenciais geradas
5. Abra o arquivo `src/config/firebase.js` e substitua os valores:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  ...
};
```

6. No Firebase Console, vá em **Firestore Database → Criar banco de dados**
7. Escolha **"Modo de teste"** (para desenvolvimento)

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular (iOS ou Android)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/crypto-wallet.git
cd crypto-wallet

# 2. Instale as dependências
npm install

# 3. Configure o Firebase em src/config/firebase.js

# 4. Inicie o projeto
npx expo start

# 5. Escaneie o QR Code com o Expo Go
```

---

## 📁 Estrutura do Projeto

```
CryptoWallet/
├── App.js                          # Entrada do app
├── babel.config.js
├── package.json
└── src/
    ├── config/
    │   └── firebase.js             # ⚠️ Configure suas credenciais aqui
    ├── navigation/
    │   └── AppNavigator.js         # Tab + Stack Navigation
    ├── screens/
    │   ├── HomeScreen.js           # Tela 1: Listagem do mercado
    │   ├── DetalhesScreen.js       # Tela 2: Detalhes da moeda (+ animação)
    │   └── CarteiraScreen.js       # Tela 3: Carteira pessoal (CRUD)
    ├── services/
    │   ├── cryptoApi.js            # Consumo da CoinGecko API
    │   └── walletService.js        # CRUD com Firebase Firestore
    └── components/
        ├── AddToWalletModal.js     # Modal de CREATE
        └── EditCoinModal.js        # Modal de UPDATE
```

---

## 📹 Funcionalidades Demonstradas no Vídeo

1. **Mercado** — Lista as top 50 criptomoedas com preço e variação em tempo real
2. **Busca** — Filtra moedas por nome ou símbolo
3. **Detalhes** — Exibe informações completas com imagem pulsante (animação)
4. **Adicionar à Carteira** — Salva moeda no Firebase (CREATE)
5. **Carteira** — Lista moedas salvas com total investido (READ)
6. **Editar** — Atualiza quantidade e nota (UPDATE)
7. **Remover** — Remove moeda da carteira (DELETE)
