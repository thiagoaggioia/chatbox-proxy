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

IMPORTANTE: Responda APENAS com JSON puro, sem markdown, sem \`\`\`json, sem explicações.

Formato exato:
{
  "survey": [
    {
      "question": "Pergunta aqui?",
      "options": ["A", "B", "C", "D"]
    }
  ]
}`;
                
            } else if (action === 'generate_roadmap') {
                prompt = `Você é um consultor de carreira especializado em ESG e IA.

Informações do usuário:
- Perfil: ${data.perfil}
- Habilidades: ${data.habilidades.join(', ')}
- Respostas: ${data.surveyResults}
- Objetivo: ${data.objetivo}

Crie um roadmap profissional detalhado com 4-5 passos práticos.
Inclua sugestões específicas de cursos, atividades práticas e networking.
Responda em formato Markdown.`;
            }
            
            if (!prompt) {
                return res.status(400).json({ response: "Ação não especificada." });
            }
            
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            
            let parsedResponse = text;
            
            if (action === 'generate_survey') {
                try {
                    // Remover blocos de código markdown
                    let jsonText = text;
                    
                    // Remover ```json e ```
                    jsonText = jsonText.replace(/```json\s*/g, '');
                    jsonText = jsonText.replace(/```\s*/g, '');
                    
                    // Encontrar o JSON
                    const jsonStart = jsonText.indexOf('{');
                    const jsonEnd = jsonText.lastIndexOf('}') + 1;
                    
                    if (jsonStart !== -1 && jsonEnd > jsonStart) {
                        jsonText = jsonText.substring(jsonStart, jsonEnd);
                    }
                    
                    console.log('JSON limpo para parse:', jsonText);
                    
                    parsedResponse = JSON.parse(jsonText);
                    
                    // Verificar estrutura
                    if (!parsedResponse.survey || !Array.isArray(parsedResponse.survey)) {
                        throw new Error('Estrutura JSON inválida');
                    }
                    
                } catch (e) {
                    console.error('Erro ao parsear JSON:', e.message);
                    console.error('Texto original:', text);
                    
                    // Questionário de fallback
                    parsedResponse = {
                        survey: [
                            {
                                question: "Qual seu nível atual de conhecimento em ESG?",
                                options: ["Básico", "Intermediário", "Avançado", "Especialista"]
                            },
                            {
                                question: "Como você avalia sua experiência com IA?",
                                options: ["Nenhuma", "Básica", "Moderada", "Avançada"]
                            },
                            {
                                question: "Qual área ESG mais te interessa?",
                                options: ["Ambiental", "Social", "Governança", "Todas"]
                            }
                        ]
                    };
                }
            }
            
            return res.json({ response: parsedResponse });
            
        } catch (error) {
            console.error('Erro Gemini:', error);
            return res.status(500).json({ response: "Erro na comunicação: " + error.message });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}

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
