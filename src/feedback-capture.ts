import * as ImageManipulator from 'expo-image-manipulator'
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
  const rawUri = await captureScreen({ format: 'jpg', quality: 0.85 })
  const manipulated = await ImageManipulator.manipulateAsync(rawUri, [], {
    compress: 0.82,
    format: ImageManipulator.SaveFormat.JPEG,
  })
  return manipulated.uri
}
