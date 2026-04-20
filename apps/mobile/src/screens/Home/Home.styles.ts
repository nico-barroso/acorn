import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 30,
  },
  heroInner: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── Hero ──
  heroContainer: {
    marginBottom: 24,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: colors.background,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  heroImage: {
    resizeMode: 'cover',
  },

  // ── Header ──
  header: {
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    zIndex: 10,
    elevation: 8,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    aspectRatio: 3,
  },
  headerAvatar: {
    width: 54,
    height: 54,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    resizeMode: 'cover',
    width: '120%',
    height: '120%',
  },

  // ── Saludo ──
  greetingSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  greetingSubtitle: {
    fontFamily: 'CabinetGrotesk-Regular',
    fontSize: 16,
    color: colors.brown,
    letterSpacing: 0.32,
    marginBottom: 4,
    opacity: 0.8,
    fontWeight: '400',
  },
  greetingTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 35,
    color: colors.brown,
    lineHeight: 42,
    textAlign: 'center',
    fontWeight: '700',
  },

  // ── Featured card ──
  featuredCard: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 16,
  },

  // ── Sección ──
  sectionHeader: {
    position: 'relative',
  },
  sectionTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 25,
    color: colors.black,
    textAlign: 'center',
    lineHeight: 30,
  },
  sectionSubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 15,
    color: colors.black,
    opacity: 0.8,
    textAlign: 'center',
    letterSpacing: 0.15,
    lineHeight: 24,
    marginTop: 4,
  },
  cardList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  listError: {
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#8b2a1b',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
  emptyState: {
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 25,
    top: -20,
    color: colors.black,
    textAlign: 'center',
    fontWeight: '700',
  },
  emptySubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 15,
    color: colors.brownMid,
    textAlign: 'center',
    fontWeight: '400',
  },

  // ── Bottom gradient ──
  bottomGradient: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    height: 350,
    zIndex: -1,
    pointerEvents: 'none',
  },
  bottomGradientImage: {
    resizeMode: 'stretch',
    minHeight: '100%',
  },
  emptyImageContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  emptyImage: {
    width: 200,
    height: 200,
  },
  // ── NavBar ──
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    width: 60,
  },
  navIconPlaceholder: {
    fontSize: 20,
    color: colors.brownMid,
    marginBottom: 2,
  },
  navLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brownMid,
    letterSpacing: 0.28,
  },
  navLabelActive: {
    color: colors.salmon,
  },
  navFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brownMid,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 6,
  },
  navFabIcon: {
    fontSize: 24,
    color: colors.white,
    lineHeight: 28,
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
});
