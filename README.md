# ExpoAppUsers

Ejemplo educativo de una aplicación React Native con Expo, Firebase Authentication y React Navigation. El proyecto separa la autenticación en un servicio, comparte la sesión con un contexto global y muestra rutas distintas según exista o no un usuario autenticado.

La aplicación permite:

- Crear una cuenta con correo y contraseña.
- Iniciar sesión.
- Recuperar la contraseña por correo electrónico.
- Mostrar pantallas privadas para usuarios autenticados.
- Consultar los datos básicos del usuario en una pantalla de perfil.
- Cerrar sesión.

## Requisitos

- Node.js 20.19 o superior.
- npm.
- Una cuenta de Firebase.
- Expo Go en el teléfono, o un emulador de Android/iOS.

Puedes comprobar las versiones instaladas con:

```bash
node --version
npm --version
```

## Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone git@github.com:nzgama/DAPMO.git ExpoAppUsers
cd ExpoAppUsers
```

Instala las dependencias:

```bash
npm install
```

## Configuración de Firebase

La aplicación utiliza Firebase Authentication con el proveedor de correo y contraseña.

1. Entra en [Firebase Console](https://console.firebase.google.com/).
2. Abre el proyecto `prueba-moviles-4de17` o crea uno nuevo.
3. Ve a **Authentication**.
4. Entra en **Sign-in method**.
5. Activa **Email/Password**.
6. Guarda los cambios.

La configuración de Firebase se encuentra en [src/firebase/firebase.js](src/firebase/firebase.js). El archivo [src/firebase/firebase.example.js](src/firebase/firebase.example.js) muestra el formato esperado de `firebaseConfig`. Si utilizas otro proyecto de Firebase, reemplaza los valores por los de tu aplicación web.

> Las claves de configuración web de Firebase no sustituyen las reglas de seguridad del proyecto. No coloques contraseñas, tokens privados o claves de servidor en la aplicación.

## Levantar el proyecto

Inicia el servidor de desarrollo:

```bash
npm start
```

Expo mostrará un código QR y varias opciones:

- Escanea el QR con Expo Go para abrir la aplicación en el teléfono.
- Presiona `a` para abrir Android, si tienes un emulador disponible.
- Presiona `i` para abrir iOS, en macOS con Xcode.
- Presiona `w` para abrir la versión web.

También puedes usar directamente estos comandos:

```bash
npm run android
npm run ios
npm run web
```

El teléfono y el ordenador deben estar en la misma red cuando utilices Expo Go. Si el QR no funciona, prueba:

```bash
npx expo start --tunnel
```

## Flujo de la aplicación

1. `App.js` envuelve la navegación con `AuthProvider`.
2. `AuthProvider` escucha los cambios de sesión con `onAuthStateChanged` y expone `user` y `checkingSession`.
3. `AppNavigator` consume la sesión con `useAuth`.
4. Mientras Firebase revisa la sesión, se muestra una pantalla de carga.
5. Sin usuario autenticado se muestran `LoginScreen` y `RegisterScreen`.
6. Con usuario autenticado se muestran `HomeScreen` y `ProfileScreen`.
7. Al cerrar sesión, Firebase actualiza el estado y la navegación vuelve al flujo de acceso.

## Estructura principal

```text
ExpoAppUsers/
├── App.js
├── index.js
├── src/
│   ├── context/
│   │   └── AuthContext.js
│   ├── firebase/
│   │   ├── firebase.example.js
│   │   └── firebase.js
│   ├── navigation/
│   ├── screens/
│   └── services/
├── assets/
├── app.json
└── package.json
```

## Comandos útiles

Comprobar el proyecto con Expo:

```bash
npx expo doctor
```

Limpiar la caché de Expo si aparecen errores extraños:

```bash
npx expo start --clear
```

Actualizar las dependencias compatibles con la versión actual de Expo:

```bash
npx expo install --fix
```

## Problemas frecuentes

### `auth/operation-not-allowed`

El proveedor Email/Password no está activado. Actívalo en Firebase Console en **Authentication > Sign-in method**.

### `auth/invalid-credential`

El correo o la contraseña no coinciden con una cuenta registrada. También comprueba que estés usando el proyecto correcto en `firebase.js`.

### El QR no abre la aplicación

Comprueba que el teléfono y el ordenador estén en la misma red. Como alternativa, ejecuta `npx expo start --tunnel`.

### `Permission denied (publickey)` al hacer push

El repositorio utiliza SSH. Comprueba que la clave pública de tu ordenador esté agregada en GitHub en **Settings > SSH and GPG keys**. Después prueba:

```bash
ssh -T git@github.com
git push -u origin main
```

## Tecnologías

- Expo SDK 54.
- React Native 0.81.
- React 19.
- Firebase Authentication.
- React Navigation Native Stack.
