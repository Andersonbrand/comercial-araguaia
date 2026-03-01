import http from 'http'

function req(method, path, body, headers, label) {
    return new Promise(resolve => {
        const data = body ? JSON.stringify(body) : null
        const opts = {
            hostname: 'localhost', port: 3000, path, method,
            headers: { 'Content-Type': 'application/json', 'Content-Length': data ? Buffer.byteLength(data) : 0, ...headers }
        }
        const r = http.request(opts, res => {
            let d = ''
            res.on('data', c => d += c)
            res.on('end', () => {
                let parsed
                try { parsed = JSON.parse(d) } catch { parsed = d }
                const ok = res.statusCode < 400 ? '✓' : '✗'
                console.log(`${ok} [${res.statusCode}] ${label}`)
                if (res.statusCode >= 400) console.log(`   -> ${JSON.stringify(parsed).substring(0, 200)}`)
                resolve({ status: res.statusCode, body: parsed })
            })
        })
        r.on('error', e => { console.log(`✗ ERROR ${label}: ${e.message}`); resolve(null) })
        if (data) r.write(data)
        r.end()
    })
}

const ts = Date.now()
const testEmail = `testuser_${ts}@test.com`

console.log('\n========== API TEST SUITE ==========\n')

// 1. GET /products (public)
await req('GET', '/api/products', null, {}, 'GET /api/products (public)')

// 2. GET /products sem token de admin - deve retornar lista
await req('GET', '/api/products?page=1&limit=5', null, {}, 'GET /api/products?page=1&limit=5')

// 3. Registrar usuário
const reg = await req('POST', '/api/login/users', { name: 'Test User', email: testEmail, password: '123456' }, {}, 'POST /api/login/users (register)')

// 4. Registrar usuário duplicado - deve retornar 409
await req('POST', '/api/login/users', { name: 'Test User', email: testEmail, password: '123456' }, {}, 'POST /api/login/users (duplicate - expect 409)')

// 5. Login correto
const login = await req('POST', '/api/login/sessions', { email: testEmail, password: '123456' }, {}, 'POST /api/login/sessions (login)')
const token = login?.body?.token

if (token) {
    // 6. GET /me com token
    await req('GET', '/api/me', null, { Authorization: `Bearer ${token}` }, 'GET /api/me (authenticated)')

    // 7. GET /admin com user normal - deve retornar 403
    await req('GET', '/api/admin', null, { Authorization: `Bearer ${token}` }, 'GET /api/admin (user role - expect 403)')
} else {
    console.log('✗ Sem token - pulando testes autenticados')
}

// 8. GET /me sem token - deve 401
await req('GET', '/api/me', null, {}, 'GET /api/me (no token - expect 401)')

// 9. Login com senha errada - deve 401
await req('POST', '/api/login/sessions', { email: testEmail, password: 'errada' }, {}, 'POST /api/login/sessions (wrong password - expect 401)')

// 10. POST /orders
await req('POST', '/api/orders', {
    items: [{ productId: '000000000000000000000001', name: 'Produto Teste', price: 49.9, quantity: 2 }],
    total: 99.8
}, {}, 'POST /api/orders')

// 11. POST /orders vazio - deve 400
await req('POST', '/api/orders', { items: [], total: 0 }, {}, 'POST /api/orders (empty cart - expect 400)')

// 12. POST /quotes
await req('POST', '/api/quotes', {
    name: 'Ana Silva', email: 'ana@test.com', phone: '11999998888',
    address: 'Rua das Flores, 123', message: 'Preciso de orçamento para 50 unidades'
}, {}, 'POST /api/quotes')

// 13. POST /quotes com campos faltando - deve 400
await req('POST', '/api/quotes', { name: 'Ana' }, {}, 'POST /api/quotes (missing fields - expect 400)')

// 14. GET /products/:id inválido - deve 400
await req('GET', '/api/products/id-invalido', null, {}, 'GET /api/products/id-invalido (expect 400)')

console.log('\n====================================\n')
