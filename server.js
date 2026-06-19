const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
  try {
    const GROQ_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_KEY) {
      return res.status(500).json({
        error: 'GROQ_API_KEY is missing'
      });
    }

    const { messages, subject, difficulty, mode, maxQ } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid messages'
      });
    }

    const systemPrompt = `You are a professional interviewer conducting a ${mode} interview on "${subject}" at "${difficulty}" difficulty.

Rules:
- Ask ONE question per turn.
- Progressively increase difficulty.
- Give constructive feedback.
- Adapt questions to previous answers.

First message:
Reply ONLY with a question.

Afterwards reply ONLY in JSON:

{"score":0,"feedback":["point1","point2","point3"],"next_question":"question","done":false}`;

    const groqMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages
    ];

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000);

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!groqRes.ok) {
      const errorText = await groqRes.text();

      return res.status(groqRes.status).json({
        error: errorText
      });
    }

    const data = await groqRes.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() || '';

    return res.json({ reply });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok'
  });
});

app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'public', 'index.html')
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
