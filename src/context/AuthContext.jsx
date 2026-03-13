import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName || userData.name,
                            role: userData.role || 'customer',
                            loyaltyPoints: userData.loyaltyPoints || 0,
                            wishlist: userData.wishlist || []
                        });
                    } else {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            role: 'customer',
                            loyaltyPoints: 0,
                            wishlist: []
                        });
                    }
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error("Error fetching user document:", err);
                    setError("Failed to fetch user data.");
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logoutUser = async () => {
        try {
            await auth.signOut();
            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        setUser,
        setLoading,
        setError,
        logoutUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
