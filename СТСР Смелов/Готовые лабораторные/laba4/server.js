const express = require('express');

const [, , nick, port] = process.argv;

if (!nick || !port) {
  console.error('Usage: node server.js <Nick> <Port>');
  process.exit(1);
}

const app = express();

// Логирование: видно, доходит ли запрос до сервера
app.use((req, res, next) => {
  console.log(`[${nick}] ${req.method} ${req.originalUrl}`);
  next();
});

// Отвечаем на всё
app.use((req, res) => {
  res.json({
    Nick: nick,
    Method: req.method,
  });
});

app.listen(Number(port), () => {
  console.log(`[TDWA04-01] Nick=${nick} Port=${port}`);
});