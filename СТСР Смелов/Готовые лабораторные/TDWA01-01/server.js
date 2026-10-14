const express = require('express');

const app = express();
const PORT = 40000;

app.use(express.json());

let stored = null;

function calculate({ op, x, y }) {
  const operation = String(op || '').trim().toLowerCase();

  switch (operation) {
    case 'add': return { ok: true, result: x + y };
    case 'sub': return { ok: true, result: x - y };
    case 'mul': return { ok: true, result: x * y };
    case 'div':
      if (y === 0) return { ok: false, error: 'Division by zero' };
      return { ok: true, result: Math.trunc(x / y) };
    default:
      return { ok: false, error: 'op must be one of: add, sub, mul, div' };
  }
}

function validate(body) {
  if (!body || typeof body !== 'object') return 'Body must be JSON object';
  if (typeof body.op !== 'string') return 'Field "op" is required (string)';
  if (!Number.isInteger(body.x)) return 'Field "x" must be integer';
  if (!Number.isInteger(body.y)) return 'Field "y" must be integer';
  return null;
}

app.get('/NGINX-test', (req, res) => {
  if (!stored) return res.status(404).json({ error: 'Not found' });

  const calc = calculate(stored);
  if (!calc.ok) return res.status(400).json({ error: calc.error });

  return res.status(200).json({
    op: stored.op, x: stored.x, y: stored.y, result: calc.result
  });
});

app.post('/NGINX-test', (req, res) => {
  if (stored) return res.status(409).json({ error: 'JSON request already exists' });

  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });

  const calc = calculate(req.body);
  if (!calc.ok) return res.status(400).json({ error: calc.error });

  stored = { op: req.body.op, x: req.body.x, y: req.body.y };

  return res.status(200).json({
    op: stored.op, x: stored.x, y: stored.y, result: calc.result
  });
});

app.put('/NGINX-test', (req, res) => {
  if (!stored) return res.status(404).json({ error: 'Not found' });

  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });

  const calc = calculate(req.body);
  if (!calc.ok) return res.status(400).json({ error: calc.error });

  stored = { op: req.body.op, x: req.body.x, y: req.body.y };

  return res.status(200).json({
    op: stored.op, x: stored.x, y: stored.y, result: calc.result
  });
});

app.delete('/NGINX-test', (req, res) => {
  if (!stored) return res.status(404).json({ error: 'Not found' });

  stored = null;
  return res.status(200).json({ message: 'Deleted' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TDWA01-01 listening on http://localhost:${PORT}`);
});