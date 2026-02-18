import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return { items: [], totalQuantity: 0, totalAmount: 0 };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return { items: [], totalQuantity: 0, totalAmount: 0 };
    }
};

const saveCartToStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('cart', serializedState);
    } catch (err) {
        // Ignore write errors
    }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            const quantityToAdd = newItem.quantity || 1;

            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    image: newItem.image,
                    quantity: quantityToAdd,
                    totalPrice: newItem.price * quantityToAdd
                });
            } else {
                existingItem.quantity += quantityToAdd;
                existingItem.totalPrice += newItem.price * quantityToAdd;
            }

            state.totalQuantity += quantityToAdd;
            state.totalAmount += newItem.price * quantityToAdd;
            saveCartToStorage(state);
        },
        removeFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.totalPrice;
                state.items = state.items.filter(item => item.id !== id);
                saveCartToStorage(state);
            }
        },
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem && quantity > 0) {
                const quantityDifference = quantity - existingItem.quantity;
                existingItem.quantity = quantity;
                existingItem.totalPrice = existingItem.price * quantity;

                state.totalQuantity += quantityDifference;
                state.totalAmount += quantityDifference * existingItem.price;
                saveCartToStorage(state);
            }
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            saveCartToStorage(state);
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
