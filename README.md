# @tiltedlabs/feedback-rn

SDK Expo / React Native pour envoyer du feedback (capture d’écran, shake) vers TiltedOS.

## Installation

```bash
pnpm add @tiltedlabs/feedback-rn
```

App hôte : Expo SDK ≥ 51, `react-native-screens` (inclus avec Expo Router), development build recommandé.

Monte le provider **à la racine** de l’app (au-dessus du `NavigationContainer` / layout racine) pour que le feedback s’affiche par-dessus les modales natives.

## Usage

```tsx
import { TiltedOSFeedbackProvider } from '@tiltedlabs/feedback-rn';

<TiltedOSFeedbackProvider apiKey={process.env.EXPO_PUBLIC_TILTEDOS_FEEDBACK_KEY!}>
  {children}
</TiltedOSFeedbackProvider>
```

### Contexte utilisateur (user id, email, …)

`context` injecte des paires clé/valeur dans la description de la tâche TiltedOS (bloc **Contexte**), sans les afficher dans le champ saisi :

```tsx
<TiltedOSFeedbackProvider
  apiKey={process.env.EXPO_PUBLIC_TILTEDOS_FEEDBACK_KEY!}
  context={() => ({
    'User ID': session.user.id,
    Email: session.user.email ?? '',
  })}
>
  {children}
</TiltedOSFeedbackProvider>
```
