export default async function handler(req, res) {
    // CORS headers - primeira coisa sempre
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Test endpoint
    if (req.method === 'GET') {
        return res.status(200).json({ status: 'API Working' });
    }
    
    // Handle POST
    if (req.method === 'POST') {
        try {
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const { action, data } = req.body || {};
            
            if (action === 'generate_survey') {
                const prompt = `Crie 10 perguntas sobre ESG e IA para o perfil: ${data.perfil}. Responda apenas JSON sem markdown:
{
  "survey": [
    {"question": "Pergunta?", "options": ["A","B","C","D"]}
  ]
}`;
                
                const result = await model.generateContent(prompt);
                let text = result.response.text().trim();
                
                // Limpar markdown simples
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                
                try {
                    const jsonResponse = JSON.parse(text);
                    return res.status(200).json({ response: jsonResponse });
                } catch (parseError) {
                    // Fallback se JSON inválido
                    return res.status(200).json({
                        response: {
                            survey: [
                                {
                                    question: "Qual seu conhecimento em ESG?",
                                    options: ["Básico", "Intermediário", "Avançado", "Especialista"]
                                },
                                {
                                    question: "Experiência com IA?",
                                    options: ["Nenhuma", "Básica", "Moderada", "Avançada"]
                                }
                            ]
                        }
                    });
                }
            }
            
            if (action === 'generate_roadmap') {
                const prompt = `Crie roadmap ESG+IA para: ${data.perfil}, habilidades: ${data.habilidades.join(', ')}, objetivo: ${data.objetivo}. Resposta em markdown com 4-5 passos práticos.`;
                
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                
                return res.status(200).json({ response: text });
            }
            
            return res.status(400).json({ response: "Ação não especificada" });
            
        } catch (error) {
            console.error('Erro:', error);
            return res.status(500).json({ response: "Erro interno: " + error.message });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
