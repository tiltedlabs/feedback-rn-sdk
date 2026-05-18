import React, { type ReactNode } from 'react'
import { Modal, Platform } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'

export interface FeedbackOverlayProps {
  readonly visible: boolean
  readonly onRequestClose: () => void
  readonly children: ReactNode
}

/**
 * Hôte au-dessus des modales natives (stack RN, FormSheet iOS, etc.).
 * iOS : couche fenêtre complète via react-native-screens.
 * Android : Modal overFullScreen (démonté quand invisible pour éviter les touches fantômes).
 */
export const FeedbackOverlay = ({
  visible,
  onRequestClose,
  children,
}: FeedbackOverlayProps) => {
  if (!visible) {
    return null
  }

  if (Platform.OS === 'ios') {
    return <FullWindowOverlay>{children}</FullWindowOverlay>
  }

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      {children}
    </Modal>
  )
}
