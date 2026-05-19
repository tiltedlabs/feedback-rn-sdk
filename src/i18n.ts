import type { MobileFeedbackPriority } from './priorities'

export type FeedbackLocale = 'fr' | 'en'

export const DEFAULT_FEEDBACK_LOCALE: FeedbackLocale = 'fr'

export interface FeedbackMessages {
  readonly sheetTitle: string
  readonly close: string
  readonly prioritySectionLabel: string
  readonly priorityLow: string
  readonly priorityMedium: string
  readonly priorityHigh: string
  readonly priorityCritical: string
  readonly descriptionLabel: string
  readonly descriptionPlaceholder: string
  readonly submit: string
  readonly captureTitle: string
  readonly captureFailed: string
  readonly descriptionAlertTitle: string
  readonly descriptionMinLength: string
  readonly thankYouTitle: string
  readonly thankYouMessage: string
  readonly submitAlertTitle: string
  readonly submitFailed: string
}

const MESSAGES: Record<FeedbackLocale, FeedbackMessages> = {
  fr: {
    sheetTitle: 'Envoyer un feedback',
    close: 'Fermer',
    prioritySectionLabel: 'À quel point cela vous impacte-t-il ?',
    priorityLow: 'Pas trop',
    priorityMedium: 'Pas mal',
    priorityHigh: 'Beaucoup',
    priorityCritical: 'Énormément',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Qu’est-ce qui ne va pas ?',
    submit: 'Envoyer',
    captureTitle: 'Capture',
    captureFailed: 'Impossible de capturer la vue',
    descriptionAlertTitle: 'Description',
    descriptionMinLength: 'Décris le problème (au moins 3 caractères).',
    thankYouTitle: 'Merci',
    thankYouMessage: 'Le feedback a été envoyé.',
    submitAlertTitle: 'Envoi',
    submitFailed: "Impossible d'envoyer le feedback",
  },
  en: {
    sheetTitle: 'Send feedback',
    close: 'Close',
    prioritySectionLabel: 'How disruptive is this for you?',
    priorityLow: 'Not much',
    priorityMedium: 'Somewhat',
    priorityHigh: 'A lot',
    priorityCritical: 'A ton',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What’s wrong?',
    submit: 'Send',
    captureTitle: 'Capture',
    captureFailed: 'Could not capture the screen',
    descriptionAlertTitle: 'Description',
    descriptionMinLength: 'Describe the issue (at least 3 characters).',
    thankYouTitle: 'Thanks',
    thankYouMessage: 'Your feedback was sent.',
    submitAlertTitle: 'Send',
    submitFailed: 'Could not send feedback',
  },
}

export const resolveFeedbackLocale = (
  locale: FeedbackLocale | undefined,
): FeedbackLocale => (locale === 'en' ? 'en' : DEFAULT_FEEDBACK_LOCALE)

export const getFeedbackMessages = (locale: FeedbackLocale | undefined): FeedbackMessages =>
  MESSAGES[resolveFeedbackLocale(locale)]

export const getPriorityOptions = (
  messages: FeedbackMessages,
): readonly { readonly value: MobileFeedbackPriority; readonly label: string }[] => [
  { value: 'low', label: messages.priorityLow },
  { value: 'medium', label: messages.priorityMedium },
  { value: 'high', label: messages.priorityHigh },
  { value: 'critical', label: messages.priorityCritical },
]
