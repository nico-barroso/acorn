import { colors } from "../../theme/colors";
import {  StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroInner: {
    flex: 1,
marginHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 18,
    justifyContent: 'flex-end',  // ← añade esto
  },
  // ── Hero ──
  heroContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    height: 360,  // ← fijo
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  // ── Header ──
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    aspectRatio: 3,
  },
  headerLogoText: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.8,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.salmon,
    opacity: 0.4,
  },

  // ── Saludo ──
  greetingSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  greetingSubtitle: {
    fontFamily: 'CabinetGrotesk-Regular',
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.32,
    marginBottom: 4,
    opacity: 0.8,
  },
  greetingTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 35,
    color: colors.white,
    lineHeight: 42,
    textAlign: 'center',
  },

  // ── Featured card ──
  featuredCard: {
    marginTop: 8,
  },

  // ── Sección ──
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
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
