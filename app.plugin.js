const { withPlugins } = require('expo/config-plugins')

/** Retirées du manifest fusionné (politique Play : usage ponctuel, pas galerie). */
const BLOCKED_ANDROID_MEDIA_PERMISSIONS = [
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
]

/**
 * Conformité Google Play : expo-screen-capture déclare READ_MEDIA_IMAGES sur API 33.
 * Le feedback n’a pas besoin d’un accès large aux médias — shake + screenshot API 34+ suffisent.
 */
function withPlayStoreMediaPermissions(config) {
  const android = config.android ?? {}
  const blockedPermissions = [
    ...new Set([
      ...(android.blockedPermissions ?? []),
      ...BLOCKED_ANDROID_MEDIA_PERMISSIONS,
    ]),
  ]
  return {
    ...config,
    android: {
      ...android,
      blockedPermissions,
    },
  }
}

/**
 * Config plugin TiltedOS Feedback :
 * - accéléromètre (shake) sans permission Motion & Fitness iOS (podomètre désactivé)
 * - retrait READ_MEDIA_IMAGES / READ_MEDIA_VIDEO (expo-screen-capture) pour la Play Store
 */
module.exports = function withTiltedOSFeedback(config) {
  return withPlugins(config, [
    withPlayStoreMediaPermissions,
    ['expo-sensors', { motionPermission: false }],
  ])
}
