import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const profileScreenStyles = {
  page: {
    position: 'relative' as const,
    minHeight: '100%',
    width: '100%'
  },
  heroGradient: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '260px',
    background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(192, 110, 82, 0.45) 0%, rgba(248, 237, 232, 0.18) 60%, transparent 100%)',
    pointerEvents: 'none' as const,
    zIndex: 0
  },
  inner: {
    position: 'relative' as const,
    zIndex: 1,
    maxWidth: '560px',
    margin: '0 auto',
    padding: 'clamp(10px, 2vw, 18px)'
  },
  header: {
    paddingTop: 'clamp(40px, 7vw, 64px)',
    paddingBottom: 'clamp(32px, 5vw, 48px)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px'
  },
  avatar: {
    width: '84px',
    height: '84px',
    borderRadius: '999px',
    backgroundColor: `rgba(249, 111, 93, 0.12)`,
    border: `2.5px solid rgba(255,255,255,0.7)`,
    display: 'grid',
    placeItems: 'center',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '30px',
    fontWeight: fonts.weight.bold,
    overflow: 'hidden',
    boxShadow: '0 6px 24px rgba(67, 40, 28, 0.22), 0 0 0 6px rgba(255,255,255,0.18)',
    marginBottom: '14px',
    flexShrink: 0,
    cursor: 'pointer'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  displayName: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight,
    textAlign: 'center' as const
  },
  email: {
    margin: '5px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    opacity: 0.72,
    textAlign: 'center' as const,
    letterSpacing: '0.02em'
  },
  section: {
    display: 'grid',
    gap: '8px',
    marginTop: '20px'
  },
  sectionTitle: {
    margin: '0 0 4px',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold
  },
  sectionCard: {
    borderRadius: '16px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(67, 40, 28, 0.06)'
  },
  sectionItem: {
    display: 'grid',
    gridTemplateColumns: '42px 1fr auto',
    gap: '12px',
    alignItems: 'center',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    width: '100%',
    background: 'none',
    border: 'none',
    textDecoration: 'none'
  },
  sectionItemBorder: {
    borderBottom: `1px solid ${colors.brown}12`
  },
  sectionIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: 'rgba(249, 111, 93, 0.1)',
    flexShrink: 0
  },
  sectionLabel: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: '15px',
    fontWeight: fonts.weight.medium,
    textAlign: 'left' as const
  },
  sectionLabelDanger: {
    color: '#8b2a1b'
  },
  sectionChevron: {
    opacity: 0.35,
    display: 'flex',
    alignItems: 'center'
  },
  loading: {
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    textAlign: 'center' as const,
    padding: '40px'
  },
  errorText: {
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    textAlign: 'center' as const,
    padding: '20px'
  }
}
