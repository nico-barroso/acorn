import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';
import { fonts } from '@theme/fonts';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    width: '100%',
    gap: 25,
  },
  errorText: {
    fontFamily: fonts.family.primary.regular,
    color: '#8b2a1b',
    fontSize: fonts.size.sm,
  },
  helperText: {
    textAlign: 'center',
    fontFamily: fonts.family.primary.regular,
    color: colors.brownMid,
    fontSize: fonts.size.sm,
    marginTop: 6,
  },
  link: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
