import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const smartFolderBuilderStyles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(67, 40, 28, 0.45)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 60,
    padding: '20px'
  },
  modal: {
    width: '100%',
    maxWidth: '560px',
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
  section: {
    marginTop: '20px'
  },
  sectionTitle: {
    margin: '0 0 10px',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold
  },
  fieldGroup: {
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
  textarea: {
    width: '100%',
    minHeight: '70px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    outline: 'none',
    resize: 'vertical' as const,
    transition: 'border-color 0.2s ease'
  },
  rulesSection: {
    marginTop: '24px'
  },
  rulesHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  rulesTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold
  },
  addRuleButton: {
    minHeight: '32px',
    padding: '0 14px',
    borderRadius: '8px',
    border: `1px solid ${colors.salmon}`,
    backgroundColor: 'transparent',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer'
  },
  ruleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: '8px',
    alignItems: 'end',
    padding: '12px',
    backgroundColor: '#fff8f3',
    borderRadius: '10px',
    marginBottom: '8px'
  },
  ruleField: {
    display: 'grid',
    gap: '4px'
  },
  ruleLabel: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium
  },
  select: {
    minHeight: '38px',
    padding: '8px 10px',
    borderRadius: '8px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    outline: 'none'
  },
  ruleInput: {
    minHeight: '38px',
    padding: '8px 10px',
    borderRadius: '8px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    outline: 'none'
  },
  removeRuleButton: {
    width: '32px',
    height: '38px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center'
  },
  helpText: {
    margin: '8px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    lineHeight: fonts.lineHeight.normal
  },
  errorText: {
    margin: '8px 0 0',
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  },
  actionsRow: {
    marginTop: '24px',
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
  }
}