const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

if (!process.env.MONGO_URI) {
  require("dotenv").config({
    path: path.join(__dirname, "../.env"),
  });
}

const app = express();
const port = process.env.PORT || 3000;

function log(level, message, details = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    service: 'node-app',
    level,
    message,
    ...details
  }));
}

app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

    log('info', 'http_request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Math.round(durationMs * 100) / 100,
      user_agent: req.get('user-agent')
    });
  });

  next();
});

mongoose.connection.on('connected', () => {
  log('info', 'mongo_connected');
});

mongoose.connection.on('error', (error) => {
  log('error', 'mongo_connection_error', {
    error: error.message
  });
});

mongoose.connect(process.env.MONGO_URI);

app.get('/', async (req, res) => {
  res.send('Docker Assignment Working-1!');
});

app.get('/health', async (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.listen(port, () => {
  log('info', 'server_started', {
    port,
    node_env: process.env.NODE_ENV || 'development'
  });
});
