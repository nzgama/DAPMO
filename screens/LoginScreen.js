import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const firebaseMessages = {
    'auth/invalid-email': 'Escribe un correo electrónico válido.',
    'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
};

export default function LoginScreen({ navigation }) {
    // Estos estados controlan los campos y el estado visual del formulario.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const getErrorMessage = (error) => firebaseMessages[error.code] || 'No se pudo iniciar sesión.';

    const handleLogin = async () => {
        // Validamos antes de enviar datos a Firebase.
        if (!email.trim() || !password) {
            Alert.alert('Faltan datos', 'Completa el correo y la contraseña.');
            return;
        }

        setLoading(true);
        try {
            // Firebase comprueba las credenciales y crea la sesión.
            await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (error) {
            Alert.alert('Firebase Auth', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Escribe tu correo', 'Necesitamos tu correo para enviarte el enlace.');
            return;
        }

        try {
            // Firebase envía un enlace de recuperación al correo indicado.
            await sendPasswordResetEmail(auth, email.trim());
            Alert.alert('Correo enviado', 'Revisa tu bandeja para restablecer la contraseña.');
        } catch (error) {
            Alert.alert('Firebase Auth', getErrorMessage(error));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.badge}>FIREBASE AUTH</Text>
            <Text style={styles.title}>Bienvenido de nuevo</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar.</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Correo electrónico</Text>
                {/* value y onChangeText conectan el input con el estado. */}
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

                <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Entrar</Text>}
                </Pressable>
                <Pressable onPress={handleResetPassword} style={styles.linkButton}>
                    <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                </Pressable>
            </View>

            <Pressable onPress={() => navigation.navigate('Registro')} style={styles.bottomButton}>
                <Text style={styles.bottomText}>¿No tienes cuenta? <Text style={styles.linkText}>Regístrate</Text></Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 28, backgroundColor: '#f8fafc' },
    badge: { alignSelf: 'flex-start', backgroundColor: '#dbeafe', borderRadius: 6, color: '#1d4ed8', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 18, paddingHorizontal: 10, paddingVertical: 6 },
    title: { color: '#0f172a', fontSize: 30, fontWeight: '800', marginBottom: 8 },
    subtitle: { color: '#64748b', fontSize: 16, marginBottom: 26 },
    form: { backgroundColor: '#fff', borderRadius: 12, elevation: 3, padding: 20, shadowColor: '#0f172a', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
    label: { color: '#334155', fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 4 },
    input: { borderColor: '#cbd5e1', borderRadius: 7, borderWidth: 1, color: '#0f172a', marginBottom: 16, padding: 14 },
    passwordRow: { alignItems: 'center', borderColor: '#cbd5e1', borderRadius: 7, borderWidth: 1, flexDirection: 'row', marginBottom: 20 },
    passwordInput: { color: '#0f172a', flex: 1, padding: 14 },
    showPassword: { color: '#2563eb', fontWeight: '700', paddingHorizontal: 14 },
    primaryButton: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 7, justifyContent: 'center', minHeight: 50 },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    linkButton: { alignItems: 'center', marginTop: 18 },
    linkText: { color: '#2563eb', fontWeight: '700' },
    bottomButton: { alignItems: 'center', marginTop: 26 },
    bottomText: { color: '#64748b' },
});
