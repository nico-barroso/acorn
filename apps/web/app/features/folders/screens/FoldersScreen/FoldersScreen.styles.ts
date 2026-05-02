import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const foldersScreenStyles = {
  page: {
    minHeight: '100%',
    width: '100%',
    maxWidth: '1080px',
    margin: '0 auto',
    padding: 'clamp(10px, 2vw, 18px)'
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    position: 'relative' as const,
    overflow: 'hidden',
    paddingTop: '24px',
    paddingBottom: '32px'
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '24px',
    flexWrap: 'wrap' as const
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: 'clamp(44px, 6.5vw, 64px)',
    fontWeight: fonts.weight.bold,
    lineHeight: 1.02,
    letterSpacing: '-0.02em'
  },
  newButton: {
    minHeight: '36px',
    padding: '0 18px',
    borderRadius: '10px',
    border: `1.5px solid ${colors.salmon}`,
    backgroundColor: 'transparent',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
    whiteSpace: 'nowrap' as const,
    alignSelf: 'flex-end' as const
  },

  // ── Divider ─────────────────────────────────────────────
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '20px'
  },
  dividerCount: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    whiteSpace: 'nowrap' as const,
    opacity: 0.5,
    letterSpacing: '0.06em'
  },
  dividerLine: {
    flex: 1,
    height: '0.5px',
    background: `linear-gradient(to right, ${colors.brown}20, ${colors.brown}06)`
  },

  // ── Grid ────────────────────────────────────────────────
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '10px'
  },

  // ── States ──────────────────────────────────────────────
  loading: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    textAlign: 'center' as const,
    padding: '60px 24px',
    opacity: 0.7
  },
  errorText: {
    margin: 0,
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    textAlign: 'center' as const,
    padding: '20px'
  },

  // ── Empty ───────────────────────────────────────────────
  emptyState: {
    paddingTop: '32px',
    paddingBottom: '40px'
  },
  emptyEyebrow: {
    margin: '0 0 12px',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    opacity: 0.75
  },
  emptyTitle: {
    margin: '0 0 16px',
    color: colors.brown,
    fontFamily: fonts.family.heading,
    fontSize: 'clamp(28px, 4vw, 40px)',
    fontWeight: fonts.weight.bold,
    lineHeight: 1.1,
    letterSpacing: '-0.02em'
  },
  emptyText: {
    margin: '0 0 28px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.comfortable,
    opacity: 0.75
  },
  emptyCtaButton: {
    minHeight: '40px',
    padding: '0 20px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    letterSpacing: '0.01em'
  }
}
