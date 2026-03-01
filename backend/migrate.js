import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API = 'https://comercial-araguaia-backend.onrender.com/api';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

const productSchema = new mongoose.Schema({
    name: String, imageUrl: String, category: String,
    description: String, isActive: Boolean,
});

async function getAdminToken() {
    const res = await fetch(`${API}/login/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
        }),
    });
    const data = await res.json();
    if (!data.token) throw new Error('Login falhou: ' + JSON.stringify(data));
    console.log('Login OK\n');
    return data.token;
}

async function migrate() {
    const LOCAL_URI = 'mongodb://localhost:27017/comercial-araguaia';

    console.log('Conectando ao banco LOCAL...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    const LocalProduct = localConn.model('Product', productSchema);

    const products = await LocalProduct.find({ isActive: true });
    console.log(`Encontrados ${products.length} produtos\n`);

    console.log('Fazendo login na API de producao...');
    const token = await getAdminToken();

    let ok = 0;
    let fail = 0;

    for (const p of products) {
        process.stdout.write(`Cadastrando: ${p.name} ... `);

        try {
            const form = new FormData();
            form.append('name', p.name);
            if (p.category)    form.append('category', p.category);
            if (p.description) form.append('description', p.description);

            if (p.imageUrl) {
                const filename = p.imageUrl.replace('/uploads/', '');
                const localPath = path.join(UPLOADS_DIR, filename);
                if (fs.existsSync(localPath)) {
                    form.append('image', fs.createReadStream(localPath), filename);
                }
            }

            const res = await fetch(`${API}/products`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, ...form.getHeaders() },
                body: form,
            });

            const data = await res.json();
            if (res.ok) {
                console.log(`OK (id: ${data._id})`);
                ok++;
            } else {
                console.log(`ERRO: ${JSON.stringify(data)}`);
                fail++;
            }
        } catch (err) {
            console.log(`ERRO: ${err.message}`);
            fail++;
        }
    }

    console.log(`\nFim! ${ok} cadastrados, ${fail} com erro.`);
    await localConn.close();
    process.exit(0);
}

migrate().catch(err => {
    console.error('Erro fatal:', err.message);
    process.exit(1);
});
