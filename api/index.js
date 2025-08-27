export default function handler(req, res) {
    console.log('API chamada:', req.method);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Test GET
    if (req.method === 'GET') {
        return res.status(200).json({ 
            message: 'API funcionando!', 
            timestamp: new Date().toISOString()
        });
    }
    
    // Handle POST
    if (req.method === 'POST') {
        const { action } = req.body || {};
        
        if (action === 'generate_survey') {
            return res.status(200).json({
                response: {
                    survey: [
                        {
                            question: "Pergunta de teste 1?",
                            options: ["A", "B", "C", "D"]
                        }
                    ]
                }
            });
        }
        
        if (action === 'generate_roadmap') {
            return res.status(200).json({
                response: "# Roadmap de Teste\n\n1. Primeiro passo\n2. Segundo passo"
            });
        }
        
        return res.status(400).json({ response: "Ação não especificada" });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
}
