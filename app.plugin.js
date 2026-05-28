const { withPlugins } = require('expo/config-plugins')

/**
 * Config plugin TiltedOS Feedback :
 * - accéléromètre (shake) sans permission Motion & Fitness iOS (podomètre désactivé)
 */
module.exports = function withTiltedOSFeedback(config) {
  return withPlugins(config, [['expo-sensors', { motionPermission: false }]])
}
