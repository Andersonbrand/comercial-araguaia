import Quote from '../models/Quote.js';
import { sendQuoteMail } from '../../utils/mailer.js';

export const createQuote = async (req, res) => {
    try {
        const { name, email, phone, address, document, message, items } = req.body;

        if (!name || !email || !phone || !address || !document || !message) {
            return res.status(400).json({ message: 'Todos os campos sao obrigatorios' });
        }

        const quote = await Quote.create({ name, email, phone, address, document, message });

        console.log('[MAIL] Tentando enviar para:', process.env.MAIL_TO);
        console.log('[MAIL] Usando conta:', process.env.MAIL_USER);
        console.log('[MAIL] MAIL_PASS definido:', !!process.env.MAIL_PASS);

        try {
            await sendQuoteMail({ name, email, phone, address, document, message, items });
            console.log('[MAIL] Enviado com sucesso');
        } catch (err) {
            console.error('[MAIL ERROR] Codigo:', err.code);
            console.error('[MAIL ERROR] Mensagem:', err.message);
            console.error('[MAIL ERROR] Resposta SMTP:', err.response);
        }

        res.status(201).json(quote);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar orcamento' });
    }
};