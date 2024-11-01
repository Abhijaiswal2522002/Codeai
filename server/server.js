import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

// Load environment variables from .env file
dotenv.config();

// OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Create an Express application
const app = express();
app.use(cors());
app.use(express.json());

// GET route to check server status
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!',
  });
});

// POST route to handle OpenAI API requests
app.post('/', async (req, res) => {
  const prompt = req.body.prompt;

  // Validate prompt input
  if (!prompt) {
    return res.status(400).send({ error: "Prompt is required" });
  }

  try {
    // Log the received prompt
    console.log("Received prompt:", prompt);

    // Call OpenAI API using gpt-3.5-turbo
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0, // Higher values mean more risk
      max_tokens: 3000, // Maximum number of tokens to generate
      top_p: 1, // Nucleus sampling
      frequency_penalty: 0.5, // Penalizes repetition
      presence_penalty: 0, // Penalizes new topics
    });

    // Send the AI's response
    res.status(200).send({
      bot: response.data.choices[0].message.content,
    });

  } catch (error) {
    // Log the specific error message
    console.error("Error with OpenAI API:", error.response ? error.response.data : error.message);
    res.status(500).send({ error: "Server encountered an issue with the AI API" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AI server started on http://localhost:${PORT}`));
