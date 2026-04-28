import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // ── Gradiente ──
  topGradient: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 0,
  },
  // ── Hero ──
  heroContainer: {
    paddingBottom: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  heroTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 30,
    color: colors.brown,
    lineHeight: 31,
    fontWeight: '700',
    paddingTop: 20,
  },
  newFolderLink: {
    paddingTop: 20,
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: colors.brown,
    textDecorationLine: 'underline',
    letterSpacing: 0.32,
    marginTop: 4,
  },
  // ── SVG pestaña ──
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
  // ── Contenedor carpetas ──
  cardWrapper: {
    top: -90,
    flexGrow: 1,
    backgroundColor: '#F3CCBE',
    borderRadius: 20,
    padding: 36,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  // ── Lista ──
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
  // ── Empty ──
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
