import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export const styles = StyleSheet.create({
  panel: {
    flex:1,
    backgroundColor: '#F3CCBE',
    paddingTop: 70,
  },
  inner: {
    paddingHorizontal: 20,
    gap: 20,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: fonts.size.xxl,
    color: colors.brown,
    fontWeight: '700',
  },
  newFolderLink: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: colors.brown,
    textDecorationLine: 'underline',
    letterSpacing: 0.32,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  decorationShadowWrapper: {
    marginLeft: 0,
    marginRight: 0,
    alignSelf: 'stretch',
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  cardWrapper: {
    flex: 1,
    backgroundColor: '#F3CCBE',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 36,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    marginTop: -40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: 'CabinetGrotesk-Medium',
    fontSize: 20,
    color: colors.brown,
    marginBottom: 16,
  },
  separator: {
    height: 22,
  },
  errorText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: '#8b2a1b',
    marginBottom: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 22,
    color: colors.brown,
    textAlign: 'center',
    fontWeight: '700',
  },
  emptySubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 15,
    color: colors.brownMid,
    textAlign: 'center',
  },
});
