import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Dimensions } from 'react-native';
export const styles = StyleSheet.create({
  navbar: {
    position: 'relative',
    width: '100%',
    zIndex: 10,
    elevation: 10,
  },
  navbarBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  innerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 8,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    gap: 5,
    width: 60,
  },

  navLabel: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: 400,
    fontSize: 12,
    color: colors.brownMid,
    letterSpacing: 0.28,
  },
  navLabelActive: {
    color: colors.salmon,
  },
  activePill: {
    width: 16,
    height: 3,
    borderRadius: 99,
    backgroundColor: colors.salmon,
  },
  navFab: {
    width: 62,
    height: 62,
    borderRadius: 366,
    backgroundColor: colors.brownMid,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
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
});
