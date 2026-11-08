const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const HISTORICO_FILE = path.join(__dirname, 'historico.json');

// Middleware para processar JSON no corpo das requisições
app.use(express.json());

// Função para ler ou inicializar o histórico de dados
const lerHistorico = () => {
  if (!fs.existsSync(HISTORICO_FILE)) {
    fs.writeFileSync(HISTORICO_FILE, JSON.stringify([], null, 2));
    return [];
  }
  const dados = fs.readFileSync(HISTORICO_FILE, 'utf-8');
  return JSON.parse(dados || '[]');
};

// Rota inicial de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'Orquestrador de Integrações ativo!' });
});

// Rota para consultar os webhooks salvos (Histórico)
app.get('/historico', (req, res) => {
  const historico = lerHistorico();
  res.status(200).json({
    total: historico.length,
    registos: historico
  });
});

// Rota para receber, transformar e salvar o Webhook
app.post('/webhook', (req, res) => {
  const payload = req.body;

  // 1. Validação de Erros
  if (!payload.cliente || !payload.evento) {
    return res.status(400).json({
      status: 'erro',
      mensagem: 'Payload inválido. Os campos "cliente" e "evento" são obrigatórios.'
    });
  }

  // 2. Transformação de Dados
  const payloadTransformado = {
    id: Date.now(), // Identificador único da transação
    sistemaOrigem: 'E-commerce Externo',
    clienteFormatado: payload.cliente.toUpperCase(),
    tipoEvento: payload.evento,
    valorComDesconto: payload.valor ? payload.valor * 0.90 : 0,
    processadoEm: new Date().toISOString()
  };

  // 3. Persistência de Dados (Guardar no ficheiro JSON)
  const historicoAtual = lerHistorico();
  historicoAtual.push(payloadTransformado);
  fs.writeFileSync(HISTORICO_FILE, JSON.stringify(historicoAtual, null, 2));

  console.log('--- NOVO WEBHOOK PERSISTIDO ---');
  console.log('Registo guardado com ID:', payloadTransformado.id);

  // Resposta de sucesso
  res.status(200).json({
    status: 'sucesso',
    mensagem: 'Webhook validado, transformado e persistido com sucesso!',
    dados: payloadTransformado
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de integrações a rodar na porta ${PORT}`);
});