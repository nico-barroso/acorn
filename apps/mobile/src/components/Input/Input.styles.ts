import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  // Label
  label: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.brownMid,
    letterSpacing: 0.32,
    lineHeight: 20,
  },

  // Campo
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.brownMid,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    opacity: 0.9,
  },
  inputWrapperFocused: {
    borderColor: colors.salmon,
    opacity: 1,
  },
  inputWrapperError: {
    borderColor: '#F96F5D',
    opacity: 1,
  },
  input: {
    flex: 1,
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.lg,
    color: colors.brown,
    letterSpacing: 0.18,
    lineHeight: 24,
    padding: 0,
  },
  inputError: {
    color: 'rgba(249, 111, 93, 0.9)',
  },

  // Icono clear
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
  clearIcon: {
    fontSize: fonts.size.xl,
    color: colors.brownMid,
  },
  // Show Password Icon
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Mensaje de error
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontFamily: fonts.family.primary.regular,
    fontSize: 16,
    color: '#F96F5D',
    letterSpacing: 0.32,
    lineHeight: 20,
  },

  //SVG Icon Props
  leftIcon: {
    marginLeft: 6,
    marginRight: -4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWithIcon: {
    paddingLeft: 15,
  },
});
