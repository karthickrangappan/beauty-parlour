import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from '../firebase';
import {
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setWishlistItems([]); 
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setWishlistItems(docSnap.data().wishlist || []);
      } else {
        setWishlistItems([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const addToWishlist = async (product) => {
    setWishlistItems((prevItems) => {
      const isExist = prevItems.find((item) => item.id === product.id);
      if (!isExist) {
        const nextItems = [...prevItems, product];
        updateFirestoreWishlist(nextItems);
        return nextItems;
      }
      return prevItems;
    });
  };

  const removeFromWishlist = async (productId) => {
    setWishlistItems((prevItems) => {
      const nextItems = prevItems.filter((item) => item.id !== productId);
      updateFirestoreWishlist(nextItems);
      return nextItems;
    });
  };

  const updateFirestoreWishlist = async (items) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { wishlist: items }, { merge: true });
    } catch (error) {
      console.error("Error updating wishlist in firestore", error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    updateFirestoreWishlist([]);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
