import { captureScreen } from 'react-native-view-shot'

/** Laisse le temps à l’UI de se stabiliser (capture OS ou shake). */
export const waitForUiSettle = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })

export async function captureFeedbackScreenshot(): Promise<string> {
  await waitForUiSettle()
  return captureScreen({ format: 'jpg', quality: 0.82 })
}
