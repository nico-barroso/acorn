import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const folderCardStyles = {
  card: {
    borderRadius: '16px',
    backgroundColor: colors.white,
    border: `1px solid ${colors.brown}12`,
    cursor: 'pointer',
    transition: 'box-shadow 0.18s ease, transform 0.18s ease',
    padding: '16px 18px 14px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px'
  },

  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  },
  typeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  typeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '999px',
    backgroundColor: colors.salmon,
    flexShrink: 0,
    opacity: 0.7
  },
  typeLabel: {
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '11px',
    fontWeight: fonts.weight.semibold,
    letterSpacing: '0.07em',
    textTransform: 'uppercase' as const,
    opacity: 0.85
  },

  menuWrap: {
    position: 'relative' as const,
    flexShrink: 0
  },
  menuButton: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: 1,
    fontFamily: fonts.family.primary,
    background: 'transparent',
    color: `${colors.brownMid}60`,
    transition: 'background-color 0.15s ease, color 0.15s ease'
  },

  name: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold,
    lineHeight: fonts.lineHeight.tight,
    letterSpacing: '-0.01em'
  },
  description: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    display: '-webkit-box' as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    opacity: 0.65
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '4px'
  },
  footerMeta: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    opacity: 0.45
  },
  footerDate: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    opacity: 0.35
  }
}
