import { colors } from '../../../../theme/colors'
import { fonts } from '../../../../theme/fonts'

export const searchStyles = {
  page: {
    minHeight: '100%',
    width: '100%',
    maxWidth: '1080px',
    margin: '0 auto',
    padding: 'clamp(10px, 2vw, 18px)'
  },
  header: {
    marginBottom: '16px'
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold
  },
  subtitle: {
    margin: '8px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.comfortable
  },
  inputWrapper: {
    position: 'relative' as const,
    marginTop: '14px',
    marginBottom: '16px'
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.brownMid,
    fontSize: fonts.size.md,
    pointerEvents: 'none' as const
  },
  searchInput: {
    width: '100%',
    minHeight: '44px',
    padding: '10px 14px 10px 38px',
    borderRadius: '12px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.medium,
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  inputHint: {
    margin: '6px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  resultsCount: {
    margin: '0 0 10px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  resultsGrid: {
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
    wordBreak: 'break-word' as const,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden'
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    marginTop: '8px'
  },
  tagPill: {
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}14`,
    border: `1px solid ${colors.salmon}30`,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    padding: '2px 7px'
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
  initialState: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    padding: '28px 16px',
    textAlign: 'center' as const
  },
  initialStateText: {
    margin: 0,
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
  retryButton: {
    marginTop: '8px',
    minHeight: '36px',
    padding: '0 14px',
    border: `1px solid ${colors.salmon}50`,
    borderRadius: '10px',
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontWeight: fonts.weight.semibold,
    fontSize: fonts.size.sm,
    cursor: 'pointer'
  },
  loading: {
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md
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
  }
}