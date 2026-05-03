import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const resourceCardStyles = {
  card: {
    borderRadius: '15px',
    border: `1px solid rgba(192, 110, 82, 0.2)`,
    backgroundColor: colors.white,
    boxShadow: `0 4px 16px rgba(192, 110, 82, 0.15)`,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease, transform 0.15s ease',
    overflow: 'hidden'
  },
  cardHover: {
    boxShadow: `0 8px 24px rgba(192, 110, 82, 0.22)`,
    transform: 'translateY(-1px)',
    cursor: 'pointer'
  },
  cardExpanded: {
    borderRadius: '15px',
    border: `1px solid rgba(192, 110, 82, 0.25)`,
    backgroundColor: colors.white,
    boxShadow: `0 8px 24px rgba(192, 110, 82, 0.2)`,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease, transform 0.15s ease',
    overflow: 'hidden'
  },
  mainRow: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    padding: '10px 20px',
    minHeight: '110px',
    gap: '12px'
  },
  thumbnail: {
    width: '72px',
    height: '72px',
    borderRadius: '13px',
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: `${colors.salmon}14`,
    border: `1px solid ${colors.brown}14`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    borderRadius: '13px'
  },
  thumbnailPlaceholder: {
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '22px',
    fontWeight: fonts.weight.bold,
    userSelect: 'none' as const
  },
  textArea: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
    gap: '2px'
  },
  title: {
    margin: 0,
    color: colors.black,
    fontFamily: fonts.family.primary,
    fontSize: '16px',
    fontWeight: fonts.weight.semibold,
    lineHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const
  },
  sourceRow: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: '5px',
    marginTop: '4px'
  },
  sourceEmoji: {
    fontSize: '11px',
    lineHeight: 1
  },
  source: {
    margin: 0,
    color: colors.black,
    fontFamily: fonts.family.primary,
    fontSize: '12px',
    fontWeight: fonts.weight.regular,
    letterSpacing: '-0.01em'
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
  chevron: {
    fontSize: '22px',
    color: colors.brownMid,
    transform: 'rotate(0deg)',
    flexShrink: 0,
    alignSelf: 'flex-end',
    marginBottom: '6px',
    lineHeight: 1,
    transition: 'transform 0.2s ease',
    userSelect: 'none' as const
  },
  chevronUp: {
    fontSize: '22px',
    color: colors.brownMid,
    transform: 'rotate(90deg)',
    flexShrink: 0,
    alignSelf: 'flex-end',
    marginBottom: '6px',
    lineHeight: 1,
    transition: 'transform 0.2s ease',
    userSelect: 'none' as const
  },
  expandedSection: {
    paddingLeft: '26px',
    paddingRight: '26px',
    paddingBottom: '24px',
    paddingTop: '4px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px'
  },
  expandedDivider: {
    height: '1px',
    backgroundColor: `${colors.brown}16`,
    margin: '0 0 4px'
  },
  description: {
    margin: 0,
    color: colors.black,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal,
    wordBreak: 'break-word' as const
  },
  metaRow: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap' as const
  },
  metaLabel: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: '14px',
    fontWeight: fonts.weight.regular,
    letterSpacing: '-0.01em',
    flexShrink: 0
  },
  metaValue: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: '14px',
    fontWeight: fonts.weight.regular,
    letterSpacing: '-0.01em'
  },
  statusBadge: {
    display: 'inline-flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '999px',
    backgroundColor: colors.brownMid,
    border: 'none',
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: '10px',
    fontWeight: fonts.weight.regular,
    letterSpacing: '0.02em',
    cursor: 'default'
  },
  statusBadgeRead: {
    display: 'inline-flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '999px',
    backgroundColor: colors.brownMid,
    border: 'none',
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: '10px',
    fontWeight: fonts.weight.regular,
    letterSpacing: '0.02em',
    cursor: 'default'
  },
  readToggleButton: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    padding: 0,
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '14px',
    fontWeight: fonts.weight.regular,
    textDecoration: 'underline',
    cursor: 'pointer',
    letterSpacing: '-0.01em'
  },
  tagsSection: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '6px'
  },
  copyUrlButton: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    padding: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: '14px',
    fontWeight: fonts.weight.regular,
    textDecoration: 'underline',
    cursor: 'pointer',
    letterSpacing: '-0.01em'
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '40px',
    padding: '0 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'opacity 0.15s ease',
    boxSizing: 'border-box' as const
  }
}
