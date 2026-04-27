import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const resourceCardStyles = {
  card: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: colors.white,
    boxShadow: '0 10px 24px rgba(67, 40, 28, 0.08)',
    padding: '14px',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease, transform 0.15s ease'
  },
  cardHover: {
    boxShadow: '0 14px 32px rgba(67, 40, 28, 0.14)',
    transform: 'translateY(-1px)'
  },
  cardExpanded: {
    borderRadius: '14px',
    border: `1px solid ${colors.brown}30`,
    backgroundColor: colors.white,
    boxShadow: '0 14px 32px rgba(67, 40, 28, 0.12)',
    padding: '14px',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease, transform 0.15s ease'
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px'
  },
  thumbnail: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    objectFit: 'cover' as const,
    flexShrink: 0,
    border: `1px solid ${colors.brown}14`
  },
  thumbnailPlaceholder: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: `${colors.salmon}14`,
    border: `1px solid ${colors.brown}14`,
    display: 'grid',
    placeItems: 'center' as const,
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '18px',
    fontWeight: fonts.weight.bold,
    flexShrink: 0
  },
  textArea: {
    flex: 1,
    minWidth: 0
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold,
    lineHeight: fonts.lineHeight.tight,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const
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
    whiteSpace: 'nowrap' as const,
    flexShrink: 0
  },
  source: {
    margin: '2px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    marginTop: '6px'
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
  description: {
    margin: '8px 0 0',
    color: colors.black,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    wordBreak: 'break-word' as const
  },
  expandedSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${colors.brown}16`,
    display: 'grid',
    gap: '8px'
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap' as const
  },
  metaLabel: {
    margin: 0,
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em'
  },
  metaValue: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  },
  statusBadge: {
    display: 'inline-flex',
    padding: '3px 8px',
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
    padding: '3px 8px',
    borderRadius: '999px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    border: 'none'
  },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    minHeight: '32px',
    padding: '0 12px',
    borderRadius: '8px',
    border: `1px solid ${colors.brown}30`,
    backgroundColor: colors.white,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    minHeight: '32px',
    padding: '0 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'opacity 0.15s ease'
  },
  chevron: {
    fontSize: '18px',
    lineHeight: 1,
    color: colors.brownMid,
    transition: 'transform 0.2s ease',
    flexShrink: 0
  },
  chevronUp: {
    fontSize: '18px',
    lineHeight: 1,
    color: colors.brownMid,
    transform: 'rotate(180deg)',
    flexShrink: 0
  }
}