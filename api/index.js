// Versão simplificada para debug
export default async function handler(req, res) {
    // Log para debug
    console.log('Method:', req.method);
    console.log('Origin:', req.headers.origin);
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    // Handle preflight request
    if (req.method === 'OPTIONS') {
        console.log('Preflight request received');
        return res.status(200).end();
    }
    
    // Test endpoint
    if (req.method === 'GET') {
        return res.status(200).json({ 
            message: 'API is working',
            timestamp: new Date().toISOString(),
            method: req.method
        });
    }
    
    // Para POST requests
    if (req.method === 'POST') {
        try {
            const { action, data } = req.body || {};
            
            // Por enquanto, retorna uma resposta mock para testar se o CORS funciona
            if (action === 'generate_survey') {
                return res.status(200).json({ 
                    response: {
                        survey: [
                            {
                                question: "Esta é uma pergunta de teste?",
                                options: ["Sim", "Não", "Talvez", "Não sei"]
                            }
                        ]
                    }
                });
            }
            
            if (action === 'generate_roadmap') {
                return res.status(200).json({ 
                    response: "# Roadmap de Teste\n\n1. Este é um teste\n2. CORS funcionando\n3. API respondendo"
                });
            }
            
            return res.status(400).json({ response: "Ação não especificada." });
            
        } catch (error) {
            console.error('Erro na API:', error);
            return res.status(500).json({ response: "Erro interno do servidor." });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
        console.error('Erro na API:', error);
        res.status(500).json({ response: "Desculpe, ocorreu um erro na comunicação. Por favor, tente novamente." });
    }
}
