# 🚀 Orquestrador de Webhooks - Júnior Integration

Projeto desenvolvido para fins de portfólio, simulando um orquestrador de integrações em Node.js com Express. O sistema recebe webhooks externos, valida os dados, aplica regras de negócio/transformação e persiste o histórico localmente.

## 🛠️ Tecnologias Utilizadas
- **Node.js** & **Express**
- **JavaScript (ES6+)**
- **File System (`fs`)** para persistência local em JSON

## 📡 Endpoints Disponíveis
- **`GET /`** - Verifica se o servidor está ativo.
- **`POST /webhook`** - Recebe, valida, transforma e persiste o payload enviado.
- **`GET /historico`** - Retorna todos os webhooks processados e salvos.

## 🧪 Como Executar
1. Instale as dependências: `npm install`
2. Inicie o servidor: `node server.js`
3. O servidor estará rodando na porta `3000`.