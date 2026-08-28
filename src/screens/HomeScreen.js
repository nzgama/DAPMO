import { Pressable, StyleSheet, Text, View } from 'react-native';
import { auth } from '../firebase/firebase';
import { logout } from '../services/authService';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.successMark}><Text style={styles.successMarkText}>✓</Text></View>
            <Text style={styles.title}>Inicio</Text>
            <Text style={styles.subtitle}>Sesión iniciada correctamente</Text>
            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Usuario autenticado</Text>
                {/* currentUser contiene los datos del usuario autenticado. */}
                <Text style={styles.email}>{auth.currentUser?.email}</Text>
            </View>
            <Text style={styles.note}>Esta pantalla solo aparece cuando Firebase detecta un usuario autenticado.</Text>
            {/* La ruta Profile está declarada en AppStack. */}
            <Pressable style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.profileButtonText}>Ver perfil</Text>
            </Pressable>
            {/* Al cerrar sesión, AppNavigator volverá a mostrar Login. */}
            <Pressable style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', backgroundColor: '#f8fafc', flex: 1, justifyContent: 'center', padding: 28 },
    successMark: { alignItems: 'center', backgroundColor: '#dcfce7', borderRadius: 40, height: 80, justifyContent: 'center', marginBottom: 20, width: 80 },
    successMarkText: { color: '#16a34a', fontSize: 44, fontWeight: '800' },
    title: { color: '#0f172a', fontSize: 32, fontWeight: '800', marginBottom: 8 },
    subtitle: { color: '#64748b', fontSize: 16 },
    infoBox: { alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 10, marginTop: 28, padding: 18 },
    infoLabel: { color: '#64748b', fontSize: 13, marginBottom: 6 },
    email: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
    note: { color: '#64748b', fontSize: 13, lineHeight: 19, marginTop: 20, textAlign: 'center' },
    profileButton: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 7, marginTop: 24, paddingHorizontal: 28, paddingVertical: 14 },
    profileButtonText: { color: '#fff', fontWeight: '800' },
    button: { borderColor: '#2563eb', borderRadius: 7, borderWidth: 1, marginTop: 28, paddingHorizontal: 28, paddingVertical: 14 },
    buttonText: { color: '#2563eb', fontWeight: '800' },
});
