import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        const exists = cartItems.find((item) => item._id === product._id);

        if (exists) {
            toast.info(`Quantidade de "${product.name}" atualizada no orçamento.`);
        } else {
            toast.success(`"${product.name}" adicionado ao orçamento!`);
        }

        setCartItems((prev) => {
            const alreadyIn = prev.find((item) => item._id === product._id);
            if (alreadyIn) {
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item._id === id ? { ...item, quantity } : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item._id !== id));
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
