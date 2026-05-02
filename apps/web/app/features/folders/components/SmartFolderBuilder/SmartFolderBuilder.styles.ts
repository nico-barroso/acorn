import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const smartFolderBuilderStyles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(43, 25, 16, 0.50)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 60,
    padding: '20px'
  },

  modal: {
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    backgroundColor: colors.white,
    borderRadius: '24px',
    border: `1px solid ${colors.brown}14`,
    boxShadow: '0 40px 80px rgba(43, 25, 16, 0.24), 0 8px 20px rgba(43, 25, 16, 0.10)'
  },

  // ── Header ────────────────────────────────────────────────────────
  modalHeader: {
    position: 'relative' as const,
    padding: '32px 28px 24px',
    background: `linear-gradient(160deg, #fff8f4 0%, #ffffff 70%)`,
    borderRadius: '24px 24px 0 0',
    overflow: 'hidden' as const,
    borderBottom: `1px solid ${colors.brown}0E`
  },
  // folder SVG watermark — positioned in TSX with inline style
  headerWatermark: {
    position: 'absolute' as const,
    right: '-8px',
    top: '-4px',
    opacity: 0.09,
    transform: 'rotate(12deg) scale(1.6)',
    pointerEvents: 'none' as const
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    marginBottom: '8px'
  },
  eyebrowDot: {
    width: '5px',
    height: '5px',
    borderRadius: '999px',
    backgroundColor: colors.salmon,
    flexShrink: 0,
    opacity: 0.7
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: 'clamp(22px, 4vw, 28px)',
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight,
    letterSpacing: '-0.02em'
  },

  // ── Body ──────────────────────────────────────────────────────────
  body: {
    padding: '24px 28px 28px'
  },

  // ── Fields ────────────────────────────────────────────────────────
  fieldGroup: {
    display: 'grid',
    gap: '14px'
  },
  field: {
    display: 'grid',
    gap: '6px'
  },
  label: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    letterSpacing: '0.04em'
  },
  input: {
    width: '100%',
    minHeight: '44px',
    padding: '11px 14px',
    borderRadius: '12px',
    border: `1.5px solid ${colors.brown}1E`,
    backgroundColor: '#fdf8f5',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    outline: 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    boxSizing: 'border-box' as const
  },
  textarea: {
    width: '100%',
    minHeight: '72px',
    padding: '11px 14px',
    borderRadius: '12px',
    border: `1.5px solid ${colors.brown}1E`,
    backgroundColor: '#fdf8f5',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    outline: 'none',
    resize: 'vertical' as const,
    transition: 'border-color 0.18s, box-shadow 0.18s',
    boxSizing: 'border-box' as const
  },

  // ── Rules ─────────────────────────────────────────────────────────
  rulesSection: {
    marginTop: '24px'
  },
  rulesHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  rulesTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  rulesTitle: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    letterSpacing: '0.04em'
  },
  rulesDivider: {
    flex: 1,
    height: '1px',
    background: `linear-gradient(to right, ${colors.brown}14, transparent)`
  },
  addRuleButton: {
    minHeight: '28px',
    padding: '0 11px',
    borderRadius: '8px',
    border: `1px solid ${colors.salmon}55`,
    backgroundColor: `${colors.salmon}0A`,
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap' as const
  },
  helpText: {
    margin: '0 0 12px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    lineHeight: fonts.lineHeight.normal,
    opacity: 0.5
  },

  // rule row: number badge + 3 controls + remove
  ruleRow: {
    display: 'grid',
    gridTemplateColumns: '24px 1fr 1fr 1fr auto',
    gap: '6px',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: '#fdf8f5',
    border: `1px solid ${colors.brown}0C`,
    borderRadius: '14px',
    marginBottom: '8px'
  },
  ruleNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}18`,
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '11px',
    fontWeight: fonts.weight.bold,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    lineHeight: 1
  },
  ruleField: {
    display: 'grid',
    gap: '3px'
  },
  ruleLabel: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: '10px',
    fontWeight: fonts.weight.semibold,
    letterSpacing: '0.05em',
    opacity: 0.55
  },
  select: {
    minHeight: '36px',
    padding: '6px 8px',
    borderRadius: '9px',
    border: `1.5px solid ${colors.brown}18`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
    width: '100%'
  },
  ruleInput: {
    minHeight: '36px',
    padding: '6px 8px',
    borderRadius: '9px',
    border: `1.5px solid ${colors.brown}18`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  removeRuleButton: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: `${colors.brownMid}60`,
    fontFamily: fonts.family.primary,
    fontSize: '16px',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    lineHeight: 1,
    transition: 'color 0.15s, background-color 0.15s'
  },

  // ── States ────────────────────────────────────────────────────────
  errorText: {
    margin: '14px 0 0',
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    padding: '10px 14px',
    backgroundColor: 'rgba(139,42,27,0.05)',
    borderRadius: '10px',
    border: '1px solid rgba(139,42,27,0.12)'
  },

  // ── Actions ───────────────────────────────────────────────────────
  actionsRow: {
    marginTop: '24px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cancelButton: {
    minHeight: '40px',
    padding: '0 18px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: `${colors.brownMid}90`,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer'
  },
  saveButton: {
    minHeight: '40px',
    padding: '0 20px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(161, 77, 54, 0.35)',
    transition: 'opacity 0.15s'
  },
  saveButtonDisabled: {
    minHeight: '40px',
    padding: '0 20px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'not-allowed',
    opacity: 0.38,
    boxShadow: 'none'
  }
}
