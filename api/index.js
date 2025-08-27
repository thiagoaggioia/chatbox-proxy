import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/api', async (req, res) => {
  try {
    const { message } = req.body;
    
    const prompt = `Você é um assistente de apoio para mulheres vítimas de violência doméstica da Procuradoria da Mulher de Joinville. Seu objetivo é ser empático, acolhedor e fornecer informações úteis e seguras, sempre reforçando que a segurança da pessoa é a prioridade. Não dê conselhos médicos ou jurídicos detalhados, mas oriente a buscar ajuda profissional. Sua resposta deve ser sempre em português. Responda a seguinte mensagem: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ response: "Desculpe, ocorreu um erro. Por favor, tente novamente." });
  }
});

export default app;
