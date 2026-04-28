import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const confirmModalStyles = {
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
    maxWidth: '360px',
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
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold
  },
  message: {
    margin: '10px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.comfortable
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
  dangerButton: {
    minHeight: '40px',
    padding: '0 18px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#8b2a1b',
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    transition: 'opacity 0.15s ease'
  }
}