import { Accelerometer } from 'expo-sensors'

const SHAKE_UPDATE_INTERVAL_MS = 100
/** Accélération totale (g) au-delà de laquelle on considère un shake. */
const SHAKE_THRESHOLD = 1.78
const SHAKE_COOLDOWN_MS = 1_500

/**
 * Détecte un shake via l’accéléromètre (ne fonctionne pas sur simulateur iOS).
 * Retourne une fonction de désabonnement.
 */
export function subscribeShake(onShake: () => void): () => void {
  let subscription: { remove: () => void } | null = null
  let lastShakeAt = 0
  let cancelled = false

  void (async () => {
    const available = await Accelerometer.isAvailableAsync()
    if (!available || cancelled) {
      return
    }
    Accelerometer.setUpdateInterval(SHAKE_UPDATE_INTERVAL_MS)
    subscription = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z)
      if (acceleration < SHAKE_THRESHOLD) {
        return
      }
      const now = Date.now()
      if (now - lastShakeAt < SHAKE_COOLDOWN_MS) {
        return
      }
      lastShakeAt = now
      onShake()
    })
  })()

  return () => {
    cancelled = true
    subscription?.remove()
    subscription = null
  }
}
