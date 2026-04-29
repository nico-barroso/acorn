import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 27, 27, 0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '92%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: 'rgba(66, 36, 25, 0.1)',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  handle: {
    width: 81,
    height: 5,
    borderRadius: 100,
    backgroundColor: colors.brownMid,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 22,
    color: colors.brown,
  },
  subtitle: {
    marginBottom: 14,
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: `${colors.brown}30`,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.black,
  },
  inputAction: {
    minWidth: 100,
  },
  error: {
    marginTop: 8,
    color: '#8b2a1b',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
  listContent: {
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: colors.brown,
    transform: [{ scale: 1.15 }],
  },
  tagNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tagCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.brown}18`,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tagName: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 18,
    color: colors.black,
  },
  tagMeta: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brownMid,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
  },
  emptyTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 22,
    color: colors.black,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brownMid,
    textAlign: 'center',
  },
});
