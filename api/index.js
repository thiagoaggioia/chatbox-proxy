export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        return res.json({ status: 'Gemini API Ready - Fixed Model' });
    }
    
    if (req.method === 'POST') {
        try {
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            
            // MODELO CORRETO - mudou de "gemini-pro" para "gemini-1.5-flash"
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const { action, data } = req.body || {};
            let prompt = '';
            
            if (action === 'generate_survey') {
                prompt = `Aja como um consultor de carreira especializado em ESG e IA.
Com base no seguinte perfil:
- Perfil de trabalho: ${data.perfil}
- Habilidades: ${data.habilidades.join(', ')}
- Objetivo de carreira: ${data.objetivo}

Crie um questionário com 10 perguntas de múltipla escolha para entender melhor as lacunas e interesses desse usuário.
As perguntas devem focar em hard skills e soft skills.
Cada pergunta deve ter 4 opções de resposta.

Formate a resposta APENAS como JSON puro, sem texto adicional:
{
  "survey": [
    {
      "question": "Pergunta aqui?",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"]
    }
  ]
}`;
                
            } else if (action === 'generate_roadmap') {
                prompt = `Aja como um consultor de carreira especializado em ESG e IA.
Com base nas informações:
- Perfil: ${data.perfil}
- Habilidades: ${data.habilidades.join(', ')}
- Respostas do questionário: ${data.surveyResults}
- Objetivo: ${data.objetivo}

Crie um roadmap profissional com 3-5 passos práticos.
Inclua sugestões de aprendizado, atividades práticas e networking.
Foque em ESG + IA.
Responda em formato Markdown.`;
            }
            
            if (!prompt) {
                return res.status(400).json({ response: "Ação não especificada." });
            }
            
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            let parsedResponse = text;
            if (action === 'generate_survey') {
                try {
                    parsedResponse = JSON.parse(text);
                } catch (e) {
                    console.error('Erro ao parsear JSON:', text);
                    return res.status(500).json({ response: "Erro ao gerar perguntas." });
                }
            }
            
            return res.json({ response: parsedResponse });
            
        } catch (error) {
            console.error('Erro Gemini:', error);
            return res.status(500).json({ response: "Erro na comunicação com IA: " + error.message });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
