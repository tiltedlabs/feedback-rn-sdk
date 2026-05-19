# @tiltedlabs/feedback-rn

Feedback mobile TiltedOS (Expo / React Native). Shake ou capture OS → sheet → envoi multipart vers TiltedOS.

## Install

```bash
pnpm add @tiltedlabs/feedback-rn
```

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
