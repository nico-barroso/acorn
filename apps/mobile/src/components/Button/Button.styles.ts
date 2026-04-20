import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.salmon,
    borderRadius: 6,
    paddingVertical: 17,
    paddingHorizontal: 12,
    gap: 8,
  },
  buttonLabel: {
    fontFamily: fonts.family.primary.medium,
    fontSize: fonts.size.md,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  buttonIcon: {
    width: 10,
    height: 10,
  },

  // Variantes
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.salmon,
  },
  buttonSecondaryLabel: {
    color: colors.salmon,
  },
});
