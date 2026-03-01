import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';
import products from './products.js';

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Product.deleteMany();
        console.log('🧹 Produtos antigos removidos');

        await Product.insertMany(products);
        console.log('🌱 Produtos inseridos com sucesso');

        process.exit();
    } catch (error) {
        console.error('🔴 Erro ao rodar seed:', error.message);
        process.exit(1);
    }
};

seed();
