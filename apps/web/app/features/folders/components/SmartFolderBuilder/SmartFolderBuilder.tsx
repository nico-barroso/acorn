'use client'

import { useCallback, useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { smartFolderBuilderStyles } from './SmartFolderBuilder.styles'
import { AcornLoader } from '@/features/shared/components/AcornLoader/AcornLoader'

type RuleField = 'domain' | 'tag' | 'title' | 'is_read'
type RuleOperator = 'contains' | 'equals' | 'not_equals'

type BuilderRule = {
  id: string
  field: RuleField
  operator: RuleOperator
  value: string
}

type SmartFolderBuilderProps = {
  onClose: () => void
  onSaved: () => void
  editingFolder?: {
    id: string
    name: string
    description: string | null
  }
}

const FIELD_OPTIONS: { value: RuleField; label: string }[] = [
  { value: 'domain', label: 'Dominio' },
  { value: 'tag', label: 'Etiqueta' },
  { value: 'title', label: 'Titulo' },
  { value: 'is_read', label: 'Estado de lectura' }
]

const OPERATOR_OPTIONS: Record<RuleField, { value: RuleOperator; label: string }[]> = {
  domain: [
    { value: 'contains', label: 'contiene' },
    { value: 'equals', label: 'es igual a' },
    { value: 'not_equals', label: 'no es igual a' }
  ],
  tag: [
    { value: 'contains', label: 'contiene' },
    { value: 'equals', label: 'es igual a' }
  ],
  title: [
    { value: 'contains', label: 'contiene' },
    { value: 'equals', label: 'es igual a' }
  ],
  is_read: [
    { value: 'equals', label: 'es igual a' }
  ]
}

const VALUE_HINTS: Record<RuleField, string> = {
  domain: 'ej: github.com',
  tag: 'ej: javascript',
  title: 'ej: React hooks',
  is_read: ''
}

const IS_READ_OPTIONS = [
  { value: 'true', label: 'Leido' },
  { value: 'false', label: 'No leido' }
]

const DEFAULT_RULE = (): BuilderRule => ({
  id: crypto.randomUUID(),
  field: 'domain',
  operator: 'contains',
  value: ''
})

export function SmartFolderBuilder({ onClose, onSaved, editingFolder }: SmartFolderBuilderProps) {
  const isEditing = !!editingFolder

  const [name, setName] = useState(editingFolder?.name ?? '')
  const [description, setDescription] = useState(editingFolder?.description ?? '')
  const [rules, setRules] = useState<BuilderRule[]>([DEFAULT_RULE()])
  const [loadingRules, setLoadingRules] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isEditing) return

    async function loadRules() {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase
        .from('smart_folder_rules')
        .select('id, field, operator, value')
        .eq('folder_id', editingFolder!.id)
        .order('position', { ascending: true })

      if (data && data.length > 0) {
        setRules(
          data.map((r) => ({
            id: crypto.randomUUID(),
            field: r.field as RuleField,
            operator: r.operator as RuleOperator,
            value: r.value ?? ''
          }))
        )
      }
      setLoadingRules(false)
    }

    loadRules()
  }, [isEditing, editingFolder])

  const addRule = useCallback(() => {
    setRules((prev) => [...prev, DEFAULT_RULE()])
  }, [])

  const removeRule = useCallback((ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId))
  }, [])

  const updateRule = useCallback((ruleId: string, updates: Partial<BuilderRule>) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r
        const updated = { ...r, ...updates }
        if (updates.field && updates.field !== r.field) {
          const ops = OPERATOR_OPTIONS[updates.field]
          if (!ops.find((o) => o.value === updated.operator)) {
            updated.operator = ops[0].value
          }
          updated.value = updates.field === 'is_read' ? 'true' : ''
        }
        return updated
      })
    )
  }, [])

  const handleSave = useCallback(async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setErrorMessage('El nombre es obligatorio')
      return
    }

    const validRules = rules.filter((r) => r.field === 'is_read' || r.value.trim().length > 0)
    if (validRules.length === 0) {
      setErrorMessage('Agrega al menos una regla con valor')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        setErrorMessage('No se pudo verificar tu sesion')
        setIsSaving(false)
        return
      }

      const slug = trimmedName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      const ruleInserts = validRules.map((rule, index) => ({
        field: rule.field,
        operator: rule.operator,
        value: rule.field === 'is_read' ? rule.value : rule.value.trim(),
        position: index
      }))

      if (isEditing) {
        const folderId = editingFolder!.id

        const { error: updateError } = await supabase
          .from('smart_folders')
          .update({ name: trimmedName, slug, description: description.trim() || null })
          .eq('id', folderId)

        if (updateError) {
          setErrorMessage('No se pudo actualizar la carpeta')
          setIsSaving(false)
          return
        }

        const { error: deleteError } = await supabase
          .from('smart_folder_rules')
          .delete()
          .eq('folder_id', folderId)

        if (deleteError) {
          setErrorMessage('No se pudieron actualizar las reglas')
          setIsSaving(false)
          return
        }

        const { error: rulesError } = await supabase
          .from('smart_folder_rules')
          .insert(ruleInserts.map((r) => ({ ...r, folder_id: folderId })))

        if (rulesError) {
          setErrorMessage('No se pudieron guardar las reglas')
          setIsSaving(false)
          return
        }
      } else {
        const { data: folderData, error: folderError } = await supabase
          .from('smart_folders')
          .insert({
            name: trimmedName,
            slug,
            description: description.trim() || null,
            user_id: user.id,
            is_active: true
          })
          .select('id')
          .single()

        if (folderError || !folderData) {
          setErrorMessage('No se pudo crear la carpeta inteligente')
          setIsSaving(false)
          return
        }

        const { error: rulesError } = await supabase
          .from('smart_folder_rules')
          .insert(ruleInserts.map((r) => ({ ...r, folder_id: folderData.id })))

        if (rulesError) {
          await supabase.from('smart_folders').delete().eq('id', folderData.id)
          setErrorMessage('No se pudieron guardar las reglas')
          setIsSaving(false)
          return
        }
      }

      onSaved()
    } catch {
      setErrorMessage('Ocurrio un error inesperado')
    } finally {
      setIsSaving(false)
    }
  }, [name, description, rules, isEditing, editingFolder, onSaved])

  const s = smartFolderBuilderStyles

  return (
    <div style={s.overlay}>
      <div style={s.modal}>

        {/* ── Cabecera editorial ── */}
        <div style={s.modalHeader}>
          {/* Marca de agua: la bellota de Acorn */}
          <div style={s.headerWatermark} aria-hidden>
            <svg width="120" height="120" viewBox="0 0 26 28" fill="none">
              <path d="M3.56348 13.1575C3.56348 10.4325 5.77253 8.22344 8.49753 8.22344H12.8834H17.2692C19.9942 8.22344 22.2032 10.4325 22.2032 13.1575V19.325C22.2032 20.8963 21.4548 22.3737 20.188 23.3032L17.8885 24.9903L15.1831 27.1959C14.2313 27.9718 12.8796 28.02 11.8749 27.314L8.5686 24.9903L5.86001 23.2771C4.43024 22.3728 3.56348 20.799 3.56348 19.1072L3.56348 13.1575Z" fill="#A14D36"/>
              <path d="M12.6816 9.06523C12.472 9.48612 11.8646 9.46523 11.6844 9.03093L10.6343 6.4994C10.5808 6.37025 10.5078 6.25006 10.4178 6.143L9.04289 4.50618C8.40213 3.74337 8.76347 2.57344 9.72279 2.30483L15.5223 0.680968C16.2889 0.466308 16.8828 1.35755 16.3895 1.98241L15.9867 2.49263C15.9282 2.56668 15.8775 2.64656 15.8355 2.73101L12.6816 9.06523Z" fill="#A14D36"/>
              <path d="M1.24612e-06 11.1814C1.24612e-06 9.54775 1.32431 8.22344 2.95793 8.22344H22.5347C24.1683 8.22344 25.4926 9.54775 25.4926 11.1814C25.4926 13.3635 23.2106 14.7944 21.2463 13.844L15.7134 11.1668C13.8393 10.2599 11.6533 10.2599 9.77921 11.1668L4.24629 13.844C2.28204 14.7944 1.24612e-06 13.3635 1.24612e-06 11.1814Z" fill="#43281C"/>
            </svg>
          </div>

          <div style={s.eyebrow}>
            <span style={s.eyebrowDot} />
            {isEditing ? 'Editando carpeta' : 'Carpeta inteligente'}
          </div>
          <h2 style={s.title}>
            {isEditing ? editingFolder!.name : 'Nueva carpeta'}
          </h2>
        </div>

        {/* ── Cuerpo ── */}
        <div style={s.body}>

          <div style={s.fieldGroup}>
            <div style={s.field}>
              <label style={s.label} htmlFor='sf-name'>Nombre</label>
              <input
                id='sf-name'
                type='text'
                placeholder='Mi carpeta inteligente'
                value={name}
                onChange={(e) => { setName(e.target.value); setErrorMessage('') }}
                disabled={isSaving}
                style={s.input}
              />
            </div>

            <div style={s.field}>
              <label style={s.label} htmlFor='sf-desc'>
                Descripción{' '}
                <span style={{ opacity: 0.45, fontWeight: 400 }}>(opcional)</span>
              </label>
              <textarea
                id='sf-desc'
                placeholder='Recursos de diseño, artículos técnicos...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
                style={s.textarea}
              />
            </div>
          </div>

          {/* ── Reglas ── */}
          <div style={s.rulesSection}>
            <div style={s.rulesHeader}>
              <div style={s.rulesTitleGroup}>
                <span style={s.rulesTitle}>Reglas de filtrado</span>
                <div style={s.rulesDivider} />
              </div>
              <button
                type='button'
                onClick={addRule}
                disabled={isSaving || loadingRules}
                style={s.addRuleButton}
              >
                + añadir
              </button>
            </div>
            <p style={s.helpText}>
              Se muestran recursos que cumplan todas las condiciones.
            </p>

            {loadingRules ? (
              <AcornLoader label='Cargando reglas' size={36} />
            ) : rules.map((rule, index) => {
              const operators = OPERATOR_OPTIONS[rule.field]
              const isReadField = rule.field === 'is_read'

              return (
                <div key={rule.id} style={s.ruleRow}>
                  <span style={s.ruleNumber}>{index + 1}</span>

                  <div style={s.ruleField}>
                    <span style={s.ruleLabel}>campo</span>
                    <select
                      value={rule.field}
                      onChange={(e) => updateRule(rule.id, { field: e.target.value as RuleField })}
                      disabled={isSaving}
                      style={s.select}
                    >
                      {FIELD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={s.ruleField}>
                    <span style={s.ruleLabel}>condición</span>
                    <select
                      value={rule.operator}
                      onChange={(e) => updateRule(rule.id, { operator: e.target.value as RuleOperator })}
                      disabled={isSaving}
                      style={s.select}
                    >
                      {operators.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={s.ruleField}>
                    <span style={s.ruleLabel}>valor</span>
                    {isReadField ? (
                      <select
                        value={rule.value || 'true'}
                        onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                        disabled={isSaving}
                        style={s.select}
                      >
                        {IS_READ_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type='text'
                        placeholder={VALUE_HINTS[rule.field]}
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                        disabled={isSaving}
                        style={s.ruleInput}
                      />
                    )}
                  </div>

                  {rules.length > 1 ? (
                    <button
                      type='button'
                      onClick={() => removeRule(rule.id)}
                      disabled={isSaving}
                      style={s.removeRuleButton}
                      aria-label='Eliminar regla'
                    >
                      ×
                    </button>
                  ) : (
                    <div style={{ width: '28px' }} />
                  )}
                </div>
              )
            })}
          </div>

          {errorMessage ? (
            <p style={s.errorText}>{errorMessage}</p>
          ) : null}

          <div style={s.actionsRow}>
            <button type='button' onClick={onClose} style={s.cancelButton} disabled={isSaving}>
              Cancelar
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={isSaving || !name.trim() || loadingRules}
              style={!name.trim() || isSaving || loadingRules ? s.saveButtonDisabled : s.saveButton}
            >
              {isSaving
                ? (isEditing ? 'Guardando...' : 'Creando...')
                : (isEditing ? 'Guardar cambios →' : 'Crear carpeta →')}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
