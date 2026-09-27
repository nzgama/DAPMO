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

// Validamos los datos antes de enviarlos a Firestore, aunque la pantalla ya los valide.
const normalizeTitle = (title) => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
        throw new Error('El título de la tarea no puede estar vacío.');
    }

    return normalizedTitle;
};

// CREATE: recibe los datos de una tarea y devuelve el ID generado por Firestore.
export const createTask = async (task) => {
    const reference = await addDoc(tasksCollection, {
        ...task,
        completed: false,
        createdAt: serverTimestamp(),
        title: normalizeTitle(task.title),
    });

    return reference.id;
};

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

// UPDATE: modifica únicamente los campos enviados, sin reemplazar todo el documento.
export const updateTask = (taskId, data) => {
    const dataToSave = data.title === undefined
        ? data
        : { ...data, title: normalizeTitle(data.title) };

    return updateDoc(doc(db, 'tareas', taskId), dataToSave);
};

// DELETE: elimina el documento identificado por taskId.
export const deleteTask = (taskId) => deleteDoc(doc(db, 'tareas', taskId));
