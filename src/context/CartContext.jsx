import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, onSnapshot, setDoc, collection, addDoc, Timestamp, runTransaction, increment } from "firebase/firestore";
import { db } from '../firebase';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
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

  const [couponDiscount, setCouponDiscount] = useState(0);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);

  // Real-time listener on users/{uid} — reads the 'cart' field
  useEffect(() => {
    if (!user) {
      setItems([]); // clear cart when user logs out
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setItems(docSnap.data().cart || []);
      } else {
        setItems([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // UI calculation updates
  useEffect(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    const taxableAmount = Math.max(0, subtotal - couponDiscount);
    const gst = taxableAmount * 0.18; // 18% GST for applicable products
    const delivery = subtotal > 0 && subtotal < 500 ? 49 : 0;
    const totalAmount =
      subtotal > 0
        ? subtotal - couponDiscount - loyaltyDiscount + gst + delivery
        : 0;

    setTotals({
      subtotal,
      gst,
      delivery,
      totalAmount,
      totalItems: count,
    });
  }, [items, couponDiscount, loyaltyDiscount]);

  // Write cart array into users/{uid}.cart
  const syncCartToFirestore = async (newItems) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { cart: newItems }, { merge: true });
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  const toggleCartDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const addItemToCart = (newItem) => {
    setItems((prevItems) => {
      let nextItems;
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        nextItems = prevItems.map((item) => {
          if (item.id === newItem.id) {
            const nextObj = {
              ...item,
              quantity: item.quantity + (newItem.quantity || 1),
            };
            if (newItem.stock && nextObj.quantity > newItem.stock) {
              nextObj.quantity = newItem.stock;
            }
            return nextObj;
          }
          return item;
        });
      } else {
        nextItems = [
          ...prevItems,
          { ...newItem, quantity: newItem.quantity || 1 },
        ];
      }
      syncCartToFirestore(nextItems);
      return nextItems;
    });
    setIsDrawerOpen(true);
  };

  const removeItemFromCart = (id) => {
    setItems((prevItems) => {
      const nextItems = prevItems.filter((item) => item.id !== id);
      syncCartToFirestore(nextItems);
      return nextItems;
    });
  };

  const updateQuantity = (id, quantity) => {
    setItems((prevItems) => {
      const nextItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
      syncCartToFirestore(nextItems);
      return nextItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    syncCartToFirestore([]);
  };

  const placeOrder = async (orderInfo) => {
    if (!user) return;
    
    try {
      await runTransaction(db, async (transaction) => {
        // 1. Stock Decrement
        for (const item of items) {
          const productRef = doc(db, "products", item.id);
          const productSnap = await transaction.get(productRef);
          if (!productSnap.exists()) throw new Error(`Product ${item.name} not found.`);
          const currentStock = productSnap.data().stock || 0;
          if (currentStock < item.quantity) throw new Error(`Not enough stock for ${item.name}`);
          
          transaction.update(productRef, { stock: increment(-item.quantity) });
        }

        // 2. Prepare Order
        const totalAmount = orderInfo.totalAmount || totals.totalAmount;
        const pts = Math.floor(totalAmount / 10);
        
        const orderData = {
          userId: user.uid,
          customer: orderInfo.customer,
          items: items.map(i => ({ ...i, qty: i.quantity })),
          paymentType: orderInfo.paymentType,
          paymentId: orderInfo.paymentId,
          status: orderInfo.status || 'confirmed',
          subtotal: totals.subtotal,
          gst: totals.gst,
          delivery: orderInfo.deliveryCharge !== undefined ? orderInfo.deliveryCharge : totals.delivery,
          totalAmount: totalAmount,
          pointsEarned: pts,
          createdAt: Timestamp.now(),
          statusHistory: [{ status: 'confirmed', timestamp: Timestamp.now(), note: 'Order placed successfully.' }]
        };

        const orderRef = doc(collection(db, "orders"));
        transaction.set(orderRef, orderData);
      });

      clearCart();
    } catch (err) {
      console.error("Order Transaction failed", err);
      throw err;
    }
  };

  const cartForSnippet = items.reduce((acc, item) => {
    acc[item.id] = { ...item, qty: item.quantity };
    return acc;
  }, {});

  const value = {
    items,
    ...totals,
    isDrawerOpen,
    couponDiscount,
    activeCoupon,
    loyaltyDiscount,
    setCouponDiscount,
    setActiveCoupon,
    setLoyaltyDiscount,
    toggleCartDrawer,
    addItemToCart,
    removeItemFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    cart: cartForSnippet,
    cartTotal: totals.totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
