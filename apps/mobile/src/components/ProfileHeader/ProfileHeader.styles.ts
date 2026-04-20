import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    color: colors.brown,
    fontSize: 26,
    lineHeight: 28,
    fontFamily: fonts.family.primary.medium,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.brown,
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.title.bold,
  },
  rightPlaceholder: {
    width: 32,
    height: 32,
  },
});
