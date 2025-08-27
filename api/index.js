// Servidor de chat para a Vercel - Versão simplificada
// Este código usa a sintaxe CommonJS que a Vercel entende por padrão.

// Importa os módulos necessários
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Exporta a função que a Vercel vai executar
module.exports = async (req, res) => {
    // Configura o CORS para permitir requisições do seu site
    res.setHeader('Access-Control-Allow-Origin', 'https://thiagoaggio.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde a requisições OPTIONS (necessário para CORS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // A sua chave de API será lida de forma segura por uma variável de ambiente no Vercel
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const { message } = req.body;
        
        const prompt = `Você é um assistente de apoio para mulheres vítimas de violência doméstica da Procuradoria da Mulher de Joinville. Seu objetivo é ser empático, acolhedor e fornecer informações úteis e seguras, sempre reforçando que a segurança da pessoa é a prioridade. Não dê conselhos médicos ou jurídicos detalhados, mas oriente a buscar ajuda profissional. Sua resposta deve ser sempre em português. Responda a seguinte mensagem: "${message}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ response: text });
    } catch (error) {
        console.error('Erro na API:', error);
        res.status(500).json({ response: "Desculpe, ocorreu um erro. Por favor, tente novamente." });
    }
};
