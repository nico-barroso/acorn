import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const sectionPageStyles = {
  page: {
    minHeight: '100%',
    display: 'grid',
    placeItems: 'center'
  },
  card: {
    width: '100%',
    maxWidth: '720px',
    backgroundColor: colors.white,
    border: `1px solid ${colors.brown}24`,
    borderRadius: '18px',
    boxShadow: '0 18px 44px rgba(67, 40, 28, 0.1)',
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
    lineHeight: fonts.lineHeight.comfortable
  }
}
