export default function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method === 'GET') {
        res.json({ status: 'OK' });
        return;
    }
    
    if (req.method === 'POST') {
        const { action } = req.body || {};
        
        if (action === 'generate_survey') {
            res.json({
                response: {
                    survey: [
                        {
                            question: "Teste: CORS funcionando?",
                            options: ["Sim", "Não", "Talvez", "Erro"]
                        }
                    ]
                }
            });
            return;
        }
        
        if (action === 'generate_roadmap') {
            res.json({
                response: "# TESTE CORS\n\n✅ CORS funcionando\n✅ API respondendo\n✅ Site conectado"
            });
            return;
        }
        
        res.json({ response: "Ação não reconhecida" });
        return;
    }
    
    res.status(405).json({ error: 'Method not allowed' });
}
