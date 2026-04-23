import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // ← esto faltaba
    shadowRadius: 4,
    elevation: 3,
  },

  // Thumbnail derecho con degradado diagonal
  thumbnailRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 190,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
  },
  thumbnailRightImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailRightGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // Hero expandido
  heroImageBg: {
    minHeight: 160,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImageBgImage: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    padding: 18,
    paddingHorizontal: 20,
    gap: 5,
  },
  heroTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontWeight: '700',
    fontSize: 18,
    color: colors.white,
    lineHeight: 23,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(10,5,2,0.55)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  heroSource: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: -0.1,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(10,5,2,0.45)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },

  // Fila principal
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    minHeight: 110,
  },

  // Thumbnail
  thumbnail: {
    width: 74,
    height: 74,
    borderRadius: 13,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: colors.black,
    flexShrink: 0,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brownMid,
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.2,
  },
  statusIcon: {
    fontSize: 10,
  },
  // Texto principal
  textLayout: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 60,
    gap: 2,
  },
  title: {
    fontFamily: 'CabinetGrotesk-Medium',
    fontWeight: 500,
    fontSize: 16,
    color: colors.black,
    lineHeight: 20,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  favicon: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  source: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: 400,
    fontSize: 12,
    color: colors.black,
    letterSpacing: -0.12,
  },

  // Chevron
  chevron: {
    fontSize: 22,
    color: colors.brownMid,
    transform: [{ rotate: '90deg' }],
    marginLeft: 8,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  chevronUp: {
    transform: [{ rotate: '-90deg' }],
  },

  // Sección expandida
  expandedSection: {
    paddingHorizontal: 26,
    paddingBottom: 16,
    gap: 8,
  },

  // Meta info
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  metaLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brown,
    letterSpacing: -0.12,
  },
  metaValue: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brown,
    letterSpacing: -0.12,
  },

  // Copiar URL
  copyUrlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  copyUrlIcon: {
    fontSize: 14,
    color: colors.brown,
  },
  copyUrlText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brown,
    textDecorationLine: 'underline',
  },
  readToggleButton: {
    marginLeft: 'auto',
  },
  readToggleText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.salmon,
    textDecorationLine: 'underline',
  },
});
