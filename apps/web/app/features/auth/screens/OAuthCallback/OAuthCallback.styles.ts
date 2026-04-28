import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const oauthCallbackStyles = {
  page: {
    minHeight: '100dvh',
    display: 'grid',
    placeItems: 'center',
    padding: 'clamp(14px, 4vw, 24px)'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: 'clamp(14px, 4vw, 20px)',
    backgroundColor: colors.white,
    border: `1px solid ${colors.brown}1f`,
    boxShadow: '0 14px 40px rgba(67, 40, 28, 0.12)',
    padding: 'clamp(16px, 5vw, 28px)'
  },
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.lg
  },
  text: {
    margin: '10px 0 0',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    lineHeight: fonts.lineHeight.normal
  },
  error: {
    marginTop: '12px',
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  }
}
