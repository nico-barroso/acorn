import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const folderDetailStyles = {
  page: {
    minHeight: '100%',
    width: '100%',
    maxWidth: '1080px',
    margin: '0 auto',
    padding: 'clamp(10px, 2vw, 18px)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  backButton: {
    minHeight: '40px',
    padding: '0 14px',
    borderRadius: '10px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.sm,
    cursor: 'pointer'
  },
  titleSection: {
    flex: 1,
    minWidth: 0
  },
  title: {
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
  subtitle: {
    margin: '4px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal
  },
  smartBadge: {
    display: 'inline-flex',
    padding: '2px 8px',
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}14`,
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    marginLeft: '8px'
  },
  description: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    marginBottom: '16px'
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    overflowX: 'auto' as const
  },
  filterButton: {
    padding: '6px 14px',
    borderRadius: '999px',
    border: `1px solid ${colors.brown}26`,
    backgroundColor: colors.white,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease'
  },
  filterButtonActive: {
    padding: '6px 14px',
    borderRadius: '999px',
    border: `1px solid ${colors.salmon}44`,
    backgroundColor: `${colors.salmon}14`,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const
  },
  metricsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  metricItem: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  },
  metricValue: {
    fontWeight: fonts.weight.semibold,
    color: colors.brown
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px'
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
  },
  emptyState: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    padding: '40px 24px',
    textAlign: 'center' as const
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
  }
}