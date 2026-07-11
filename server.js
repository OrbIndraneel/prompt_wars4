import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE';

let genAI = null;
let model = null;

if (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
  } catch(e) {
    console.error("Failed to initialize Google Generative AI:", e);
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, zones } = req.body;

    if (!model) {
      // Fallback if no API key
      const q = message.toLowerCase();
      const criticalZone = zones.find(z => z.status === 'critical');
      let fallbackText = "I can assist with crowd management, resource allocation, and emergency routing.";
      
      if (q.includes('congestion') || q.includes('crowd') || q.includes('busy')) {
        if (criticalZone) {
          fallbackText = `I've analyzed the live feeds. ${criticalZone.name} is currently experiencing critical congestion (${criticalZone.density}%). I recommend opening overflow lanes 3 and 4 and dispatching 2 additional crowd management staff.`;
        } else {
          fallbackText = "Current crowd levels are manageable across all sectors.";
        }
      } else if (q.includes('evacuate') || q.includes('emergency')) {
        fallbackText = "Generating emergency routing... Direct all East Wing traffic to Exits 12-15. Overriding digital signage now.";
      }

      return res.json({ text: fallbackText + " (Mock mode: No API key found on server)" });
    }

    const promptContext = `You are a Stadium Operations AI Assistant for the FIFA World Cup 2026.
Current Live Zone Status (JSON):
${JSON.stringify(zones)}

The user asks: "${message}"
Provide a brief, professional, and actionable response based on the live zone status. Keep it under 3 sentences.`;

    const result = await model.generateContent(promptContext);
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to generate AI response." });
  }
});

app.listen(PORT, () => {
  console.log(`Secure AI backend running on http://localhost:${PORT}`);
});
