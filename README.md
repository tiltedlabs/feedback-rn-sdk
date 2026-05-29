# @tiltedlabs/feedback-rn

Feedback mobile TiltedOS (Expo / React Native). Shake ou capture OS → sheet → envoi multipart vers TiltedOS.

## Prérequis

- **Expo SDK ≥ 51** (managed workflow ou dev client)
- Rebuild natif après install (`expo prebuild` / EAS) — modules natifs requis

## Installation

Le package suit le **modèle standard des libs Expo tierces** : le JS est publié sur npm, les modules **natifs** sont des **peer dependencies** installés par **ton** projet, aux versions compatibles avec **ton** SDK Expo (`npx expo install`).

Une version de `@tiltedlabs/feedback-rn` fonctionne sur **plusieurs SDK Expo** (≥ 51) ; ce n’est pas une version du plugin par SDK.

### 1. Installer le package

```bash
pnpm add @tiltedlabs/feedback-rn
```

### 2. Installer les peer dependencies (natif)

Depuis la racine de **ton app Expo** (là où se trouve `package.json` + `expo`) :

```bash
npx expo install expo-sensors expo-screen-capture react-native-view-shot react-native-screens
```

| Module | Rôle |
|--------|------|
| `expo-sensors` | Détection shake (accéléromètre) |
| `expo-screen-capture` | Écoute screenshot système → ouverture du feedback |
| `react-native-view-shot` | Capture d’écran pour la pièce jointe |
| `react-native-screens` | Overlay plein écran iOS (`FullWindowOverlay`) — souvent déjà présent avec `expo-router` |

**Important :** utilise toujours `npx expo install`, pas `pnpm add expo-sensors@x.y.z`. Seul Expo résout la version exacte attendue par ton SDK (`bundledNativeModules.json`).

Si pnpm signale des peer dependencies manquantes après l’étape 1, c’est normal : l’étape 2 les ajoute.

### 3. Config plugin (obligatoire)

Ajoute le plugin dans `app.config.js` ou `app.json` :

```js
export default {
  expo: {
    plugins: [
      // … tes autres plugins (expo-router, etc.)
      '@tiltedlabs/feedback-rn',
    ],
  },
}
```

Expo résout `@tiltedlabs/feedback-rn` vers `app.plugin.js` à la racine du package (comme `expo-font`, `expo-sensors`, etc.).

Le plugin enregistre `expo-sensors` avec `motionPermission: false` : le shake utilise l’accéléromètre **sans** la modale iOS « Mouvement et forme » (podomètre).

### 4. Rebuild natif

```bash
npx expo prebuild --clean
# ou relance un build EAS
```

> **Note (≤ 0.1.8)** : le champ `exports` du package masquait `app.plugin.js` — Expo ne pouvait pas le résoudre. Corrigé en **0.1.9+**. Mets à jour le package si tu vois `PLUGIN_NOT_FOUND` ou « plugin introuvable ».

### 5. Android — Play Store (si screenshot → feedback)

`expo-screen-capture` peut déclarer des permissions liées aux médias sur certaines versions Android (`READ_MEDIA_IMAGES` sur API 33). Si tu gardes cette feature, déclare-la dans la Play Console (usage : feedback déclenché par screenshot utilisateur, pas parcours galerie).

---

## Mise à jour Expo SDK

Lors d’un upgrade Expo (ex. 55 → 56) :

```bash
npx expo install expo-sensors expo-screen-capture react-native-view-shot react-native-screens
pnpm update @tiltedlabs/feedback-rn
npx expo prebuild --clean
```

Pas besoin d’attendre une nouvelle major du SDK feedback : les versions natives restent pilotées par **ton** SDK Expo.

---

## Usage

```tsx
import { TiltedOSFeedbackProvider } from '@tiltedlabs/feedback-rn'

<TiltedOSFeedbackProvider apiKey={process.env.EXPO_PUBLIC_TILTEDOS_FEEDBACK_KEY!}>
  <App />
</TiltedOSFeedbackProvider>
```

### Locale (`fr` | `en`)

Par défaut l’UI est en français. Passe `locale="en"` pour l’anglais :

```tsx
<TiltedOSFeedbackProvider
  apiKey={process.env.EXPO_PUBLIC_TILTEDOS_FEEDBACK_KEY!}
  locale="en"
>
  <App />
</TiltedOSFeedbackProvider>
```

### Niveau de gêne (champ `priority`)

La sheet demande **l’impact pour l’utilisateur** avec quatre niveaux (`Pas trop`, `Pas mal`, `Beaucoup`, `Énormément`).  
Côté API, ces choix sont envoyés dans le champ multipart existant `priority` (`low` | `medium` | `high` | `critical`).

### Contexte utilisateur

`context` injecte des métadonnées (user id, email, …) dans la description de la tâche côté serveur :

```tsx
<TiltedOSFeedbackProvider
  apiKey={key}
  context={() => ({ 'User ID': user.id, Email: user.email ?? '' })}
>
  <App />
</TiltedOSFeedbackProvider>
```

### Sensibilité du shake

Par défaut, le module se déclenche à partir d’une accélération totale de `2.2g`.
Passe `shakeThreshold` pour ajuster la force nécessaire : plus la valeur est haute, plus il faut secouer fort.

```tsx
<TiltedOSFeedbackProvider
  apiKey={key}
  shakeThreshold={2.5}
>
  <App />
</TiltedOSFeedbackProvider>
```
