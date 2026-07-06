import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const key = envContent.split('=')[1].trim();

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function run() {
  try {
    const result = await model.generateContent("Test connection");
    console.log("Success:", result.response.text());
  } catch(e) {
    console.error("API Error:", e.message);
  }
}
run();
