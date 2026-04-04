# ⚽ Prode Mundial 2026

App de pronósticos para jugar con amigos y familia. Grupos privados con código de invitación, tabla de posiciones en tiempo real y pronósticos que se cierran 2 horas antes de cada partido.

**Stack:** Next.js 14 · Firebase (Auth + Firestore) · Vercel

---

## 🚀 Deploy en 4 pasos

### Paso 1 — Crear proyecto en Firebase

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com) con tu cuenta de Gmail
2. Hacé clic en **"Agregar proyecto"**
3. Poné un nombre (ej: `prode-2026`) → Siguiente → Podés desactivar Analytics → **Crear proyecto**
4. Esperá ~30 segundos

### Paso 2 — Configurar Authentication y Firestore

**Authentication:**
1. En el menú izquierdo → **Authentication** → **Comenzar**
2. Pestaña **"Método de acceso"** → Habilitá **"Correo electrónico/Contraseña"** → Guardar

**Firestore:**
1. En el menú izquierdo → **Firestore Database** → **Crear base de datos**
2. Elegí **"Comenzar en modo de producción"** → Elegí ubicación (ej: `southamerica-east1`) → **Listo**
3. Una vez creada, andá a la pestaña **"Reglas"** y reemplazá todo con esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: solo el propio usuario puede escribir
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    // Usernames: cualquier autenticado puede leer, solo crear (no editar)
    match /usernames/{username} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    // Grupos: miembros pueden leer, cualquier auth puede crear
    match /groups/{groupId} {
      allow read: if request.auth != null && request.auth.uid in resource.data.members;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid in resource.data.members;

      // Predicciones: miembros del grupo
      match /predictions/{predId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
      // Resultados: solo el admin del grupo
      match /results/{matchId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null &&
          get(/databases/$(database)/documents/groups/$(groupId)).data.adminId == request.auth.uid;
      }
    }
  }
}
```

4. Hacé clic en **Publicar**

**Obtener las credenciales:**
1. Click en el ⚙️ (Configuración del proyecto) → **Configuración del proyecto**
2. Bajá hasta **"Tus apps"** → Hacé clic en el ícono `</>` (Web)
3. Registrá la app con cualquier nombre → **Registrar app**
4. Copiá los valores de `firebaseConfig` — los vas a necesitar en el Paso 4

### Paso 3 — Subir el código a GitHub

1. Creá un repositorio nuevo en [github.com](https://github.com) (puede ser privado)
2. En tu computadora, abrí una terminal en la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Prode Mundial 2026"
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### Paso 4 — Deploy en Vercel

1. Entrá a [vercel.com](https://vercel.com) → ingresá con tu cuenta de GitHub
2. **Add New Project** → Importá el repositorio
3. Antes de deployar, agregá las **Environment Variables** (con los datos del Paso 2):

| Variable | Valor (del firebaseConfig) |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` |

4. **Deploy** → En ~2 minutos tenés tu URL pública 🎉

---

## 🎮 Cómo usar la app

### Registro
Cada participante se registra con **nombre de usuario + contraseña** (no hace falta email real).

### Grupos
- **Crear grupo:** elegís nombre y emoji → recibís un código de 6 letras para compartir
- **Unirse:** ingresás el código que te mandaron
- Podés estar en múltiples grupos (familia, amigos, trabajo)

### Pronósticos
- Se cargan en **"Mis Pronósticos"** con el marcador esperado
- **Editables hasta 2 horas antes** del partido — después se bloquean automáticamente
- El creador del grupo ve la pestaña **⚙️ Admin** para cargar resultados reales

### Puntos
| | Puntos |
|---|---|
| ⭐ Marcador exacto | 3 puntos |
| ✓ Resultado correcto (quién gana o empate) | 1 punto |
| ✗ Incorrecto | 0 puntos |

---

## 💻 Desarrollo local

```bash
npm install
cp .env.example .env.local
# Editá .env.local con tus datos de Firebase
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

---

## 📝 Notas

- El fixture es ilustrativo — los grupos definitivos se conocerán con el sorteo oficial
- Para actualizar equipos o fechas editá `lib/fixture.ts`
- Las horas están en UTC — ajustá según tu zona horaria si es necesario (Argentina = UTC-3)
"# Prode-mundial-2026" 
"# Prode-mundial-2026" 
