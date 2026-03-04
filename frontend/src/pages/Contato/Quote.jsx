import './quote.css';

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

// =============================================
// CONTATOS POR TIPO DE DOCUMENTO
// Round-robin: reveza entre os contatos na ordem
// =============================================
const WHATSAPP_PF = [
    '5577988148246', // Contato 1 - Pessoa Física
    '5577998295469', // Contato 2 - Pessoa Física
    '5577981019124', // Contato 3 - Pessoa Física
];

const WHATSAPP_PJ = [
    '5577988149413', // Contato 4 - Pessoa Jurídica
    '5577991358534', // Contato 5 - Pessoa Jurídica
    '5577999312912', // Contato 6 - Pessoa Jurídica
];

const MAIL_TO = 'robertaaraguaia10@gmail.com';

// =============================================
// ÍNDICES DO ROUND-ROBIN (persistem na sessão)
// =============================================
let roundRobinIndexPF = 0;
let roundRobinIndexPJ = 0;

function getNextWhatsAppNumber(type) {
    if (type === 'PF') {
        const number = WHATSAPP_PF[roundRobinIndexPF % WHATSAPP_PF.length];
        roundRobinIndexPF++;
        return number;
    } else {
        const number = WHATSAPP_PJ[roundRobinIndexPJ % WHATSAPP_PJ.length];
        roundRobinIndexPJ++;
        return number;
    }
}

// =============================================
// UTILITÁRIOS DE DOCUMENTO
// =============================================
function formatDocument(value) {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length <= 11) {
        return digits
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return digits
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function getDocumentLabel(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return 'CPF / CNPJ';
    if (digits.length <= 11) return 'CPF';
    return 'CNPJ';
}

function getDocumentType(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) return 'PF';
    if (digits.length === 14) return 'PJ';
    return null;
}

function validateDocument(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length === 11 || digits.length === 14;
}

// =============================================
// UTILITÁRIOS DE E-MAIL
// =============================================
function getEmailProvider(email) {
    const domain = email.trim().toLowerCase().split('@')[1] || '';
    if (domain === 'gmail.com') return 'gmail';
    if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') return 'outlook';
    if (domain === 'yahoo.com' || domain === 'yahoo.com.br') return 'yahoo';
    return 'default';
}

function buildEmailBody(currentForm, currentItems) {
    const docLabel = getDocumentLabel(currentForm.document);
    const itemsText = currentItems.length > 0
        ? '\n\nItens do Orçamento:\n' + currentItems.map(i => `- ${i.name} (x${i.quantity})`).join('\n')
        : '\n\nNenhum item no carrinho.';

    return (
        `Nome: ${currentForm.name}` +
        `\nE-mail: ${currentForm.email}` +
        `\nTelefone: ${currentForm.phone}` +
        `\nEndereço: ${currentForm.address}` +
        `\n${docLabel}: ${currentForm.document}` +
        itemsText +
        `\n\nMensagem: ${currentForm.message}`
    );
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
export default function Quote() {
    const { cartItems, clearCart } = useCart();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        document: '',
        message: '',
    });
    const [status, setStatus] = useState(null);
    const [whatsappPending, setWhatsappPending] = useState(false);

    // Detecta retorno do WhatsApp → sucesso + limpa carrinho
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && whatsappPending) {
                setWhatsappPending(false);
                setStatus({ type: 'success', text: 'Orçamento enviado pelo WhatsApp com sucesso!' });
                clearCart();
                setForm({ name: '', email: '', phone: '', address: '', document: '', message: '' });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [whatsappPending, clearCart]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'document') {
            setForm({ ...form, document: formatDocument(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
        if (status) setStatus(null);
    };

    // =============================================
    // VALIDAÇÃO
    // =============================================
    function validateForm() {
        if (cartItems.length === 0) {
            setStatus({ type: 'error', text: 'Adicione pelo menos um item ao orçamento antes de enviar.' });
            return false;
        }
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim() || !form.document.trim() || !form.message.trim()) {
            setStatus({ type: 'error', text: 'Preencha todos os campos antes de enviar.' });
            return false;
        }
        if (!validateDocument(form.document)) {
            setStatus({ type: 'error', text: 'CPF deve ter 11 dígitos e CNPJ deve ter 14 dígitos.' });
            return false;
        }
        return true;
    }

    // =============================================
    // WHATSAPP — Round-robin por tipo de documento
    // =============================================
    const handleWhatsAppClick = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const docType = getDocumentType(form.document);

        // Segurança: bloqueia se CPF/CNPJ ainda não foi identificado
        if (!docType) {
            setStatus({ type: 'error', text: 'Preencha o CPF (11 dígitos) ou CNPJ (14 dígitos) corretamente.' });
            return;
        }

        const number = getNextWhatsAppNumber(docType);
        const docLabel = getDocumentLabel(form.document);
        const docInfo = form.document ? `\n${docLabel}: ${form.document}` : '';
        const itemsText = cartItems.length > 0
            ? '\n\nItens:\n' + cartItems.map(i => `- ${i.name} (x${i.quantity})`).join('\n')
            : '';

        const text =
            `Olá! Me chamo ${form.name} e gostaria de solicitar um orçamento.` +
            docInfo +
            itemsText +
            `\n\nMensagem: ${form.message}`;

        window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank');
        setWhatsappPending(true);
    };

    // =============================================
    // E-MAIL — Detecta provedor pelo domínio
    // =============================================
    const handleEmailClick = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const subject = encodeURIComponent('Novo Orçamento - ' + form.name);
        const body = encodeURIComponent(buildEmailBody(form, cartItems));
        const provider = getEmailProvider(form.email);

        if (provider === 'gmail') {
            window.open(`https://mail.google.com/mail/?view=cm&to=${MAIL_TO}&su=${subject}&body=${body}`, '_blank');
        } else if (provider === 'outlook') {
            window.open(`https://outlook.live.com/mail/0/deeplink/compose?to=${MAIL_TO}&subject=${subject}&body=${body}`, '_blank');
        } else if (provider === 'yahoo') {
            window.open(`https://compose.mail.yahoo.com/?to=${MAIL_TO}&subject=${subject}&body=${body}`, '_blank');
        } else {
            window.location.href = `mailto:${MAIL_TO}?subject=${subject}&body=${body}`;
        }

        toast.success('Abrindo seu e-mail com o orçamento preenchido!');
        clearCart();
        setForm({ name: '', email: '', phone: '', address: '', document: '', message: '' });
    };

    const docLabel = getDocumentLabel(form.document);
    const docType = getDocumentType(form.document);

    return (
        <section className="quote-section">
            <div className="quote-wrapper">

                {/* COLUNA ESQUERDA */}
                <div className="quote-left">
                    <h2 className="quote-title">Orçamento</h2>

                    <p className="quote-description">
                        Quer saber mais sobre nossos produtos e serviços e como podemos ajudar
                        na sua obra? Entre em contato com a gente pelos canais abaixo.
                    </p>

                    {/* ITENS DO CARRINHO */}
                    {cartItems.length > 0 && (
                        <div className="quote-cart-summary">
                            <h3 className="quote-cart-summary__title">Itens do seu orçamento</h3>
                            <ul className="quote-cart-summary__list">
                                {cartItems.map((item) => (
                                    <li key={item._id} className="quote-cart-summary__item">
                                        <span className="quote-cart-summary__name">{item.name}</span>
                                        <span className="quote-cart-summary__qty">x{item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ALERTA DE STATUS */}
                    {status && (
                        <div className={`quote-alert quote-alert--${status.type}`}>
                            {status.text}
                        </div>
                    )}

                    {/* INDICADOR DE TIPO DE CLIENTE */}
                    {docType && (
                        <div className={`quote-doc-badge quote-doc-badge--${docType.toLowerCase()}`}>
                            {docType === 'PF'
                                ? '👤 Pessoa Física — atendimento direcionado ao consultor de varejo'
                                : '🏢 Pessoa Jurídica — atendimento direcionado ao consultor comercial'}
                        </div>
                    )}

                    {/* FORMULÁRIO */}
                    <form className="quote-form" noValidate>
                        <input
                            name="name"
                            placeholder="Nome *"
                            value={form.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="E-mail *"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Telefone *"
                            value={form.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                            required
                        />
                        <input
                            name="address"
                            placeholder="Endereço *"
                            value={form.address}
                            onChange={handleChange}
                            autoComplete="street-address"
                            required
                        />

                        <div className="quote-document-field">
                            <input
                                name="document"
                                placeholder={`${docLabel} *`}
                                value={form.document}
                                onChange={handleChange}
                                inputMode="numeric"
                                autoComplete="off"
                            />
                            {form.document.replace(/\D/g, '').length > 0 && (
                                <span className="quote-document-label">{docLabel}</span>
                            )}
                        </div>

                        <textarea
                            className="quote-textarea"
                            name="message"
                            placeholder="Mensagem *"
                            value={form.message}
                            onChange={handleChange}
                            autoComplete="off"
                        />

                        <div className="quote-actions">
                            {/* E-MAIL */}
                            <button
                                type="button"
                                className="quote-button"
                                onClick={handleEmailClick}
                            >
                                Enviar por e-mail →
                            </button>

                            {/* WHATSAPP — redireciona PF ou PJ via round-robin */}
                            <button
                                type="button"
                                className="quote-whatsapp"
                                onClick={handleWhatsAppClick}
                            >
                                Enviar pelo WhatsApp
                            </button>
                        </div>
                    </form>
                </div>

                {/* COLUNA DIREITA */}
                <div className="quote-right">
                    <div className="contact-card">
                        <div className="contact-item">
                            <h4>📍 Endereço</h4>
                            <p>BR 122 km 02 – Saída para Pindaí<br />Guanambi – BA, 46430-000</p>
                        </div>

                        <div className="contact-item">
                            <h4>📞 Telefone</h4>
                            <p>
                                <a className="contact-link" href="tel:+5577981046133">+55 77 98104-6133</a>
                            </p>
                        </div>

                        <div className="contact-item">
                            <h4>💬 WhatsApp</h4>
                            <p>
                                <a
                                    className="contact-link contact-link--whatsapp"
                                    href="https://wa.me/5577981046133"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Abrir conversa
                                </a>
                            </p>
                        </div>

                        <div className="contact-item">
                            <h4>✉️ Email</h4>
                            <p>
                                <a className="contact-link" href="mailto:comercialaraguaia2018@outlook.com">
                                    comercialaraguaia2018@outlook.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}