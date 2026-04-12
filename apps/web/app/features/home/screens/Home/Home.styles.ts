import { colors } from '../../../../theme/colors'
import { fonts } from '../../../../theme/fonts'

export const homeStyles = {
  page: {
    minHeight: '100dvh',
    padding: 'clamp(14px, 4vw, 24px)',
    display: 'grid',
    placeItems: 'center'
  },
  card: {
    width: '100%',
    maxWidth: '560px',
    backgroundColor: colors.white,
    borderRadius: 'clamp(16px, 4vw, 24px)',
    border: `1px solid ${colors.brown}24`,
    boxShadow: '0 20px 50px rgba(67, 40, 28, 0.12)',
    padding: 'clamp(18px, 5vw, 30px)'
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold
  },
  text: {
    margin: '10px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    lineHeight: fonts.lineHeight.normal,
    wordBreak: 'break-word' as const
  },
  button: {
    marginTop: '22px',
    width: '100%',
    minHeight: '46px',
    padding: '0 18px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: colors.salmon,
    color: colors.white,
    fontFamily: fonts.family.primary,
    fontWeight: fonts.weight.semibold,
    fontSize: fonts.size.md,
    cursor: 'pointer'
  },
  loading: {
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md
  }
}
