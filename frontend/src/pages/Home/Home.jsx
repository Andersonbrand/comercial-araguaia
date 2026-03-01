import { useEffect, useState } from "react";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";

import Hero from "../../components/Hero/Hero";
import ProductGrid from "../../components/Products/ProductGrid";
import Suppliers from "../../components/Parceiros/Suppliers";
import AboutAraguaia from "../../components/Sobre/AboutAraguaia";
import "./home.css";

export default function Home() {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        api.get("/products")
            .then(response => {
                setProducts(response.data.products || []);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <main>
            <Hero />

            <section className="products-section">
                <h2 className="section-title">Produtos em destaque</h2>
                {products.length > 0 && (
                    <ProductGrid products={products.slice(0, 8)} onAdd={addToCart} />
                )}
            </section>

            <Suppliers />

            <AboutAraguaia />
        </main>
    );
}
