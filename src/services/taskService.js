import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const tasksCollection = collection(db, 'tareas');

// Guarda una tarea vinculada al usuario que la creó.
export const saveTask = (userId, title) => addDoc(tasksCollection, {
    completed: false,
    createdAt: serverTimestamp(),
    title: title.trim(),
    userId,
});

// Obtiene únicamente las tareas del usuario autenticado.
export const getTasks = async (userId) => {
    const tasksQuery = query(tasksCollection, where('userId', '==', userId));
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs
        .map((taskDocument) => ({ id: taskDocument.id, ...taskDocument.data() }))
        .sort((firstTask, secondTask) => {
            const firstTime = firstTask.createdAt?.toMillis?.() || 0;
            const secondTime = secondTask.createdAt?.toMillis?.() || 0;

            return secondTime - firstTime;
        });
};

// Cambia el estado completado de una tarea.
export const updateTaskStatus = (taskId, completed) => updateDoc(doc(db, 'tareas', taskId), {
    completed,
});

// Elimina una tarea por su identificador de Firestore.
export const removeTask = (taskId) => deleteDoc(doc(db, 'tareas', taskId));
