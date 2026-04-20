import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';
import { fonts } from '@theme/fonts';

export const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingBottom: 30,
    gap: 15,
  },
  title: {
    fontFamily: fonts.family.title.bold,
    fontSize: fonts.size.lg,
    color: colors.brown,
  },
  subtitle: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.brownMid,
    marginTop: -6,
  },
});
