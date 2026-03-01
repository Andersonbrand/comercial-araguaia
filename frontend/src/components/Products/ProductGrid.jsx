import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import "./product-grid.css";

export default function ProductGrid({ products, onAdd }) {
    const navigate = useNavigate();

    return (
        <div className="products-grid">
            {products.map(product => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onAdd={onAdd}
                    onClick={() => navigate(`/produtos/${product._id}`)}
                />
            ))}
        </div>
    );
}
