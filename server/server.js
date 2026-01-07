import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173", // Local development
    "http://localhost:3000", // Local development alternative
    "https://custom-component-creation-with-ai.vercel.app", // Production frontend
    "https://*.vercel.app" // Allow all Vercel subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Anthropic API proxy endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let llmResponse;

    if (model === "openai") {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // You can make this configurable as well
        messages: [{ role: "user", content: prompt }],
      });
      llmResponse = completion.choices[0].message.content;
    } else if (model === "anthropic") {
      const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicApiKey) {
        return res
          .status(500)
          .json({ error: "Anthropic API key not configured" });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          system:
            "You are a helpful AI assistant that helps users create React components. Provide clear, practical guidance for component creation.",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json({
          error: `Anthropic API error: ${
            error.error?.message || "Unknown error"
          }`,
        });
      }

      const data = await response.json();
      llmResponse = data.content[0]?.text || "No response received";
    } else {
      return res
        .status(400)
        .json({ error: "Invalid or no LLM model specified" });
    }

    res.json({ response: llmResponse });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
