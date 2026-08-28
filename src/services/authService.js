import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

// El servicio concentra las llamadas a Firebase para que las pantallas no dependan del SDK.
export const login = (email, password) => signInWithEmailAndPassword(auth, email.trim(), password);

export const register = (email, password) => createUserWithEmailAndPassword(auth, email.trim(), password);

// Firebase envía al correo un enlace para que el usuario elija una nueva contraseña.
export const resetPassword = (email) => sendPasswordResetEmail(auth, email.trim());

export const logout = () => signOut(auth);

