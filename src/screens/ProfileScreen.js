import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUser } from '../services/userService';
import { pickImage, takeImage } from '../services/imageService';

export default function ProfileScreen() {
    // useAuth obtiene el usuario autenticado desde el contexto compartido.
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);

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

        // Cargamos los datos al entrar; elegir una foto ocurre al tocar un botón.
        loadProfile();
    }, [user]);

    const handleImageSelection = async (selectImage) => {
        setLoadingImage(true);

        try {
            const image = await selectImage();

            // El servicio devuelve null si se cancela; conservamos el avatar actual.
            if (image?.uri) {
                setProfileImage(image.uri);
            }
        } finally {
            setLoadingImage(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatar}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                    <Text style={styles.avatarText}>{initial}</Text>
                )}
            </View>
            <View style={styles.imageActions}>
                <Pressable
                    accessibilityRole="button"
                    disabled={loadingImage}
                    onPress={() => handleImageSelection(pickImage)}
                    style={[styles.imageButton, styles.galleryButton, loadingImage && styles.disabledButton]}
                >
                    <Text style={styles.galleryButtonText}>Elegir de galería</Text>
                </Pressable>
                <Pressable
                    accessibilityRole="button"
                    disabled={loadingImage}
                    onPress={() => handleImageSelection(takeImage)}
                    style={[styles.imageButton, styles.cameraButton, loadingImage && styles.disabledButton]}
                >
                    <Text style={styles.cameraButtonText}>Tomar foto</Text>
                </Pressable>
            </View>
            {loadingImage && <ActivityIndicator color="#2563eb" style={styles.loadingIndicator} />}
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
    avatar: { alignItems: 'center', backgroundColor: '#dbeafe', borderRadius: 40, height: 80, justifyContent: 'center', marginBottom: 14, overflow: 'hidden', width: 80 },
    avatarImage: { height: '100%', width: '100%' },
    avatarText: { color: '#2563eb', fontSize: 34, fontWeight: '800' },
    imageActions: { flexDirection: 'row', gap: 10, marginBottom: 8 },
    imageButton: { alignItems: 'center', borderRadius: 7, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
    galleryButton: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
    galleryButtonText: { color: '#fff', fontWeight: '700' },
    cameraButton: { borderColor: '#16a34a' },
    cameraButtonText: { color: '#15803d', fontWeight: '700' },
    disabledButton: { opacity: 0.55 },
    loadingIndicator: { marginBottom: 8 },
    title: { color: '#0f172a', fontSize: 32, fontWeight: '800', marginBottom: 8 },
    subtitle: { color: '#64748b', fontSize: 16 },
    infoBox: { alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 10, marginTop: 28, padding: 18 },
    label: { color: '#64748b', fontSize: 13, marginBottom: 6 },
    value: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
    divider: { backgroundColor: '#e2e8f0', height: 1, marginVertical: 18 },
    uid: { color: '#334155', fontSize: 13, lineHeight: 19 },
});
