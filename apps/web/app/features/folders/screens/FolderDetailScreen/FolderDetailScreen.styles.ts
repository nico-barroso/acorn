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

  // ── Hero ──────────────────────────────────────────────────────────
  hero: {
    background: 'linear-gradient(160deg, #C4806A 0%, #7A4035 100%)',
    borderRadius: '20px',
    padding: '20px 20px 60px',
    position: 'relative' as const,
    boxShadow: '0 12px 40px rgba(122, 64, 53, 0.28), 0 2px 8px rgba(67, 40, 28, 0.12)'
  },
  heroGlow: {
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '20px',
    backgroundImage:
      'radial-gradient(ellipse at 25% 15%, rgba(255,255,255,0.22) 0%, transparent 60%)',
    pointerEvents: 'none' as const
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 14px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.28)',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    textDecoration: 'none',
    marginBottom: '24px'
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const
  },
  heroIcon: {
    marginBottom: '12px',
    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.20))'
  },
  heroTitle: {
    margin: '0 0 8px',
    color: '#FFFFFF',
    fontFamily: fonts.family.primary,
    fontSize: 'clamp(20px, 5vw, 26px)',
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight,
    letterSpacing: '-0.02em'
  },
  smartBadge: {
    display: 'inline-flex',
    padding: '3px 10px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,255,255,0.16)',
    border: '1px solid rgba(255,255,255,0.26)',
    color: 'rgba(255,255,255,0.90)',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    marginBottom: '6px'
  },
  heroSubtitle: {
    margin: '4px 0 0',
    color: 'rgba(255,255,255,0.65)',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  },
  heroDescription: {
    margin: '6px 0 0',
    color: 'rgba(255,255,255,0.55)',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    maxWidth: '380px'
  },

  // ── Metrics ───────────────────────────────────────────────────────
  metricsWrapper: {
    marginTop: '-28px',
    position: 'relative' as const,
    zIndex: 2
  },
  metricsRow: {
    display: 'flex',
    borderRadius: '16px',
    border: `1px solid ${colors.brown}16`,
    backgroundColor: colors.white,
    boxShadow: '0 8px 32px rgba(122, 64, 53, 0.16), 0 2px 8px rgba(67, 40, 28, 0.08)',
    overflow: 'hidden' as const
  },
  metricCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '16px 8px 14px',
    gap: '3px'
  },
  metricCardBorder: {
    borderLeft: `1px solid ${colors.brown}14`
  },
  metricNumber: {
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: '22px',
    fontWeight: fonts.weight.bold,
    lineHeight: 1
  },
  metricNumberAccent: {
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '22px',
    fontWeight: fonts.weight.bold,
    lineHeight: 1
  },
  metricLabel: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    opacity: 0.6
  },

  // ── Filters ───────────────────────────────────────────────────────
  filterRow: {
    display: 'flex',
    gap: '8px',
    paddingTop: '24px',
    paddingBottom: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const
  },
  filterButton: {
    padding: '7px 16px',
    borderRadius: '999px',
    border: `1px solid ${colors.brown}22`,
    backgroundColor: colors.white,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease',
    flexShrink: 0
  },
  filterButtonActive: {
    padding: '7px 16px',
    borderRadius: '999px',
    border: `1px solid ${colors.salmon}44`,
    backgroundColor: `${colors.salmon}12`,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0
  },

  // ── Resource list ─────────────────────────────────────────────────
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    paddingTop: '20px'
  },

  // ── States ────────────────────────────────────────────────────────
  loading: {
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    textAlign: 'center' as const,
    padding: '60px 20px'
  },
  errorText: {
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    textAlign: 'center' as const,
    padding: '40px 20px'
  },
  emptyState: {
    marginTop: '20px',
    borderRadius: '16px',
    border: `1px solid ${colors.brown}16`,
    backgroundColor: colors.white,
    padding: '48px 24px',
    textAlign: 'center' as const
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px'
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
    lineHeight: fonts.lineHeight.normal,
    opacity: 0.7
  }
}
