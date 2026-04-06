import { StyleSheet } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 14,
  },
  title: {
    fontFamily: fonts.family.heading,
    fontSize: fonts.size.xl,
    color: colors.brown,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    color: colors.brownMid,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: fonts.family.primary,
    color: '#8b2a1b',
    fontSize: fonts.size.sm,
  },
  helperText: {
    textAlign: 'center',
    fontFamily: fonts.family.primary,
    color: colors.brownMid,
    fontSize: fonts.size.sm,
    marginTop: 6,
  },
  link: {
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    textAlign: 'center',
  },
});
