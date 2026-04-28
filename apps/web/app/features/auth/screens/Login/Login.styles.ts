import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const loginStyles = {
  fieldGroup: {
    display: 'grid',
    gap: '6px'
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
    minHeight: '46px',
    borderRadius: '12px',
    border: `1px solid ${colors.brown}30`,
    padding: '0 14px',
    color: colors.black,
    backgroundColor: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    lineHeight: fonts.lineHeight.normal
  },
  inputError: {
    border: '1px solid #d48473'
  },
  fieldError: {
    margin: 0,
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  },
  submitButton: {
    width: '100%',
    minHeight: '46px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    cursor: 'pointer',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  dividerRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '10px',
    alignItems: 'center'
  },
  dividerLine: {
    height: '1px',
    backgroundColor: `${colors.brown}24`
  },
  dividerText: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em'
  },
  helperText: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal
  },
  forgotLink: {
    marginTop: '4px',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    textDecoration: 'none'
  }
}
