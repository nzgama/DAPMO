import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const firebaseMessages = {
    'auth/email-already-in-use': 'Ese correo ya tiene una cuenta.',
    'auth/invalid-email': 'Escribe un correo electrónico válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
};

export default function RegisterScreen({ navigation }) {
    // Guardamos los datos que escribe el alumno en el formulario.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        // No intentamos registrar usuarios con campos vacíos.
        if (!email.trim() || !password) {
            Alert.alert('Faltan datos', 'Completa el correo y la contraseña.');
            return;
        }

        setLoading(true);
        try {
            // Firebase crea la cuenta y también inicia la sesión.
            await createUserWithEmailAndPassword(auth, email.trim(), password);
        } catch (error) {
            Alert.alert('Firebase Auth', firebaseMessages[error.code] || 'No se pudo crear la cuenta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.badge}>NUEVO USUARIO</Text>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>Regístrate con correo y contraseña.</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    placeholder="tu@correo.com"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordRow}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor="#94a3b8"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Text style={styles.showPassword}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                    </Pressable>
                </View>

                <Pressable style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Crear cuenta</Text>}
                </Pressable>
            </View>

            <Pressable onPress={() => navigation.navigate('Login')} style={styles.bottomButton}>
                <Text style={styles.bottomText}>¿Ya tienes cuenta? <Text style={styles.linkText}>Inicia sesión</Text></Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 28, backgroundColor: '#f8fafc' },
    badge: { alignSelf: 'flex-start', backgroundColor: '#dcfce7', borderRadius: 6, color: '#15803d', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 18, paddingHorizontal: 10, paddingVertical: 6 },
    title: { color: '#0f172a', fontSize: 30, fontWeight: '800', marginBottom: 8 },
    subtitle: { color: '#64748b', fontSize: 16, marginBottom: 26 },
    form: { backgroundColor: '#fff', borderRadius: 12, elevation: 3, padding: 20, shadowColor: '#0f172a', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
    label: { color: '#334155', fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 4 },
    input: { borderColor: '#cbd5e1', borderRadius: 7, borderWidth: 1, color: '#0f172a', marginBottom: 16, padding: 14 },
    passwordRow: { alignItems: 'center', borderColor: '#cbd5e1', borderRadius: 7, borderWidth: 1, flexDirection: 'row', marginBottom: 20 },
    passwordInput: { color: '#0f172a', flex: 1, padding: 14 },
    showPassword: { color: '#2563eb', fontWeight: '700', paddingHorizontal: 14 },
    primaryButton: { alignItems: 'center', backgroundColor: '#16a34a', borderRadius: 7, justifyContent: 'center', minHeight: 50 },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    bottomButton: { alignItems: 'center', marginTop: 26 },
    bottomText: { color: '#64748b' },
    linkText: { color: '#2563eb', fontWeight: '700' },
});
