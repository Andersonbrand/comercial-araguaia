import nodemailer from 'nodemailer';

function createTransporter() {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

export async function sendQuoteMail({ name, email, phone, address, document, message, items }) {
    const transporter = createTransporter();

    const itemsHtml = items && items.length > 0
        ? '<h3>Itens solicitados:</h3><ul>' + items.map(i => '<li>' + i.name + ' &mdash; ' + i.quantity + 'un</li>').join('') + '</ul>'
        : '<p><em>Nenhum item do carrinho.</em></p>';

    const info = await transporter.sendMail({
        from: '"Comercial Araguaia" <' + process.env.MAIL_USER + '>',
        to: process.env.MAIL_TO,
        subject: 'Novo Orcamento - ' + name,
        html:
            '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">' +
            '<div style="background:#1e3a5f;padding:24px 32px">' +
            '<h1 style="color:#fff;margin:0;font-size:20px">Comercial Araguaia</h1>' +
            '<p style="color:#94a3b8;margin:4px 0 0">Novo pedido de orcamento recebido</p>' +
            '</div>' +
            '<div style="padding:32px">' +
            '<h2 style="color:#1e3a5f;margin-top:0">Dados do Cliente</h2>' +
            '<table style="width:100%;border-collapse:collapse">' +
            '<tr><td style="padding:8px 0;color:#64748b;width:140px">Nome</td><td style="padding:8px 0;font-weight:600">' + name + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#64748b">E-mail</td><td style="padding:8px 0;font-weight:600">' + email + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#64748b">Telefone</td><td style="padding:8px 0;font-weight:600">' + phone + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#64748b">Endereco</td><td style="padding:8px 0;font-weight:600">' + address + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#64748b">CPF/CNPJ</td><td style="padding:8px 0;font-weight:600">' + (document || '-') + '</td></tr>' +
            '</table>' +
            '<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>' +
            '<h2 style="color:#1e3a5f">Mensagem</h2>' +
            '<p style="background:#f8fafc;padding:16px;border-radius:6px;margin:0">' + message + '</p>' +
            '<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>' +
            itemsHtml +
            '</div>' +
            '<div style="background:#f8fafc;padding:16px 32px;text-align:center">' +
            '<p style="color:#94a3b8;font-size:12px;margin:0">Enviado automaticamente pelo site Comercial Araguaia</p>' +
            '</div></div>',
    });

    reactTostify('E-mail enviado com sucesso:', info.messageId);
}
