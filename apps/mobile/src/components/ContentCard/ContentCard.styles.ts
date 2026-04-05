import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 15,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,  // ← esto faltaba
    shadowRadius: 4,
    elevation: 3,
  },

  // Fila principal
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 16,
    minHeight: 90,
  },

  // Thumbnail
  thumbnail: {
    width: 64,
    height: 64,
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
  },
  title: {
    fontFamily: 'CabinetGrotesk-Medium',
    fontSize: 16,
    color: colors.black,
    lineHeight: 20,
  },
  source: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.black,
    marginTop: 4,
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
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  }
});
