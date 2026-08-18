# ExpoAppUsers

Ejemplo educativo de una aplicación React Native con Expo, Firebase Authentication y React Navigation.

La aplicación permite:

- Crear una cuenta con correo y contraseña.
- Iniciar sesión.
- Recuperar la contraseña por correo electrónico.
- Mostrar una pantalla de inicio para usuarios autenticados.
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
git clone git@github.com:nzgama/DAPMO.git
cd DAPMO
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

La configuración de Firebase se encuentra en [firebase.js](firebase.js). Si utilizas otro proyecto de Firebase, reemplaza los valores de `firebaseConfig` por los de tu aplicación web.

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

1. `App.js` carga `AppNavigator`.
2. `AppNavigator` escucha los cambios de sesión con `onAuthStateChanged`.
3. Sin usuario autenticado se muestran `LoginScreen` y `RegisterScreen`.
4. Después de iniciar sesión o registrarse, Firebase actualiza la sesión.
5. La aplicación muestra `HomeScreen`.
6. Al cerrar sesión, el navegador vuelve a mostrar Login y Registro.

## Estructura principal

```text
ExpoAppUsers/
├── App.js
├── firebase.js
├── index.js
├── navigation/
│   └── AppNavigator.js
├── screens/
│   ├── HomeScreen.js
│   ├── LoginScreen.js
│   └── RegisterScreen.js
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
