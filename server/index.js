import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const config = new Configuration({
  apiKey: process.env.OPENAI_SECRET,
});

const openai = new OpenAIApi(config);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'Hello from api demo!' });
})

app.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.6,
      presence_penalty: 0,
    });
    const { choices } = response.data;
    const { text } = choices[0];
    res.status(200).json({ bot: text });
  }
  catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(5000, () => console.log('Server running on port http://localhost:5000'));