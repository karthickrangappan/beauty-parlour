import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [totals, setTotals] = useState({
        subtotal: 0,
        gst: 0,
        delivery: 0,
        totalAmount: 0,
        totalItems: 0,
    });
    
    
    const couponDiscount = 0;
    const loyaltyDiscount = 0;

    
    useEffect(() => {
        if (!user) {
            setItems([]);
            return;
        }

        const cartRef = doc(db, 'carts', user.uid);
        const unsubscribe = onSnapshot(cartRef, (docSnap) => {
            if (docSnap.exists()) {
                setItems(docSnap.data().items || []);
            } else {
                setItems([]);
            }
        });

        return () => unsubscribe();
    }, [user]);

    
    useEffect(() => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        
        const taxableAmount = Math.max(0, subtotal - couponDiscount);
        const gst = taxableAmount * 0.05; 
        const delivery = subtotal > 0 && subtotal < 500 ? 49 : 0;
        const totalAmount = subtotal > 0 ? subtotal - couponDiscount - loyaltyDiscount + gst + delivery : 0;

        setTotals({
            subtotal,
            gst,
            delivery,
            totalAmount,
            totalItems: count,
        });
    }, [items]);

    const syncCartToFirestore = async (newItems) => {
        if (!user) return;
        try {
            const cartRef = doc(db, 'carts', user.uid);
            await setDoc(cartRef, { items: newItems }, { merge: true });
        } catch (error) {
            console.error('Error syncing cart:', error);
        }
    };

    const toggleCartDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    const addItemToCart = (newItem) => {
        if (!user) {
            alert("Please login to add items to your curated collection.");
            return;
        }
        
        setItems(prevItems => {
            let nextItems;
            const existingItem = prevItems.find(item => item.id === newItem.id);
            if (existingItem) {
                
                nextItems = prevItems.map(item => {
                    if (item.id === newItem.id) {
                        const nextObj = { ...item, quantity: item.quantity + (newItem.quantity || 1) };
                        if (newItem.stock && nextObj.quantity > newItem.stock) {
                            nextObj.quantity = newItem.stock;
                        }
                        return nextObj;
                    }
                    return item;
                });
            } else {
                nextItems = [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
            }
            syncCartToFirestore(nextItems);
            return nextItems;
        });
        setIsDrawerOpen(true);
    };

    const removeItemFromCart = (id) => {
        setItems(prevItems => {
            const nextItems = prevItems.filter(item => item.id !== id);
            syncCartToFirestore(nextItems);
            return nextItems;
        });
    };

    const updateQuantity = (id, quantity) => {
        setItems(prevItems => {
            const nextItems = prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            );
            syncCartToFirestore(nextItems);
            return nextItems;
        });
    };

    const clearCart = () => {
        setItems([]);
        syncCartToFirestore([]);
    };

    const value = {
        items,
        ...totals,
        isDrawerOpen,
        toggleCartDrawer,
        addItemToCart,
        removeItemFromCart,
        updateQuantity,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
