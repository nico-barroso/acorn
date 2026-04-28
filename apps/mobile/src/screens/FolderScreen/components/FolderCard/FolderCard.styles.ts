import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFCFB',
    borderRadius: 25,
    paddingLeft: 22,
    paddingRight: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 106,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  folderIcon: {
    width: 50,
    height: 37,
  },
  textBlock: {
    flex: 1,
    justifyContent: 'space-between',
    height: 41,
  },
  name: {
    fontFamily: 'CabinetGrotesk-Medium',
    fontSize: 16,
    color: colors.brown,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brown,
    letterSpacing: -0.12,
    lineHeight: 18,
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuIcon: {
    fontSize: 20,
    color: colors.brownMid,
    lineHeight: 24,
  },
});
