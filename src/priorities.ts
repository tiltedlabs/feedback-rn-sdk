export type MobileFeedbackPriority = 'low' | 'medium' | 'high' | 'critical'

/** Aligné sur le BO (`PRIORITY_CONFIG`) — texte / fond toujours visibles. */
export const MOBILE_FEEDBACK_PRIORITY_STYLES: Record<
  MobileFeedbackPriority,
  {
    readonly text: string
    readonly border: string
    readonly borderMuted: string
    readonly background: string
  }
> = {
  low: {
    text: '#a1a1aa',
    border: '#a1a1aa',
    borderMuted: 'transparent',
    background: 'rgba(161, 161, 170, 0.2)',
  },
  medium: {
    text: '#60a5fa',
    border: '#60a5fa',
    borderMuted: 'transparent',
    background: 'rgba(96, 165, 250, 0.2)',
  },
  high: {
    text: '#fbbf24',
    border: '#fbbf24',
    borderMuted: 'transparent',
    background: 'rgba(251, 191, 36, 0.2)',
  },
  critical: {
    text: '#f87171',
    border: '#f87171',
    borderMuted: 'transparent',
    background: 'rgba(248, 113, 113, 0.2)',
  },
}

export const MOBILE_FEEDBACK_PRIORITIES: readonly {
  readonly value: MobileFeedbackPriority
  readonly label: string
}[] = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Normale' },
  { value: 'high', label: 'Haute' },
  { value: 'critical', label: 'Critique' },
] as const

export const DEFAULT_MOBILE_FEEDBACK_PRIORITY: MobileFeedbackPriority = 'medium'
