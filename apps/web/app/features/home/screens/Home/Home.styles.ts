import { colors } from '../../../../theme/colors'
import { fonts } from '../../../../theme/fonts'

export const homeStyles = {
  page: {
    minHeight: '100%',
    width: '100%',
    maxWidth: '1080px',
    margin: '0 auto',
    padding: 'clamp(10px, 2vw, 18px)'
  },
  hero: {
    borderRadius: '20px',
    border: `1px solid ${colors.brown}20`,
    background: 'linear-gradient(135deg, #fff7f1 0%, #fffdfc 56%, #f8efe9 100%)',
    boxShadow: '0 16px 38px rgba(67, 40, 28, 0.12)',
    padding: 'clamp(18px, 4vw, 28px)'
  },
  heroTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  },
  userPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}16`,
    border: `1px solid ${colors.salmon}35`,
    padding: '6px 10px'
  },
  userPillAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '999px',
    display: 'grid',
    placeItems: 'center',
    color: colors.white,
    backgroundColor: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.bold,
    textTransform: 'uppercase' as const
  },
  userPillText: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium
  },
  signOutButton: {
    minHeight: '40px',
    padding: '0 14px',
    border: `1px solid ${colors.brown}35`,
    borderRadius: '10px',
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontWeight: fonts.weight.semibold,
    fontSize: fonts.size.sm,
    cursor: 'pointer'
  },
  heroTitle: {
    margin: '12px 0 0',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: 'clamp(26px, 5vw, 34px)',
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight
  },
  heroSubtitle: {
    margin: '10px 0 0',
    maxWidth: '650px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.comfortable
  },
  metricsRow: {
    marginTop: '16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '10px'
  },
  metricCard: {
    borderRadius: '12px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    padding: '10px'
  },
  metricLabel: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em'
  },
  metricValue: {
    margin: '6px 0 0',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold
  },
  sectionHeader: {
    marginTop: '16px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '10px'
  },
  sectionTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold
  },
  sectionMeta: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px'
  },
  resourceCard: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    boxShadow: '0 10px 24px rgba(67, 40, 28, 0.08)',
    padding: '14px'
  },
  cardTopRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px'
  },
  resourceTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold,
    lineHeight: fonts.lineHeight.tight
  },
  domainPill: {
    borderRadius: '999px',
    border: `1px solid ${colors.brown}26`,
    backgroundColor: '#faf2ee',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    padding: '4px 7px',
    whiteSpace: 'nowrap' as const
  },
  resourceMeta: {
    margin: '8px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  resourceSnippet: {
    margin: '10px 0 0',
    color: colors.black,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    wordBreak: 'break-word' as const
  },
  statusBadge: {
    display: 'inline-flex',
    marginTop: '10px',
    padding: '4px 8px',
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}20`,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    border: 'none'
  },
  statusBadgeRead: {
    display: 'inline-flex',
    marginTop: '10px',
    padding: '4px 8px',
    borderRadius: '999px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    border: 'none'
  },
  skeletonCard: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}18`,
    backgroundColor: colors.white,
    padding: '14px',
    display: 'grid',
    gap: '8px'
  },
  skeletonLine: {
    height: '12px',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #efe8e2 0%, #f8f3ef 50%, #efe8e2 100%)',
    backgroundSize: '200% 100%',
    animation: 'skeletonPulse 1.2s ease-in-out infinite'
  },
  skeletonLineShort: {
    width: '45%'
  },
  skeletonLineLong: {
    width: '85%'
  },
  skeletonLineMedium: {
    width: '65%'
  },
  bottomArea: {
    marginTop: '12px',
    display: 'grid',
    gap: '8px'
  },
  loadMoreButton: {
    width: '100%',
    minHeight: '44px',
    borderRadius: '12px',
    border: `1px solid ${colors.brown}32`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer'
  },
  observerSentinel: {
    width: '100%',
    height: '1px'
  },
  endText: {
    margin: 0,
    color: colors.brownMid,
    textAlign: 'center' as const,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  emptyState: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    padding: '16px'
  },
  emptyTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.semibold
  },
  emptyText: {
    margin: '8px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal
  },
  errorText: {
    margin: 0,
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  },
  loading: {
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md
  }
}
