import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const fabStyles = {
  button: {
    position: 'fixed' as const,
    bottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
    right: '20px',
    height: '48px',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontWeight: fonts.weight.bold,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 20px 0 16px',
    boxShadow: '0 6px 20px rgba(161, 77, 54, 0.35)',
    zIndex: 40,
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    lineHeight: 1,
    whiteSpace: 'nowrap' as const
  },
  buttonHover: {
    transform: 'scale(1.08)',
    boxShadow: '0 8px 28px rgba(161, 77, 54, 0.45)'
  },
  buttonActive: {
    transform: 'scale(0.96)',
    boxShadow: '0 3px 12px rgba(161, 77, 54, 0.30)'
  }
}