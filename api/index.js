export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        return res.json({ status: 'working' });
    }
    
    if (req.method === 'POST') {
        const { action } = req.body || {};
        
        if (action === 'generate_survey') {
            return res.json({
                response: {
                    survey: [{ question: "Teste?", options: ["A", "B", "C", "D"] }]
                }
            });
        }
        
        if (action === 'generate_roadmap') {
            return res.json({ response: "# Teste Roadmap" });
        }
        
        return res.json({ response: "Ação inválida" });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
