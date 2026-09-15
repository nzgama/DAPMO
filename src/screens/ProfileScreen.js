import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUser } from '../services/userService';

export default function ProfileScreen() {
    // useAuth obtiene el usuario autenticado desde el contexto compartido.
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);

    // Usamos la primera letra del correo como avatar cuando no hay foto de perfil.
    const initial = user?.email?.charAt(0).toUpperCase() || 'U';

    useEffect(() => {
        const loadProfile = async () => {
            // La pantalla puede renderizarse antes de que exista un usuario.
            if (!user) {
                return;
            }

            // El UID permite encontrar el documento correspondiente en Firestore.
            const data = await getUser(user.uid);
            setProfile(data);
        };

        // Cargamos los datos cada vez que cambia la sesión activa.
        loadProfile();
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <Text style={styles.title}>Mi perfil</Text>
            <Text style={styles.subtitle}>Información de tu cuenta</Text>

            <View style={styles.infoBox}>
                <Text style={styles.label}>Correo electrónico</Text>
                <Text style={styles.value}>{profile?.email || 'No disponible'}</Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{profile?.nombre || 'No disponible'}</Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Identificador de usuario</Text>
                <Text style={styles.uid}>{user?.uid || 'No disponible'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', backgroundColor: '#f8fafc', flex: 1, justifyContent: 'center', padding: 28 },
    avatar: { alignItems: 'center', backgroundColor: '#dbeafe', borderRadius: 40, height: 80, justifyContent: 'center', marginBottom: 20, width: 80 },
    avatarText: { color: '#2563eb', fontSize: 34, fontWeight: '800' },
    title: { color: '#0f172a', fontSize: 32, fontWeight: '800', marginBottom: 8 },
    subtitle: { color: '#64748b', fontSize: 16 },
    infoBox: { alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 10, marginTop: 28, padding: 18 },
    label: { color: '#64748b', fontSize: 13, marginBottom: 6 },
    value: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
    divider: { backgroundColor: '#e2e8f0', height: 1, marginVertical: 18 },
    uid: { color: '#334155', fontSize: 13, lineHeight: 19 },
});
