import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ai/qwq32b', async (req, res) => {
  try {
    const { prompt, system, temperature } = req.query;
    if (!prompt) return res.status(400).json({ status: false, error: 'Prompt required' });

    const response = await axios.get(
      'https://api.siputzx.my.id/api/ai/qwq32b',
      {
        params: {
          prompt: decodeURIComponent(prompt),
          system: system || 'You are a helpful assistant.',
          temperature: temperature || 0.7,
        },
        timeout: 60000,
      }
    );

    res.json({
      status: true,
      data: response.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.all('*', (req, res) => {
  res.status(404).json({ status: false, error: 'Not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {});

export default app;
