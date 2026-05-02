import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const folderCardStyles = {
  card: {
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: colors.white,
    border: '1px solid rgba(201, 107, 80, 0.22)',
    cursor: 'pointer',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    display: 'flex',
    gridColumn: 'span 2',
    minHeight: '148px'
  },
  left: {
    width: '164px',
    flexShrink: 0,
    background: 'linear-gradient(158deg, #D4A090 0%, #B06A54 52%, #8C4232 100%)',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftGlow: {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse 80% 60% at 28% 22%, rgba(255,255,255,0.22) 0%, transparent 58%), radial-gradient(ellipse 50% 40% at 75% 80%, rgba(0,0,0,0.18) 0%, transparent 65%)',
    pointerEvents: 'none' as const
  },
  leftFade: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    width: '32px',
    height: '100%',
    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.55))',
    pointerEvents: 'none' as const,
    zIndex: 1
  },
  right: {
    flex: 1,
    padding: '16px 18px 16px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minWidth: 0
  },
  top: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px'
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
    whiteSpace: 'nowrap' as const,
    flex: 1,
    minWidth: 0
  },
  description: {
    margin: '6px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    display: '-webkit-box' as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    opacity: 0.8
  },
  menuWrap: {
    position: 'relative' as const,
    flexShrink: 0
  },
  menuButton: {
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '9px',
    cursor: 'pointer',
    fontSize: '17px',
    lineHeight: 1,
    fontFamily: fonts.family.primary,
    background: `${colors.brown}0C`,
    color: colors.brownMid,
    transition: 'background-color 0.15s ease'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px'
  },
  footerMeta: {
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium
  },
  footerDate: {
    color: `${colors.brownMid}70`,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  }
}
