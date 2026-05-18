import { Platform, PlatformColor, StyleSheet } from 'react-native'

export const feedbackSheetColors = {
  sheetBackground:
    Platform.OS === 'ios' ? PlatformColor('systemBackground') : '#ffffff',
  label: Platform.OS === 'ios' ? PlatformColor('secondaryLabel') : '#666666',
  title: Platform.OS === 'ios' ? PlatformColor('label') : '#111111',
  fieldBorder: Platform.OS === 'ios' ? PlatformColor('separator') : '#e5e5e5',
  fieldBackground:
    Platform.OS === 'ios' ? PlatformColor('secondarySystemBackground') : '#f5f5f5',
  placeholder:
    Platform.OS === 'ios' ? PlatformColor('placeholderText') : '#999999',
  closeButtonBackground:
    Platform.OS === 'ios' ? PlatformColor('secondarySystemFill') : '#eeeeee',
  previewBackground:
    Platform.OS === 'ios' ? PlatformColor('tertiarySystemFill') : '#eeeeee',
} as const

export const feedbackSheetStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  kav: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: feedbackSheetColors.closeButtonBackground,
  },
  closeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 4,
    flexGrow: 1,
  },
  previewWrap: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: feedbackSheetColors.previewBackground,
  },
  previewImage: {
    width: '100%',
    height: 220,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  priorityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  inputMultiline: {
    minHeight: 140,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
  },
  submitButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
})
