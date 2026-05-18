import React, { type RefObject } from 'react'
import {
  ActivityIndicator,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'

import { FeedbackOverlay } from './feedback-overlay'
import { feedbackSheetColors, feedbackSheetStyles } from './feedback-sheet.styles'
import {
  MOBILE_FEEDBACK_PRIORITIES,
  MOBILE_FEEDBACK_PRIORITY_STYLES,
  type MobileFeedbackPriority,
} from './priorities'

export interface FeedbackSheetProps {
  readonly visible: boolean
  readonly previewUri: string | null
  readonly description: string
  readonly onDescriptionChange: (value: string) => void
  readonly priority: MobileFeedbackPriority
  readonly onPriorityChange: (value: MobileFeedbackPriority) => void
  readonly submitting: boolean
  readonly onClose: () => void
  readonly onSubmit: () => void
  readonly scrollRef: RefObject<ScrollView | null>
  readonly descriptionInputRef: RefObject<TextInput | null>
}

export const FeedbackSheet = ({
  visible,
  previewUri,
  description,
  onDescriptionChange,
  priority,
  onPriorityChange,
  submitting,
  onClose,
  onSubmit,
  scrollRef,
  descriptionInputRef,
}: FeedbackSheetProps) => {
  React.useEffect(() => {
    if (!visible || Platform.OS !== 'android') {
      return
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose()
      return true
    })
    return () => sub.remove()
  }, [visible, onClose])

  return (
    <FeedbackOverlay visible={visible} onRequestClose={onClose}>
      <SafeAreaView
      style={[
        feedbackSheetStyles.flex,
        { backgroundColor: feedbackSheetColors.sheetBackground },
      ]}
    >
      <View style={feedbackSheetStyles.header}>
        <Text
          style={[
            feedbackSheetStyles.headerTitle,
            { color: feedbackSheetColors.title },
          ]}
        >
          Envoyer un feedback
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          onPress={onClose}
          style={feedbackSheetStyles.closeButton}
        >
          <Text
            style={[
              feedbackSheetStyles.closeLabel,
              { color: feedbackSheetColors.title },
            ]}
          >
            ✕
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={feedbackSheetStyles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={feedbackSheetStyles.scrollContent}
          style={feedbackSheetStyles.flex}
        >
          {previewUri ? (
            <View style={feedbackSheetStyles.previewWrap}>
              <Image
                source={{ uri: previewUri }}
                style={feedbackSheetStyles.previewImage}
                resizeMode="contain"
              />
            </View>
          ) : null}

          <Text
            style={[
              feedbackSheetStyles.fieldLabel,
              { color: feedbackSheetColors.label },
            ]}
          >
            Priorité
          </Text>
          <View style={feedbackSheetStyles.priorityRow}>
            {MOBILE_FEEDBACK_PRIORITIES.map((option) => {
              const selected = priority === option.value
              const palette = MOBILE_FEEDBACK_PRIORITY_STYLES[option.value]
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onPriorityChange(option.value)}
                  style={[
                    feedbackSheetStyles.priorityChip,
                    {
                      borderColor: selected ? palette.border : palette.borderMuted,
                      backgroundColor: palette.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      feedbackSheetStyles.priorityChipText,
                      {
                        color: palette.text,
                        fontWeight: selected ? '700' : '600',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <Text
            style={[
              feedbackSheetStyles.fieldLabel,
              { color: feedbackSheetColors.label },
            ]}
          >
            Description
          </Text>
          <TextInput
            ref={descriptionInputRef}
            value={description}
            onChangeText={onDescriptionChange}
            placeholder="Qu’est-ce qui ne va pas ?"
            placeholderTextColor={feedbackSheetColors.placeholder}
            multiline
            textAlignVertical="top"
            onFocus={() => {
              scrollRef.current?.scrollToEnd({ animated: true })
            }}
            style={[
              feedbackSheetStyles.input,
              feedbackSheetStyles.inputMultiline,
              {
                color: feedbackSheetColors.title,
                borderColor: feedbackSheetColors.fieldBorder,
                backgroundColor: feedbackSheetColors.fieldBackground,
              },
            ]}
          />
        </ScrollView>

        <View style={feedbackSheetStyles.footer}>
          <Pressable
            accessibilityRole="button"
            disabled={submitting}
            onPress={onSubmit}
            style={({ pressed }) => [
              feedbackSheetStyles.submitButton,
              pressed && !submitting ? feedbackSheetStyles.submitButtonPressed : null,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={feedbackSheetStyles.submitButtonText}>Envoyer</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </FeedbackOverlay>
  )
}
