import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/api', async (req, res) => {
    const { action, data } = req.body;

    let prompt = '';

    if (action === 'generate_survey') {
        prompt = `
        Aja como um consultor de carreira especializado em ESG e IA.
        Com base no seguinte perfil e objetivo de carreira:
        - Perfil de trabalho: ${data.perfil}
        - Habilidades: ${data.habilidades.join(', ')}
        - Objetivo de carreira: ${data.objetivo}
        
        Sua tarefa é criar um questionário com **10 perguntas precisas** e de múltipla escolha para entender melhor as lacunas e interesses desse usuário.
        As perguntas devem ser focadas em hard skills e soft skills.
        Cada pergunta deve ter 4 opções de resposta.
        Formate a resposta como um objeto JSON puro, sem textos adicionais, no seguinte formato:
        {
          "survey": [
            {
              "question": "Texto da primeira pergunta",
              "options": ["Opção A", "Opção B", "Opção C", "Opção D"]
            },
            {
              "question": "Texto da segunda pergunta",
              "options": ["Opção A", "Opção B", "Opção C", "Opção D"]
            }
          ]
        }
        `;
    } 
    else if (action === 'generate_roadmap') {
        prompt = `
        Aja como um consultor de carreira especializado em ESG e IA.
        Com base nas seguintes informações de um usuário:
        - Perfil de trabalho: ${data.perfil}
        - Habilidades atuais: ${data.habilidades.join(', ')}
        - Respostas do questionário: ${data.surveyResults}
        - Objetivo de carreira: ${data.objetivo}
        
        Sua tarefa é gerar um roadmap profissional para este usuário, detalhando 3 a 5 passos claros e práticos.
        Inclua sugestões de aprendizado, atividades práticas, e dicas de networking.
        O roadmap deve ser direcionado para o objetivo de carreira do usuário e focado em ESG + IA.
        Sua resposta deve ser um texto formatado em Markdown, sem nenhum JSON.
        `;
    }

    try {
        if (!prompt) {
            return res.status(400).json({ response: "Ação não especificada." });
        }
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let parsedResponse = text;
        if (action === 'generate_survey') {
            try {
                parsedResponse = JSON.parse(text);
            } catch (e) {
                console.error('Erro ao parsear JSON:', text);
                return res.status(500).json({ response: "Desculpe, ocorreu um erro ao gerar as perguntas." });
            }
        }

        res.status(200).json({ response: parsedResponse });
    } catch (error) {
        console.error('Erro na API:', error);
        res.status(500).json({ response: "Desculpe, ocorreu um erro na comunicação. Por favor, tente novamente." });
    }
});

export default app;
