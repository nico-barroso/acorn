import { colors } from '../../../../theme/colors'
import { fonts } from '../../../../theme/fonts'

export const detailStyles = {
  page: {
    minHeight: '100%',
    width: '100%',
    maxWidth: '720px',
    margin: '0 auto',
    padding: 'clamp(10px, 2vw, 18px)'
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    minHeight: '36px',
    padding: '0 14px',
    border: `1px solid ${colors.brown}35`,
    borderRadius: '10px',
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.sm,
    cursor: 'pointer',
    marginBottom: '16px'
  },
  backArrow: {
    fontSize: fonts.size.md,
    lineHeight: 1
  },
  card: {
    borderRadius: '18px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    boxShadow: '0 18px 44px rgba(67, 40, 28, 0.1)',
    padding: 'clamp(18px, 4vw, 28px)'
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap' as const,
    marginTop: '10px'
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
  readBadge: {
    borderRadius: '999px',
    padding: '4px 8px',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    border: 'none'
  },
  readBadgeUnread: {
    backgroundColor: `${colors.salmon}20`,
    color: colors.brown
  },
  readBadgeRead: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32'
  },
  dateText: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  thumbnail: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover' as const,
    borderRadius: '14px',
    marginTop: '16px',
    border: `1px solid ${colors.brown}18`
  },
  descriptionTitle: {
    margin: '20px 0 6px',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold
  },
  descriptionText: {
    margin: 0,
    color: colors.black,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.comfortable,
    wordBreak: 'break-word' as const
  },
  tagsSection: {
    marginTop: '16px'
  },
  tagsLabel: {
    margin: '0 0 8px',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px'
  },
  tagPill: {
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}14`,
    border: `1px solid ${colors.salmon}30`,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    padding: '4px 10px'
  },
  metaSection: {
    marginTop: '16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  metaCard: {
    borderRadius: '12px',
    border: `1px solid ${colors.brown}18`,
    backgroundColor: '#fff8f3',
    padding: '10px 12px'
  },
  metaLabel: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em'
  },
  metaValue: {
    margin: '4px 0 0',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    wordBreak: 'break-word' as const
  },
  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '20px'
  },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    minHeight: '40px',
    padding: '0 16px',
    borderRadius: '12px',
    border: `1px solid ${colors.brown}32`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  },
  actionButtonPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    minHeight: '40px',
    padding: '0 16px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  },
  actionButtonDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    minHeight: '40px',
    padding: '0 16px',
    borderRadius: '12px',
    border: `1px solid #8b2a1b40`,
    backgroundColor: colors.white,
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  },
  deleteConfirmCard: {
    marginTop: '12px',
    borderRadius: '14px',
    border: `1px solid #8b2a1b40`,
    backgroundColor: '#fff5f5',
    padding: '16px'
  },
  deleteConfirmText: {
    margin: '0 0 12px',
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal
  },
  deleteConfirmRow: {
    display: 'flex',
    gap: '8px'
  },
  copyToast: {
    position: 'fixed' as const,
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: colors.brown,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    padding: '8px 16px',
    borderRadius: '999px',
    boxShadow: '0 8px 24px rgba(67, 40, 28, 0.2)',
    zIndex: 50
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
  },
  skeletonCard: {
    borderRadius: '18px',
    border: `1px solid ${colors.brown}18`,
    backgroundColor: colors.white,
    padding: 'clamp(18px, 4vw, 28px)',
    display: 'grid',
    gap: '12px'
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
  skeletonLineMedium: {
    width: '65%'
  },
  skeletonLineLong: {
    width: '85%'
  }
}