import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

export const editProfileStyles = {
  page: {
    minHeight: '100%',
    width: '100%',
    maxWidth: '560px',
    margin: '0 auto',
    padding: 'clamp(10px, 2vw, 18px)'
  },
  header: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '28px'
  },
  backLink: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  } as React.CSSProperties,
  title: {
    margin: 0,
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold
  },
  subtitle: {
    margin: '4px 0 24px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  },
  avatarSection: {
    display: 'grid',
    placeItems: 'center',
    gap: '12px',
    marginBottom: '28px'
  },
  avatarWrapper: {
    position: 'relative' as const,
    width: '120px',
    height: '120px'
  },
  avatarCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '999px',
    backgroundColor: `${colors.salmon}16`,
    border: `3px solid ${colors.salmon}44`,
    display: 'grid',
    placeItems: 'center',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '36px',
    fontWeight: fonts.weight.bold,
    overflow: 'hidden',
    margin: 0
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  avatarOverlay: {
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '999px',
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    opacity: 0
  },
  avatarOverlayHover: {
    opacity: 1
  },
  avatarOverlayLabel: {
    color: '#fff',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    textAlign: 'center' as const,
    lineHeight: fonts.lineHeight.tight
  },
  changePhotoButton: {
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    textDecoration: 'underline'
  } as React.CSSProperties,
  removePhotoButton: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.regular,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 8px'
  } as React.CSSProperties,
  formSection: {
    display: 'grid',
    gap: '18px',
    marginBottom: '28px'
  },
  fieldGroup: {
    display: 'grid',
    gap: '6px'
  },
  label: {
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold
  },
  input: {
    width: '100%',
    minHeight: '42px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: '#fff',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    outline: 'none'
  } as React.CSSProperties,
  inputDisabled: {
    backgroundColor: '#f5f0eb',
    color: colors.brownMid,
    cursor: 'not-allowed'
  },
  actionsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  cancelButton: {
    padding: '12px',
    borderRadius: '12px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: '#fff',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  } as React.CSSProperties,
  saveButton: {
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: '#fff',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer',
    transition: 'opacity 0.15s ease'
  } as React.CSSProperties,
  saveButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  message: {
    margin: '8px 0 0',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    textAlign: 'center' as const
  },
  errorText: {
    color: '#8b2a1b'
  },
  successText: {
    color: '#2e7d32'
  },
  loading: {
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    textAlign: 'center' as const,
    padding: '40px'
  }
}