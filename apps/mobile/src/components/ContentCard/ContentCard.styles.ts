import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(192, 110, 82, 0.2)',
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  // Fila principal
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    minHeight: 125,
  },

  // Thumbnail
  thumbnail: {
    width: 74,
    height: 74,
    borderRadius: 13,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: 'transparent',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  thumbnailImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 13,
  },
  thumbnailIcon: {
    width: 44,
    height: 44,
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
    justifyContent: 'flex-start',
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
  sourceEmoji: {
    fontSize: 11,
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
    paddingBottom: 24,
    paddingTop: 4,
    gap: 22,
  },

  // Meta info
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brown,
    letterSpacing: -0.12,
  },
  metaValue: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
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
  copyUrlText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brown,
    textDecorationLine: 'underline',
  },
  readToggleButton: {
    marginLeft: 'auto',
  },
  readToggleText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.salmon,
    textDecorationLine: 'underline',
  },
  tagsRowCollapsed: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  note: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.brownMid,
    marginTop: 4,
    lineHeight: 16,
  },
  tagsSection: {
    marginBottom: 4,
  },
  tagsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  addTagButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.salmon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTagIcon: {
    color: colors.salmon,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Satoshi-Bold',
    marginTop: -2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  noTagsHint: {
    marginTop: 4,
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brownMid,
  },
  detailLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLinkText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brownMid,
    textDecorationLine: 'underline',
  },
});
