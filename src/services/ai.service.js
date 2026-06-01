const groq = require("groq-sdk");
require("dotenv").config();
const client = new groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function answer(message) {
  //array of conversation
  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: message,
  });
  return response;
}

async function title(prompt) {
  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: `Generate a chat title from the message.
            Rules:
            - Return only the title.
            - 3-7 words.
            - Use Title Case.
            - Summarize the message topic or intent.
            - Never refer to the sender (no User, Person, Someone, etc.).
            - Never answer, explain, or complete the request.
            - No quotes, emojis, punctuation, markdown, or extra text.
            - If the message is unclear, create a short neutral title based only on the message content.
            - Never return errors, placeholders, or fallback labels.
            Examples:
            "Write binary search code" → Binary Search Implementation
            "How do I connect Git to GitHub?" → Connecting Git to GitHub`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return response;
}

module.exports = { answer, title };
