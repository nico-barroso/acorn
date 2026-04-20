import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 21,
    padding: 6,
    backgroundColor: 'rgba(249, 111, 93, 0.1)',
  },
  label: {
    fontSize: 15,
    color: colors.brownMid,
  },
  chevronWrapper: {
    marginLeft: 'auto',
    opacity: 0.4,
  },
});
