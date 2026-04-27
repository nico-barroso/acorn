import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const googleOAuthButtonStyles = {
  button: {
    width: '100%',
    minHeight: '48px',
    borderRadius: '14px',
    border: `1px solid ${colors.brown}30`,
    backgroundColor: colors.white,
    color: colors.black,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px',
    fontFamily: fonts.family.primary,
    fontWeight: fonts.weight.semibold,
    fontSize: fonts.size.md,
    lineHeight: fonts.lineHeight.normal,
    cursor: 'pointer',
    transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
    boxShadow: '0 6px 14px rgba(67, 40, 28, 0.08)'
  },
  buttonLoading: {
    backgroundColor: '#f8f8f8',
    cursor: 'not-allowed',
    opacity: 0.85
  },
  icon: {
    width: '20px',
    height: '20px',
    display: 'inline-flex'
  }
}
