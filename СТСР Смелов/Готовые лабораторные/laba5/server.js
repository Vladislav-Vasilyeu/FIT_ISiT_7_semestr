const express = require('express');
const app = express();

// Читаем аргументы командной строки
const [, , nick, port, delay] = process.argv;

if (!nick || !port || !delay) {
  console.error('Usage: node server_lb.js <Nick> <Port> <Delay_ms>');
  process.exit(1);
}

const baseDelay = parseInt(delay, 10);

// Middleware для логирования и задержки
app.use(async (req, res, next) => {
  console.log(`[${nick}] ${req.method} ${req.originalUrl}`);

  let currentDelay = 0;
  switch (req.method) {
    case 'GET':
      currentDelay = baseDelay * (1 / 3); // 1/3 * Delay
      break;
    case 'POST':
      currentDelay = baseDelay * (2 / 3); // 2/3 * Delay
      break;
    case 'PUT':
      currentDelay = baseDelay; // Delay
      break;
    case 'DELETE':
      currentDelay = baseDelay * (1 / 4); // 1/4 * Delay
      break;
  }

  // Искусственная задержка
  await new Promise(resolve => setTimeout(resolve, currentDelay));
  next();
});

// Универсальный обработчик, как в лабе №4
app.use((req, res) => {
  res.json({
    Nick: nick,
    Method: req.method,
  });
});

app.listen(parseInt(port, 10), () => {
  console.log(`[TDWA05-01] Nick=${nick}, Port=${port}, BaseDelay=${baseDelay}ms`);
});