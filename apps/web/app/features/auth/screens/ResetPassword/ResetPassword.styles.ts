import { colors } from '../../../../theme/colors'
import { fonts } from '../../../../theme/fonts'

export const resetPasswordStyles = {
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
  successText: {
    margin: 0,
    color: '#2f6a3b',
    backgroundColor: '#e7f7eb',
    border: '1px solid #b8e4c2',
    borderRadius: '12px',
    padding: '10px 12px',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal
  },
  helperText: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal
  }
}
