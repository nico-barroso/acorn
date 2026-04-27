import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const addResourceStyles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(67, 40, 28, 0.45)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 60
  },
  modal: {
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    backgroundColor: colors.white,
    borderRadius: '18px',
    border: `1px solid ${colors.brown}20`,
    boxShadow: '0 24px 48px rgba(67, 40, 28, 0.18)',
    padding: 'clamp(20px, 4vw, 28px)'
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold
  },
  subtitle: {
    margin: '6px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.comfortable
  },
  fieldGroup: {
    marginTop: '18px',
    display: 'grid',
    gap: '10px'
  },
  label: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold
  },
  input: {
    width: '100%',
    minHeight: '42px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  inputError: {
    border: `1px solid #8b2a1b`
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    marginTop: '6px'
  },
  tagPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}14`,
    border: `1px solid ${colors.salmon}40`,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    lineHeight: '1.4'
  },
  tagRemove: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: colors.salmon,
    cursor: 'pointer',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.bold,
    lineHeight: 1
  },
  actionsRow: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    minHeight: '40px',
    padding: '0 18px',
    borderRadius: '12px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer'
  },
  saveButton: {
    minHeight: '40px',
    padding: '0 18px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    transition: 'opacity 0.15s ease'
  },
  saveButtonDisabled: {
    minHeight: '40px',
    padding: '0 18px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'not-allowed',
    opacity: 0.6
  },
  errorText: {
    margin: '8px 0 0',
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  },
  extractStatusRow: {
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  extractSpinner: {
    width: '16px',
    height: '16px',
    borderRadius: '999px',
    border: `2px solid ${colors.brown}20`,
    borderTopColor: colors.salmon,
    animation: 'spin 0.7s linear infinite'
  },
  extractSpinnerDone: {
    width: '16px',
    height: '16px',
    borderRadius: '999px',
    backgroundColor: '#2e7d32',
    display: 'grid',
    placeItems: 'center',
    color: colors.white,
    fontSize: '10px',
    fontWeight: fonts.weight.bold
  },
  extractText: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  previewCard: {
    marginTop: '14px',
    borderRadius: '14px',
    border: `1px solid ${colors.brown}18`,
    backgroundColor: '#fff8f3',
    padding: '12px',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '12px',
    alignItems: 'start'
  },
  previewImage: {
    width: '60px',
    height: '60px',
    borderRadius: '10px',
    objectFit: 'cover' as const,
    border: `1px solid ${colors.brown}18`
  },
  previewPlaceholder: {
    width: '60px',
    height: '60px',
    borderRadius: '10px',
    backgroundColor: `${colors.salmon}16`,
    border: `1px solid ${colors.brown}18`,
    display: 'grid',
    placeItems: 'center',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '22px',
    fontWeight: fonts.weight.bold
  },
  previewTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    lineHeight: fonts.lineHeight.tight,
    display: '-webkit-box' as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden'
  },
  previewDescription: {
    margin: '4px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    lineHeight: fonts.lineHeight.normal,
    display: '-webkit-box' as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden'
  },
  tagsInputWrapper: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    padding: '8px 10px',
    borderRadius: '10px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: colors.white,
    minHeight: '42px',
    alignItems: 'center',
    transition: 'border-color 0.2s ease'
  },
  tagInput: {
    flex: 1,
    minWidth: '80px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium
  }
}