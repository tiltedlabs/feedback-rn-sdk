# @tiltedlabs/feedback-rn

Feedback mobile TiltedOS (Expo / React Native). Shake ou screenshot → sheet → envoi multipart.

## Prérequis

- Expo SDK ≥ 51, dev client ou prebuild
- Rebuild natif après installation

## Installation

```bash
pnpm add @tiltedlabs/feedback-rn
npx expo install expo-sensors expo-screen-capture react-native-view-shot react-native-screens
```

Peers natifs (versions alignées par `npx expo install` sur ton SDK Expo) :

| Module | Rôle |
|--------|------|
| `expo-sensors` | Shake |
| `expo-screen-capture` | Screenshot système |
| `react-native-view-shot` | Capture pour la pièce jointe |
| `react-native-screens` | Overlay plein écran (souvent déjà présent avec `expo-router`) |

`app.config.js` :

```js
export default {
  expo: {
    plugins: ['@tiltedlabs/feedback-rn'],
  },
}
```

Rebuild :

```bash
npx expo prebuild --clean
```

## Usage

```tsx
import { TiltedOSFeedbackProvider } from '@tiltedlabs/feedback-rn'

<TiltedOSFeedbackProvider apiKey={process.env.EXPO_PUBLIC_TILTEDOS_FEEDBACK_KEY!}>
  <App />
</TiltedOSFeedbackProvider>
```

Props optionnelles :

| Prop | Description |
|------|-------------|
| `locale` | `fr` (défaut) ou `en` |
| `context` | `() => ({ 'User ID': user.id, … })` — métadonnées ajoutées à la tâche |
| `shakeThreshold` | Seuil en g (défaut `2.2`) |

La sheet envoie `priority` (`low` \| `medium` \| `high` \| `critical`) selon l’impact choisi par l’utilisateur.
