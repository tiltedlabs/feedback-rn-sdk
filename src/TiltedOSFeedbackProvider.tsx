import * as ScreenCapture from 'expo-screen-capture'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native'

import { submitMobileFeedback } from './api'
import {
  type FeedbackContextInput,
  resolveFeedbackContext,
} from './resolve-context'
import { captureFeedbackScreenshot } from './feedback-capture'

export type { FeedbackContextInput }
import { FeedbackSheet } from './feedback-sheet'
import {
  DEFAULT_MOBILE_FEEDBACK_PRIORITY,
  type MobileFeedbackPriority,
} from './priorities'
import { subscribeShake } from './shake-listener'

export interface TiltedOSFeedbackProviderProps {
  readonly apiKey: string
  readonly children: React.ReactNode
  readonly context?: FeedbackContextInput
}

export const TiltedOSFeedbackProvider = ({
  apiKey,
  children,
  context,
}: TiltedOSFeedbackProviderProps) => {
  const [open, setOpen] = useState(false)
  const [previewUri, setPreviewUri] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<MobileFeedbackPriority>(
    DEFAULT_MOBILE_FEEDBACK_PRIORITY,
  )
  const [submitting, setSubmitting] = useState(false)
  const scrollRef = useRef<ScrollView>(null)
  const descriptionInputRef = useRef<TextInput>(null)
  const openRef = useRef(false)

  const reset = useCallback(() => {
    Keyboard.dismiss()
    setOpen(false)
    setPreviewUri(null)
    setDescription('')
    setPriority(DEFAULT_MOBILE_FEEDBACK_PRIORITY)
    setSubmitting(false)
  }, [])

  useEffect(() => {
    openRef.current = open
  }, [open])

  const openFeedbackCapture = useCallback(async () => {
    if (openRef.current) {
      return
    }
    try {
      const uri = await captureFeedbackScreenshot()
      setPreviewUri(uri)
      setOpen(true)
    } catch (e) {
      Alert.alert(
        'Capture',
        e instanceof Error ? e.message : 'Impossible de capturer la vue',
      )
    }
  }, [])

  useEffect(() => {
    const screenshotSub = ScreenCapture.addScreenshotListener(() => {
      void openFeedbackCapture()
    })
    const removeShake = subscribeShake(() => {
      void openFeedbackCapture()
    })
    return () => {
      screenshotSub.remove()
      removeShake()
    }
  }, [openFeedbackCapture])

  useEffect(() => {
    if (!open) return
    const delayMs = Platform.OS === 'ios' ? 420 : 160
    const timer = setTimeout(() => {
      descriptionInputRef.current?.focus()
    }, delayMs)
    return () => clearTimeout(timer)
  }, [open])

  const onSubmit = async () => {
    const desc = description.trim()
    if (desc.length < 3) {
      Alert.alert('Description', 'Décris le problème (au moins 3 caractères).')
      return
    }
    if (!previewUri) {
      return
    }
    let appVersion = ''
    let buildNumber = ''
    try {
      const Constants = await import('expo-constants')
      appVersion = String(Constants.default.expoConfig?.version ?? '')
      buildNumber = String(
        Constants.default.expoConfig?.ios?.buildNumber ??
          Constants.default.expoConfig?.android?.versionCode ??
          '',
      )
    } catch {
      /* expo-constants optionnel */
    }

    setSubmitting(true)
    try {
      await submitMobileFeedback({
        apiKey,
        description: desc,
        priority,
        imageUri: previewUri,
        platform: Platform.OS,
        appVersion: appVersion || undefined,
        buildNumber: buildNumber || undefined,
        context: resolveFeedbackContext(context),
      })
      Alert.alert('Merci', 'Le feedback a été envoyé.')
      reset()
    } catch (e) {
      Alert.alert(
        'Envoi',
        e instanceof Error ? e.message : "Impossible d'envoyer le feedback",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {children}
      <FeedbackSheet
        visible={open}
        previewUri={previewUri}
        description={description}
        onDescriptionChange={setDescription}
        priority={priority}
        onPriorityChange={setPriority}
        submitting={submitting}
        onClose={reset}
        onSubmit={() => void onSubmit()}
        scrollRef={scrollRef}
        descriptionInputRef={descriptionInputRef}
      />
    </>
  )
}
