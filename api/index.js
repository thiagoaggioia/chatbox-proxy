export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        return res.json({ status: 'Gemini API Working' });
    }
    
    if (req.method === 'POST') {
        try {
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const { action, data } = req.body || {};
            let prompt = '';
            
            if (action === 'generate_survey') {
                prompt = `Você é um consultor de carreira ESG e IA. Crie EXATAMENTE 10 perguntas de múltipla escolha baseadas em:

Perfil: ${data.perfil}
Habilidades: ${data.habilidades.join(', ')}
Objetivo: ${data.objetivo}

IMPORTANTE: Responda APENAS com JSON válido, sem explicações ou texto adicional.

Exemplo do formato exato:
{
  "survey": [
    {
      "question": "Qual seu nível de conhecimento em sustentabilidade corporativa?",
      "options": ["Básico", "Intermediário", "Avançado", "Especialista"]
    },
    {
      "question": "Como você avalia sua experiência com ferramentas de IA?",
      "options": ["Nenhuma", "Básica", "Moderada", "Avançada"]
    }
  ]
}

Crie 10 perguntas similares focadas em ESG e IA:`;
                
            } else if (action === 'generate_roadmap') {
                prompt = `Você é
