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

  successText: {
    color: '#2f6a3b',
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
  },
  errorText: {
    color: '#8b2a1b',
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
  },
  link: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
