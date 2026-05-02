import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 27, 27, 0.45)',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: 'rgba(66, 36, 25, 0.1)',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  handle: {
    width: 81,
    height: 5,
    borderRadius: 100,
    backgroundColor: colors.brownMid,
  },
  loading: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontFamily: fonts.family.title.bold,
    fontSize: 22,
    color: colors.brown,
    lineHeight: 28,
  },
  titleInput: {
    flex: 1,
    fontFamily: fonts.family.title.bold,
    fontSize: 22,
    color: colors.brown,
    lineHeight: 28,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.salmon,
    paddingBottom: 4,
    paddingTop: 0,
  },
  editLink: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.salmon,
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 14,
  },
  sourceEmoji: {
    fontSize: 11,
  },
  metaText: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
    color: colors.brownMid,
  },
  dot: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
    color: colors.brownMid,
  },

  // Sections
  sectionTitle: {
    fontFamily: fonts.family.title.bold,
    fontSize: 15,
    color: colors.brown,
    marginBottom: 8,
    marginTop: 16,
  },

  // Notes
  notesText: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.black,
    lineHeight: 22,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.brown}18`,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 72,
  },
  notesPlaceholder: {
    color: '#8B8179',
  },
  textarea: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.black,
    lineHeight: 22,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.salmon,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 100,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  // Error
  error: {
    marginTop: 10,
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
    color: '#8b2a1b',
  },

  // Actions
  actions: {
    marginTop: 24,
    gap: 12,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: colors.salmon,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonLabel: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.lg,
    color: colors.white,
    letterSpacing: 0.32,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: '#8b2a1b',
    textDecorationLine: 'underline',
  },
});
