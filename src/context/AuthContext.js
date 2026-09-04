import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// Centraliza el listener de sesión de Firebase para que toda la app comparta el mismo estado.
export function AuthProvider({ children }) {
    // Guardamos el usuario actual para decidir qué pantallas mostrar.
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        // Firebase avisa cada vez que la sesión cambia.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setCheckingSession(false);
        });

        // Dejamos de escuchar cuando el componente se desmonta.
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, checkingSession }}>
            {children}
        </AuthContext.Provider>
    );
}
