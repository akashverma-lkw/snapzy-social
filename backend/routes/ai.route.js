import express from "express";
import dotenv from "dotenv";
import { remark } from "remark";
import strip from "strip-markdown";

dotenv.config();
const router = express.Router();

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const requestBody = {
      contents: [{ parts: [{ text: question }] }],
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data?.candidates?.length > 0) {
      let rawResponse = data.candidates[0]?.content?.parts[0]?.text || "No response generated.";

      // Convert Markdown to plain text and ensure proper spacing
      const processedText = String(await remark().use(strip).process(rawResponse)).trim();

      res.json({ response: processedText });
    } else {
      res.status(500).json({ error: "AI could not process the request." });
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
