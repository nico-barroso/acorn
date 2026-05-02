import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const searchStyles = {
  page: {
    position: 'relative' as const,
    minHeight: '100%',
    width: '100%',
  },

  inner: {
    position: 'relative' as const,
    zIndex: 1,
    maxWidth: '680px',
    margin: '0 auto',
    paddingTop: '36px',
    paddingBottom: '96px',
  },

  // ─── Background gradient (fixed, viewport-wide) — idéntico al home ────────
  gradient: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: -1,
    pointerEvents: 'none' as const,
    backgroundImage: [
      'radial-gradient(ellipse 140% 45% at 50% 0%, rgba(192, 110, 82, 0.45) 0%, rgba(248, 237, 232, 0.18) 50%, rgba(255, 252, 251, 0) 100%)',
      'radial-gradient(ellipse 140% 65% at 50% 100%, rgba(192, 110, 82, 0.55) 0%, rgba(248, 237, 232, 0.25) 55%, rgba(255, 252, 251, 0) 100%)',
    ].join(', '),
  },

  // ─── Hero decoration (fixed, viewport-wide — igual que el home) ──────────
  heroDecoration: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '260px',
    background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(192, 110, 82, 0.45) 0%, rgba(248, 237, 232, 0.18) 60%, transparent 100%)',
    overflow: 'hidden' as const,
    pointerEvents: 'none' as const,
    zIndex: 0,
  },

  // ─── Hero content ─────────────────────────────────────────────────────────
  heroContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '6px',
    paddingTop: '52px',
    paddingBottom: '44px',
    textAlign: 'center' as const,
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: 'clamp(30px, 5vw, 46px)',
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight,
    textAlign: 'center' as const,
  },
  subtitle: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.body,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    opacity: 0.8,
  },

  // ─── Search input ─────────────────────────────────────────────────────────
  inputWrapper: {
    position: 'relative' as const,
    marginBottom: '16px',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    display: 'flex',
    alignItems: 'center',
    opacity: 0.7,
  },
  searchInput: {
    width: '100%',
    minHeight: '50px',
    padding: '13px 14px 13px 48px',
    borderRadius: '10px',
    border: `2px solid ${colors.brownMid}`,
    backgroundColor: colors.background,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.regular,
    letterSpacing: '0.18px',
    opacity: 0.9,
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
    boxShadow: '0 2px 12px rgba(67, 40, 28, 0.06)',
  },

  // ─── Quick filters ────────────────────────────────────────────────────────
  quickFiltersRow: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginBottom: '16px',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 18px',
    borderRadius: '999px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(67, 40, 28, 0.06)',
    transition: 'all 0.15s ease',
  },
  pillActive: {
    border: `1px solid ${colors.salmon}`,
    backgroundColor: colors.salmon,
    color: colors.white,
    boxShadow: `0 4px 14px rgba(161, 77, 54, 0.3)`,
  },
  pillFilterActive: {
    border: `1px solid ${colors.brown}`,
    backgroundColor: colors.brown,
    color: colors.white,
    boxShadow: `0 4px 14px rgba(67, 40, 28, 0.25)`,
  },

  // ─── Filter panel ─────────────────────────────────────────────────────────
  filterPanelWrapper: {
    display: 'grid' as const,
    transition: 'grid-template-rows 0.22s ease',
  },
  filterPanelInner: {
    overflow: 'hidden' as const,
    minHeight: 0,
  },
  filterPanel: {
    borderRadius: '16px',
    border: `1px solid ${colors.brown}15`,
    backgroundColor: colors.white,
    boxShadow: '0 4px 20px rgba(67, 40, 28, 0.08)',
    padding: '18px',
    marginBottom: '12px',
  },
  filterPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  filterPanelTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    padding: '2px 0',
  },
  filterSection: {
    marginBottom: '14px',
  },
  filterSectionLabel: {
    display: 'block',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: '11px',
    fontWeight: fonts.weight.semibold,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    marginBottom: '8px',
  },
  chipsWrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 16px',
    borderRadius: '999px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.background,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.12s ease',
  },
  chipActive: {
    border: `1px solid ${colors.salmon}`,
    backgroundColor: colors.salmon,
    color: colors.white,
  },

  // ─── Results meta ─────────────────────────────────────────────────────────
  resultsMeta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    margin: '0 0 12px',
    padding: '4px 12px',
    borderRadius: '999px',
    border: `1px solid ${colors.brown}18`,
    backgroundColor: colors.white,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    boxShadow: '0 1px 4px rgba(67, 40, 28, 0.05)',
  },
  resultsMetaDot: {
    width: '5px',
    height: '5px',
    borderRadius: '999px',
    backgroundColor: colors.salmon,
    flexShrink: 0,
  },
  tagQueryHint: {
    margin: '-4px 0 12px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    opacity: 0.8,
  },
  tagQueryBadge: {
    color: colors.salmon,
    fontWeight: fonts.weight.semibold,
  },

  // ─── Results list ─────────────────────────────────────────────────────────
  resultsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  // ─── Load more ────────────────────────────────────────────────────────────
  loadMoreButton: {
    display: 'block',
    width: '100%',
    minHeight: '44px',
    padding: '0 24px',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.body,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    textAlign: 'center' as const,
    marginTop: '8px',
    boxShadow: `0 4px 14px rgba(161, 77, 54, 0.3)`,
    transition: 'opacity 0.15s ease',
  },

  // ─── Initial state ────────────────────────────────────────────────────────
  initialState: {
    padding: '48px 0 40px',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '10px',
  },
  squirrelImg: {
    width: '90px',
    height: '90px',
    objectFit: 'contain' as const,
    marginBottom: '4px',
  },
  initialTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
  },
  initialSubtitle: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    maxWidth: '280px',
    opacity: 0.8,
  },

  // ─── Empty state ──────────────────────────────────────────────────────────
  emptyState: {
    padding: '48px 0 40px',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },
  emptyTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight,
  },
  emptySubtitle: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    maxWidth: '260px',
    opacity: 0.8,
  },

  // ─── Error ────────────────────────────────────────────────────────────────
  errorText: {
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    margin: '0 0 8px',
  },

  // ─── Skeleton ─────────────────────────────────────────────────────────────
  skeletonCard: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}15`,
    backgroundColor: colors.white,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    boxShadow: '0 2px 8px rgba(67, 40, 28, 0.04)',
  },
  skeletonLine: {
    height: '12px',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #efe8e2 0%, #f8f3ef 50%, #efe8e2 100%)',
    backgroundSize: '200% 100%',
    animation: 'skeletonPulse 1.2s ease-in-out infinite',
  },
  skeletonLineShort: { width: '38%' },
  skeletonLineLong: { width: '80%' },
  skeletonLineMedium: { width: '60%' },

  loading: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
  },
}
