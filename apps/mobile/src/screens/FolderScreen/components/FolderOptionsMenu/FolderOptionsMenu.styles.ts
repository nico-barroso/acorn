import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 6,
    minWidth: 180,
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0E4DE',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  optionIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  optionLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 15,
    color: colors.brown,
  },
  optionLabelDestructive: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 15,
    color: '#C0392B',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0E4DE',
    marginHorizontal: 12,
  },
});
