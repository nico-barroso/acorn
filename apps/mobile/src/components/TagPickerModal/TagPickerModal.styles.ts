import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 27, 27, 0.45)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 22,
    color: colors.brown,
  },
  closeLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    color: colors.salmon,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brownMid,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: `${colors.brown}30`,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.white,
  },
  chipDisabled: {
    opacity: 0.35,
  },
  chipLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brown,
  },
  chipLabelSelected: {
    color: colors.white,
    fontFamily: 'Satoshi-Bold',
  },
  counter: {
    marginTop: 12,
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brownMid,
    textAlign: 'right',
  },
  saveButton: {
    marginTop: 14,
    backgroundColor: colors.salmon,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 15,
    color: colors.white,
  },
  manageButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  manageLink: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.salmon,
    textDecorationLine: 'underline',
  },
});
