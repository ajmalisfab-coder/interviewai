const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GROQ_KEY = process.env.GROQ_API_KEY || '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';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, subject, difficulty, mode, maxQ } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    const systemPrompt = `You are a professional, experienced interviewer conducting a ${mode} interview on "${subject}" at "${difficulty}" difficulty.

Rules:
- Ask ONE clear, specific interview question per turn. Never ask multiple questions at once.
- Questions must be realistic and appropriate for ${difficulty} level in ${subject}.
- Progressively increase complexity with each question.
- After the candidate answers, evaluate thoroughly with specific constructive feedback, then ask the next question.
- Be conversational, professional, and encouraging like a real senior interviewer.
- Adapt follow-up questions based on what the candidate actually said.

Response format:
- VERY FIRST message: reply with ONLY the interview question as plain text. No greeting, no JSON, nothing else.
- ALL subsequent turns after candidate answers: reply ONLY with raw valid JSON, no markdown, no code fences:
{"score":<0-100>,"feedback":["<specific point 1>","<specific point 2>","<specific point 3>"],"next_question":"<your next question>","done":<true if ${maxQ} questions have been asked, else false>}

Scoring: 90-100=exceptional, 75-89=strong, 60-74=adequate, 40-59=needs work, below 40=insufficient.
Feedback must be specific to what the candidate actually said.`;

    const groqMessages = [{ role: 'system', content: systemPrompt }, ...messages];

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        temperature: 0.7,
        messages: groqMessages
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res.status(groqRes.status).json({ error: errText });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';
    res.json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InterviewAI server is running!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`InterviewAI server running on port ${PORT}`);
});
