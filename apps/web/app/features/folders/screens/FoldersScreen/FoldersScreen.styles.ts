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
  header: {
    borderRadius: '20px',
    border: `1px solid ${colors.brown}20`,
    background: 'linear-gradient(135deg, #fff7f1 0%, #fffdfc 56%, #f8efe9 100%)',
    boxShadow: '0 16px 38px rgba(67, 40, 28, 0.12)',
    padding: 'clamp(18px, 4vw, 28px)'
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: 'clamp(26px, 5vw, 34px)',
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight
  },
  subtitle: {
    margin: '10px 0 0',
    maxWidth: '650px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.comfortable
  },
  actionsRow: {
    marginTop: '16px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const
  },
  newButton: {
    minHeight: '40px',
    padding: '0 18px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    transition: 'opacity 0.15s ease'
  },
  smartButton: {
    minHeight: '40px',
    padding: '0 18px',
    borderRadius: '12px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer'
  },
  list: {
    marginTop: '16px',
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
    margin: 0,
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
  },
  emptyCtaButton: {
    marginTop: '16px',
    minHeight: '40px',
    padding: '0 18px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer'
  }
}