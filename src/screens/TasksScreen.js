import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { createTask, deleteTask, getTasks, updateTask } from '../services/taskService';

export default function TasksScreen() {
    // Obtenemos el usuario para leer y guardar solo sus tareas.
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    // Guardamos qué tarea se está editando para cambiar solo esa fila a un TextInput.
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);

    const loadTasks = async () => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        try {
            // El servicio filtra las tareas usando el UID del usuario autenticado.
            const userTasks = await getTasks(user.uid);
            setTasks(userTasks);
        } catch (error) {
            Alert.alert('Tareas', 'No se pudieron cargar las tareas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, [user]);

    const handleAddTask = async () => {
        if (!title.trim() || !user) {
            return;
        }

        setSaving(true);
        try {
            // Guardamos la tarea y volvemos a consultar para mostrar el documento creado.
            await createTask({
                title,
                userId: user.uid,
            });
            setTitle('');
            await loadTasks();
        } catch (error) {
            Alert.alert('Tareas', 'No se pudo guardar la tarea.');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleTask = async (task) => {
        try {
            await updateTask(task.id, { completed: !task.completed });
            setTasks((currentTasks) => currentTasks.map((currentTask) => (
                currentTask.id === task.id
                    ? { ...currentTask, completed: !currentTask.completed }
                    : currentTask
            )));
        } catch (error) {
            Alert.alert('Tareas', 'No se pudo actualizar la tarea.');
        }
    };

    const handleStartEditing = (task) => {
        // Copiamos el título actual al formulario para que el alumno pueda modificarlo.
        setEditingTaskId(task.id);
        setEditingTitle(task.title);
    };

    const handleCancelEditing = () => {
        // Al cancelar, limpiamos el estado de edición sin tocar Firestore.
        setEditingTaskId(null);
        setEditingTitle('');
    };

    const handleSaveEditing = async (task) => {
        const trimmedTitle = editingTitle.trim();

        // Un título vacío no es válido, por eso no hacemos ninguna petición.
        if (!trimmedTitle) {
            return;
        }

        setSavingEdit(true);
        try {
            // Primero persistimos el cambio y después actualizamos la lista visible.
            await updateTask(task.id, { title: trimmedTitle });
            setTasks((currentTasks) => currentTasks.map((currentTask) => (
                currentTask.id === task.id
                    ? { ...currentTask, title: trimmedTitle }
                    : currentTask
            )));
            handleCancelEditing();
        } catch (error) {
            Alert.alert('Tareas', 'No se pudo actualizar el título.');
        } finally {
            setSavingEdit(false);
        }
    };

    const handleRemoveTask = (task) => {
        Alert.alert(
            'Eliminar tarea',
            `¿Quieres eliminar "${task.title}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // El documento solo se elimina después de confirmar en el Alert.
                            await deleteTask(task.id);
                            setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== task.id));
                        } catch (error) {
                            Alert.alert('Tareas', 'No se pudo eliminar la tarea.');
                        }
                    },
                },
            ],
        );
    };

    const renderTask = ({ item }) => (
        <View style={styles.taskRow}>
            <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.completed }}
                onPress={() => handleToggleTask(item)}
                style={[styles.checkButton, item.completed && styles.checkButtonCompleted]}
            >
                {item.completed && <Text style={styles.checkMark}>✓</Text>}
            </Pressable>
            {/* Mostramos un formulario solo para la tarea que el usuario eligió editar. */}
            {editingTaskId === item.id ? (
                <>
                    <TextInput
                        autoFocus
                        style={styles.editInput}
                        value={editingTitle}
                        onChangeText={setEditingTitle}
                        onSubmitEditing={() => handleSaveEditing(item)}
                        returnKeyType="done"
                    />
                    <Pressable onPress={() => handleSaveEditing(item)} disabled={savingEdit} style={styles.editButton}>
                        <Text style={styles.editText}>Guardar</Text>
                    </Pressable>
                    <Pressable onPress={handleCancelEditing} disabled={savingEdit} style={styles.deleteButton}>
                        <Text style={styles.deleteText}>Cancelar</Text>
                    </Pressable>
                </>
            ) : (
                <>
                    <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>{item.title}</Text>
                    <Pressable onPress={() => handleStartEditing(item)} style={styles.editButton}>
                        <Text style={styles.editText}>Editar</Text>
                    </Pressable>
                    <Pressable onPress={() => handleRemoveTask(item)} style={styles.deleteButton}>
                        <Text style={styles.deleteText}>Eliminar</Text>
                    </Pressable>
                </>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.badge}>FIRESTORE</Text>
            <Text style={styles.title}>Mis tareas</Text>
            <Text style={styles.subtitle}>Organiza tus pendientes.</Text>

            <View style={styles.addRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Nueva tarea"
                    placeholderTextColor="#94a3b8"
                    value={title}
                    onChangeText={setTitle}
                    onSubmitEditing={handleAddTask}
                    returnKeyType="done"
                />
                <Pressable style={styles.addButton} onPress={handleAddTask} disabled={saving}>
                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.addButtonText}>Añadir</Text>}
                </Pressable>
            </View>

            {loading ? (
                <ActivityIndicator color="#2563eb" size="large" style={styles.loader} />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(task) => task.id}
                    renderItem={renderTask}
                    contentContainerStyle={tasks.length === 0 && styles.emptyList}
                    ListEmptyComponent={<Text style={styles.emptyText}>Todavía no tienes tareas.</Text>}
                    style={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#f8fafc', flex: 1, padding: 28 },
    badge: { alignSelf: 'flex-start', backgroundColor: '#fef3c7', borderRadius: 6, color: '#b45309', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 18, paddingHorizontal: 10, paddingVertical: 6 },
    title: { color: '#0f172a', fontSize: 30, fontWeight: '800', marginBottom: 8 },
    subtitle: { color: '#64748b', fontSize: 16, marginBottom: 26 },
    addRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 20 },
    input: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: 7, borderWidth: 1, color: '#0f172a', flex: 1, marginRight: 10, padding: 14 },
    addButton: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 7, justifyContent: 'center', minHeight: 50, paddingHorizontal: 16 },
    addButtonText: { color: '#fff', fontWeight: '800' },
    loader: { marginTop: 30 },
    list: { flex: 1 },
    emptyList: { flexGrow: 1, justifyContent: 'center' },
    emptyText: { color: '#64748b', textAlign: 'center' },
    taskRow: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, flexDirection: 'row', marginBottom: 10, padding: 14 },
    checkButton: { alignItems: 'center', borderColor: '#94a3b8', borderRadius: 5, borderWidth: 2, height: 24, justifyContent: 'center', marginRight: 12, width: 24 },
    checkButtonCompleted: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
    checkMark: { color: '#fff', fontWeight: '800' },
    taskTitle: { color: '#0f172a', flex: 1, fontSize: 15 },
    taskTitleCompleted: { color: '#94a3b8', textDecorationLine: 'line-through' },
    editInput: { borderColor: '#2563eb', borderRadius: 6, borderWidth: 1, color: '#0f172a', flex: 1, marginRight: 8, padding: 8 },
    editButton: { marginLeft: 8, paddingVertical: 5 },
    editText: { color: '#2563eb', fontSize: 12, fontWeight: '700' },
    deleteButton: { marginLeft: 10, paddingVertical: 5 },
    deleteText: { color: '#dc2626', fontSize: 12, fontWeight: '700' },
});
