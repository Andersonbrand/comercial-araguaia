import Product from '../models/Product.js';
import mongoose from 'mongoose';

// GET /api/products
export const getAllProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 16;
        const skip = (page - 1) * limit;

        const filters = { isActive: true };

        // Filtro por categoria
        if (req.query.category) {
            filters.category = req.query.category;
        }

        // Busca por texto
        if (req.query.search) {
            filters.name = { $regex: req.query.search, $options: 'i' };
        }

        const total = await Product.countDocuments(filters);

        const products = await Product.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// GET /api/products/:id
export const getProductById = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const product = await Product.findById(req.params.id);

        if (!product || !product.isActive) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'ID inválido' });
    }
};

// POST /api/products
export const createProduct = async (req, res) => {
    try {
        const { name, category, description } = req.body;

        const imageUrl = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const product = await Product.create({
            name,
            category: category || null,
            description: description || null,
            imageUrl,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar produto", error });
    }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const { name, category, description } = req.body;

        const updateData = {
            name,
            category: category || null,
            description: description || null,
        };

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// DELETE /api/products/:id (soft delete)
export const deleteProduct = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.status(200).json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
