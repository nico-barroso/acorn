import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.brownMid,
    opacity: 0.3,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 22,
    color: colors.brown,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brownMid,
    marginBottom: 20,
  },
  input: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: colors.brown,
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E8D8CF',
    marginBottom: 8,
  },
  error: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: '#8b2a1b',
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.brownMid,
    alignItems: 'center',
  },
  cancelLabel: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 15,
    color: colors.brownMid,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.salmon,
    alignItems: 'center',
  },
  confirmLabel: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 15,
    color: colors.white,
    fontWeight: '700',
  },

  // Rules section
  rulesSection: {
    marginTop: 20,
  },
  rulesSectionTitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
    marginBottom: 12,
    opacity: 0.8,
  },
  ruleWrapper: {
    marginBottom: 8,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldPill: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#E8D8CF',
  },
  fieldPillText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brown,
  },
  valuePill: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#E8D8CF',
  },
  valuePillActive: {
    backgroundColor: '#FFF0EB',
    borderColor: colors.salmon,
  },
  valuePillText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: '#8B8179',
  },
  valuePillTextActive: {
    color: colors.brown,
  },
  removeRule: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5EDEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeRuleText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 18,
    color: colors.brownMid,
    lineHeight: 20,
  },
  optionsContent: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#E8D8CF',
  },
  optionChipSelected: {
    backgroundColor: colors.salmon,
    borderColor: colors.salmon,
  },
  optionChipText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  optionChipTextSelected: {
    color: colors.white,
  },
  noOptions: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: '#8B8179',
    paddingVertical: 8,
  },
  addRuleBtn: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E8D8CF',
    alignItems: 'center',
  },
  addRuleBtnText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.salmon,
  },
  logicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  logicLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brownMid,
  },
  logicToggle: {
    flexDirection: 'row',
    gap: 6,
  },
  logicPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8D8CF',
    backgroundColor: '#FFF8F5',
  },
  logicPillActive: {
    backgroundColor: colors.brown,
    borderColor: colors.brown,
  },
  logicPillText: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 13,
    color: colors.brownMid,
    fontWeight: '700',
  },
  logicPillTextActive: {
    color: colors.white,
  },
});
