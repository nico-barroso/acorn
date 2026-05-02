import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const homeStyles = {
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
    overflow: 'hidden',
    pointerEvents: 'none' as const,
    zIndex: 0
  },
  inner: {
    position: 'relative' as const,
    zIndex: 1,
    maxWidth: '1080px',
    margin: '0 auto',
    display: 'grid',
    gap: '36px',
    paddingTop: '140px'
  },

  // ─── Header ───────────────────────────────────────────────
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  greeting: {
    display: 'grid',
    gap: '4px',
    textAlign: 'center' as const
  },
  greetingTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: 'clamp(36px, 5.5vw, 52px)',
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight,
    textAlign: 'center' as const
  },
  greetingWelcome: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.body,
    fontSize: fonts.size.md,
    lineHeight: fonts.lineHeight.normal,
    textAlign: 'center' as const
  },
  greetingSubtitle: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.body,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    textAlign: 'center' as const,
    opacity: 0.75
  },
  avatar: {
    position: 'absolute' as const,
    top: '20px',
    right: 0,
    width: '48px',
    height: '48px',
    borderRadius: '999px',
    backgroundColor: colors.salmon,
    color: colors.white,
    display: 'grid',
    placeItems: 'center',
    fontFamily: fonts.family.heading,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    letterSpacing: '0.02em',
    overflow: 'hidden',
    border: `2px solid ${colors.brownMid}`,
    boxShadow: '0 4px 14px rgba(72, 57, 42, 0.25), 0 1px 4px rgba(192, 110, 82, 0.2)'
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    borderRadius: '999px'
  },

  // ─── Metrics ──────────────────────────────────────────────
  metricsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center'
  },
  metricPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '999px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    boxShadow: '0 2px 8px rgba(67, 40, 28, 0.06)'
  },
  metricValue: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold
  },
  metricLabel: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.body,
    fontSize: fonts.size.sm
  },
  metricDot: {
    width: '6px',
    height: '6px',
    borderRadius: '999px',
    backgroundColor: colors.salmon,
    flexShrink: 0
  },

  // ─── Section ──────────────────────────────────────────────
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px'
  },
  sectionTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold
  },
  sectionSubtitle: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.body,
    fontSize: fonts.size.sm,
    textAlign: 'center' as const,
    lineHeight: fonts.lineHeight.normal
  },

  // ─── Grid ─────────────────────────────────────────────────
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px'
  },

  // ─── Skeleton ─────────────────────────────────────────────
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
  skeletonLineShort: { width: '45%' },
  skeletonLineLong: { width: '85%' },
  skeletonLineMedium: { width: '65%' },

  // ─── Bottom ───────────────────────────────────────────────
  bottomArea: {
    display: 'grid',
    gap: '8px'
  },
  loadMoreButton: {
    width: '100%',
    minHeight: '44px',
    borderRadius: '12px',
    border: `1px solid ${colors.brown}26`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.body,
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
    fontFamily: fonts.family.body,
    fontSize: fonts.size.xs
  },

  // ─── Empty ────────────────────────────────────────────────
  emptyState: {
    display: 'grid',
    gap: '12px',
    justifyItems: 'center',
    textAlign: 'center' as const,
    padding: '48px 24px'
  },
  emptyTitle: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold
  },
  emptyText: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.body,
    fontSize: fonts.size.md,
    lineHeight: fonts.lineHeight.comfortable,
    maxWidth: '360px'
  },
  emptyCtaButton: {
    minHeight: '44px',
    padding: '0 24px',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.body,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer'
  },

  // ─── Error / Loading ──────────────────────────────────────
  errorText: {
    margin: 0,
    color: '#8b2a1b',
    fontFamily: fonts.family.body,
    fontSize: fonts.size.sm
  },
  loading: {
    color: colors.brownMid,
    fontFamily: fonts.family.body,
    fontSize: fonts.size.md
  }
}
