import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    try {
        const { items, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Carrinho vazio' });
        }

        const order = await Order.create({ items, total });

        res.status(201).json(order);

    } catch (error) {
        console.error('❌ ERRO AO CRIAR PEDIDO:', error);
        res.status(500).json({
            message: 'Erro ao criar pedido',
            error: error.message
        });
    }
};
