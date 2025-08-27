export default async function handler(req, res) {
    console.log('=== INÍCIO DA REQUISIÇÃO ===');
    console.log('Method:', req.method);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS request');
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        console.log('GET request');
        return res.json({ status: 'Gemini API Ready - Debug Mode' });
    }
    
    if (req.method === 'POST') {
        try {
            console.log('POST request recebido');
            console.log('Body:', req.body);
            
            // Testar se consegue importar
            console.log('Tentando importar GoogleGenerativeAI...');
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            console.log('Import realizado com sucesso');
            
            // Testar se tem a API key
            console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
            
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            console.log('Modelo criado com sucesso');
            
            const { action, data } = req.body || {};
            console.log('Action:', action);
            console.log('Data:', data);
            
            // Por enquanto, retornar resposta de teste
            if (action === 'generate_survey') {
                return res.json({
                    response: {
                        survey: [
                            { question: "Debug: Gemini conectado?", options: ["Sim", "Não", "Talvez", "Erro"] }
                        ]
                    }
                });
            }
            
            if (action === 'generate_roadmap') {
                return res.json({
                    response: "# Debug Mode\n\n✅ Gemini importado\n✅ API Key detectada\n✅ Modelo criado"
                });
            }
            
            return res.json({ response: "Ação não reconhecida" });
            
        } catch (error) {
            console.error('=== ERRO CAPTURADO ===');
            console.error('Erro completo:', error);
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
            return res.status(500).json({ 
                response: "Erro debug: " + error.message,
                error: error.toString()
            });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
