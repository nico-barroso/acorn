import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { fonts } from '@theme/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(66,36,25,0.1)',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  handle: {
    width: 81,
    height: 5,
    borderRadius: 100,
    backgroundColor: colors.brownMid,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.family.title.bold,
    fontSize: fonts.size.xl,
    color: colors.brown,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.lg,
    color: colors.brown,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.16,
    marginBottom: 40,
    width: 258,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.brownMid,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelLabel: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.lg,
    color: colors.brown,
    letterSpacing: 0.32,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.salmon,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmButtonDanger: {
    backgroundColor: colors.salmon,
  },
  confirmLabel: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.lg,
    color: colors.white,
    letterSpacing: 0.32,
  },
});
