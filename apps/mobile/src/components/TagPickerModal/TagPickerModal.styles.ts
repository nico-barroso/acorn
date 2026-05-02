import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 27, 27, 0.45)',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    minHeight: '55%',
    maxHeight: '92%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: 'rgba(66, 36, 25, 0.1)',
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
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 22,
    color: colors.brown,
    marginBottom: 6,
  },
  subtitle: {
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
    fontSize: 13,
    color: colors.brownMid,
    textAlign: 'right',
  },
  saveButton: {
    marginTop: 14,
    backgroundColor: colors.salmon,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  createButton: {
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.32,
  },
  manageButton: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  manageLink: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.salmon,
    textDecorationLine: 'underline',
  },

  // Management section
  managementSection: {
    paddingBottom: 8,
    paddingVertical: 16,
    marginTop: 30,
  },
  divider: {
    height: 1,
    backgroundColor: `${colors.brown}18`,
    marginBottom: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: `${colors.brown}18`,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 16,
    color: colors.brown,
    marginBottom: 4,
  },
  managementTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 18,
    color: colors.brown,
    marginBottom: 12,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: `${colors.brown}30`,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.black,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorSwatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: colors.brown,
    transform: [{ scale: 1.15 }],
  },
  error: {
    marginTop: 8,
    color: '#8b2a1b',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
  tagCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.brown}18`,
    paddingHorizontal: 16,
    paddingVertical: 22,
    marginTop: 8,
    gap: 10,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagPillLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 13,
    color: colors.white,
  },
  tagActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  actionBtn: {
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 110,
  },
  actionBtnPrimary: {
    backgroundColor: colors.salmon,
  },
  actionBtnPrimaryLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.white,
  },
  actionBtnSecondary: {
    borderWidth: 1,
    borderColor: `${colors.brown}30`,
    backgroundColor: colors.white,
  },
  deleteLinkLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: '#9B2226',
    textDecorationLine: 'underline',
  },
  actionBtnSecondaryLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brown,
  },
});
