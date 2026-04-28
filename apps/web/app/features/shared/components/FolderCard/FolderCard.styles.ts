import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const folderCardStyles = {
  card: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    boxShadow: '0 10px 24px rgba(67, 40, 28, 0.08)',
    padding: '16px',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    display: 'grid',
    gap: '8px'
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 14px 32px rgba(67, 40, 28, 0.12)'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px'
  },
  iconAndName: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: 0
  },
  icon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: `${colors.salmon}14`,
    border: `1px solid ${colors.salmon}35`,
    display: 'grid',
    placeItems: 'center',
    color: colors.salmon,
    fontSize: '20px',
    flexShrink: 0
  },
  nameSection: {
    flex: 1,
    minWidth: 0
  },
  name: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold,
    lineHeight: fonts.lineHeight.tight,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  },
  subtitle: {
    margin: '2px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    lineHeight: fonts.lineHeight.normal
  },
  menuButton: {
    background: 'none',
    border: 'none',
    padding: '6px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: '18px',
    lineHeight: 1,
    transition: 'background-color 0.15s ease'
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
    overflow: 'hidden'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    marginTop: '4px'
  },
  meta: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  badge: {
    display: 'inline-flex',
    padding: '2px 8px',
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}14`,
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium
  }
}