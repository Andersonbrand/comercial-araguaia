import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/Products/ProductCard';
import { useCart } from '../../context/CartContext';
import './products.css';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/products').then((response) => {
            setProducts(response.data.products || []);
        });
    }, []);

    const categories = useMemo(() => {
        const cats = products.map((p) => p.category).filter(Boolean);
        return ['Todos', ...Array.from(new Set(cats))];
    }, [products]);

    const filtered = useMemo(() => {
        if (selectedCategory === 'Todos') return products;
        return products.filter((p) => p.category === selectedCategory);
    }, [products, selectedCategory]);

    return (
        <div className="products-page">
            <aside className="products-sidebar">
                <h3 className="sidebar-title">Categorias</h3>
                <ul className="sidebar-list">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                className={`sidebar-btn${selectedCategory === cat ? ' active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            <section className="products-main">
                <div className="products-topbar">
                    <h2 className="tittle-grid">
                        {selectedCategory === 'Todos' ? 'Todos os Produtos' : selectedCategory}
                        <span className="products-count">{filtered.length} produto{filtered.length !== 1 ? 's' : ''}</span>
                    </h2>

                    <a
                        className="catalog-btn"
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ver Catálogo Completo
                    </a>
                </div>

                <select
                    className="products-category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                {filtered.length === 0 ? (
                    <p className="products-empty">Nenhum produto encontrado nessa categoria.</p>
                ) : (
                    <div className="products-grid">
                        {filtered.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAdd={addToCart}
                                onClick={() => navigate(`/produtos/${product._id}`)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
