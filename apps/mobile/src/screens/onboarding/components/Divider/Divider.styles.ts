import { StyleSheet } from 'react-native';
import { fonts } from '@theme/fonts';
import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.brown,
    opacity: 0.2,
  },
  label: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.brown,
    opacity: 0.4,
  },
});
