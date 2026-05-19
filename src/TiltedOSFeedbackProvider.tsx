import * as ScreenCapture from 'expo-screen-capture'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { FeedbackMessagesProvider } from './feedback-messages-context'
import { FeedbackSheet } from './feedback-sheet'
import { getFeedbackMessages, type FeedbackLocale } from './i18n'
import {
  DEFAULT_MOBILE_FEEDBACK_PRIORITY,
  type MobileFeedbackPriority,
} from './priorities'
import { subscribeShake } from './shake-listener'

export type { FeedbackContextInput, FeedbackLocale }

export interface TiltedOSFeedbackProviderProps {
  readonly apiKey: string
  readonly children: React.ReactNode
  readonly context?: FeedbackContextInput
  /** Langue de l’UI du widget (`fr` par défaut). */
  readonly locale?: FeedbackLocale
}

export const TiltedOSFeedbackProvider = ({
  apiKey,
  children,
  context,
  locale,
}: TiltedOSFeedbackProviderProps) => {
  const messages = useMemo(() => getFeedbackMessages(locale), [locale])
  const messagesCtx = useMemo(
    () => ({ locale: locale === 'en' ? ('en' as const) : ('fr' as const), messages }),
    [locale, messages],
  )
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
        messages.captureTitle,
        e instanceof Error ? e.message : messages.captureFailed,
      )
    }
  }, [messages.captureFailed, messages.captureTitle])

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
      Alert.alert(messages.descriptionAlertTitle, messages.descriptionMinLength)
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
      Alert.alert(messages.thankYouTitle, messages.thankYouMessage)
      reset()
    } catch (e) {
      Alert.alert(
        messages.submitAlertTitle,
        e instanceof Error ? e.message : messages.submitFailed,
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FeedbackMessagesProvider value={messagesCtx}>
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
    </FeedbackMessagesProvider>
  )
}
