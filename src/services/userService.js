import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Guarda los datos adicionales del usuario en un documento identificado por su UID.
export const saveUser = (uid, data) => setDoc(doc(db, 'usuarios', uid), data);

// Busca el perfil del usuario en la colección usuarios.
export const getUser = async (uid) => {
    const userRef = doc(db, 'usuarios', uid);
    const snapshot = await getDoc(userRef);

    // Un usuario autenticado puede no tener todavía un perfil guardado.
    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data();
};

