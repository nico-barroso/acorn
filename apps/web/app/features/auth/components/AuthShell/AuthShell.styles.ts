import { colors } from '../../../../theme/colors'
import { fonts } from '../../../../theme/fonts'

export const authShellStyles = {
  page: {
    minHeight: '100vh',
    padding: '24px',
    display: 'grid',
    placeItems: 'center'
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    borderRadius: '24px',
    padding: '36px 28px',
    backgroundColor: colors.white,
    border: `1px solid ${colors.brown}22`,
    boxShadow: '0 18px 55px rgba(67, 40, 28, 0.12)'
  },
  badge: {
    width: 'fit-content',
    marginBottom: '18px',
    padding: '6px 12px',
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}20`,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight
  },
  subtitle: {
    margin: '10px 0 24px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    lineHeight: fonts.lineHeight.comfortable
  },
  body: {
    display: 'grid',
    gap: '14px'
  },
  footer: {
    marginTop: '20px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.normal
  },
  footerLink: {
    color: colors.salmon,
    fontWeight: fonts.weight.semibold,
    textDecoration: 'none'
  },
  error: {
    marginTop: '12px',
    padding: '10px 12px',
    borderRadius: '12px',
    color: '#8b2a1b',
    backgroundColor: '#ffe8e2',
    border: '1px solid #f5c3b8',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  }
}
