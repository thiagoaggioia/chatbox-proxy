export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        return res.json({ status: 'Gemini API Ready' });
    }
    
    if (req.method === 'POST') {
        try {
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            
            const { action, data } = req.body || {};
            let prompt = '';
            
            if (action === 'generate_survey') {
                prompt = `Aja como consultor de carreira ESG/IA. Crie 10 perguntas múltipla escolha baseado em: Perfil: ${data.perfil}, Habilidades: ${data.habilidades.join(', ')}, Objetivo: ${data.objetivo}. Formato JSON: {"survey":[{"question":"...","options":["A","B","C","D"]}]}`;
            } else if (action === 'generate_roadmap') {
                prompt = `Aja como consultor ESG/IA. Crie roadmap profissional para: Perfil: ${data.perfil}, Habilidades: ${data.habilidades.join(', ')}, Respostas: ${data.surveyResults}, Objetivo: ${data.objetivo}. Resposta em Markdown com 3-5 passos práticos.`;
            }
            
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            let parsedResponse = text;
            if (action === 'generate_survey') {
                try {
                    parsedResponse = JSON.parse(text);
                } catch (e) {
                    return res.status(500).json({ response: "Erro ao gerar perguntas." });
                }
            }
            
            return res.json({ response: parsedResponse });
            
        } catch (error) {
            console.error('Erro Gemini:', error);
            return res.status(500).json({ response: "Erro na comunicação com IA." });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
