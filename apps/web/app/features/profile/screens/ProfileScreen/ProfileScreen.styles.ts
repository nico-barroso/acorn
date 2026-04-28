import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const profileScreenStyles = {
  page: {
    minHeight: '100%',
    width: '100%',
    maxWidth: '1080px',
    margin: '0 auto',
    padding: 'clamp(10px, 2vw, 18px)'
  },
  header: {
    borderRadius: '20px',
    border: `1px solid ${colors.brown}20`,
    background: 'linear-gradient(135deg, #fff7f1 0%, #fffdfc 56%, #f8efe9 100%)',
    boxShadow: '0 16px 38px rgba(67, 40, 28, 0.12)',
    padding: 'clamp(18px, 4vw, 28px)',
    display: 'grid',
    gap: '16px'
  },
  avatarRow: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '16px',
    alignItems: 'center'
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}16`,
    border: `2px solid ${colors.salmon}44`,
    display: 'grid',
    placeItems: 'center',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '24px',
    fontWeight: fonts.weight.bold,
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  nameSection: {
    minWidth: 0
  },
  displayName: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  },
  email: {
    margin: '4px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '10px'
  },
  statCard: {
    borderRadius: '12px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    padding: '10px'
  },
  statLabel: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em'
  },
  statValue: {
    margin: '6px 0 0',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold
  },
  sectionTitle: {
    margin: '24px 0 12px',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold
  },
  sectionCard: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    overflow: 'hidden'
  },
  sectionItem: {
    display: 'grid',
    gridTemplateColumns: '36px 1fr auto',
    gap: '12px',
    alignItems: 'center',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  },
  sectionItemHover: {
    backgroundColor: '#fff8f3'
  },
  sectionItemBorder: {
    borderBottom: `1px solid ${colors.brown}12`
  },
  sectionIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '18px'
  },
  sectionIconUser: {
    backgroundColor: `${colors.salmon}14`
  },
  sectionIconPassword: {
    backgroundColor: '#e8f0fe'
  },
  sectionIconLogout: {
    backgroundColor: '#fde8e8'
  },
  sectionIconDanger: {
    backgroundColor: '#fde8e8'
  },
  sectionLabel: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.medium
  },
  sectionLabelDanger: {
    color: '#8b2a1b'
  },
  sectionChevron: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md
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