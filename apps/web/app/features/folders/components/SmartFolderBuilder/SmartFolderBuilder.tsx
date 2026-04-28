'use client'

import { useCallback, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { smartFolderBuilderStyles } from './SmartFolderBuilder.styles'

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
  onCreated: () => void
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

export function SmartFolderBuilder({ onClose, onCreated }: SmartFolderBuilderProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState<BuilderRule[]>([
    { id: crypto.randomUUID(), field: 'domain', operator: 'contains', value: '' }
  ])
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const addRule = useCallback(() => {
    setRules((prev) => [...prev, { id: crypto.randomUUID(), field: 'domain', operator: 'contains', value: '' }])
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
          if (updated.field === 'is_read') {
            updated.value = 'true'
          } else {
            updated.value = ''
          }
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

    const validRules = rules.filter((r) => {
      if (r.field === 'is_read') return true
      return r.value.trim().length > 0
    })

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
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

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

      const folderId = folderData.id

      const ruleInserts = validRules.map((rule, index) => ({
        folder_id: folderId,
        field: rule.field,
        operator: rule.operator,
        value: rule.field === 'is_read' ? rule.value : rule.value.trim(),
        position: index
      }))

      const { error: rulesError } = await supabase
        .from('smart_folder_rules')
        .insert(ruleInserts)

      if (rulesError) {
        await supabase.from('smart_folders').delete().eq('id', folderId)
        setErrorMessage('No se pudieron guardar las reglas')
        setIsSaving(false)
        return
      }

      onCreated()
    } catch {
      setErrorMessage('Ocurrio un error inesperado')
    } finally {
      setIsSaving(false)
    }
  }, [name, description, rules, onCreated])

  return (
    <div style={smartFolderBuilderStyles.overlay}>
      <div style={smartFolderBuilderStyles.modal}>
        <h2 style={smartFolderBuilderStyles.title}>Carpeta inteligente</h2>
        <p style={smartFolderBuilderStyles.subtitle}>
          Define reglas para filtrar recursos automaticamente. Los recursos que cumplan todas las reglas apareceran en esta carpeta.
        </p>

        <div style={smartFolderBuilderStyles.fieldGroup}>
          <label style={smartFolderBuilderStyles.label} htmlFor='sf-name'>Nombre *</label>
          <input
            id='sf-name'
            type='text'
            placeholder='Mi carpeta inteligente'
            value={name}
            onChange={(e) => { setName(e.target.value); setErrorMessage('') }}
            disabled={isSaving}
            style={smartFolderBuilderStyles.input}
          />

          <label style={smartFolderBuilderStyles.label} htmlFor='sf-desc'>Descripcion (opcional)</label>
          <textarea
            id='sf-desc'
            placeholder='Filtra recursos por dominio, etiquetas, titulo...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSaving}
            style={smartFolderBuilderStyles.textarea}
          />
        </div>

        <div style={smartFolderBuilderStyles.rulesSection}>
          <div style={smartFolderBuilderStyles.rulesHeader}>
            <h3 style={smartFolderBuilderStyles.rulesTitle}>Reglas</h3>
            <button
              type='button'
              onClick={addRule}
              disabled={isSaving}
              style={smartFolderBuilderStyles.addRuleButton}
            >
              + Regla
            </button>
          </div>
          <p style={smartFolderBuilderStyles.helpText}>
            Los recursos deben cumplir todas las reglas (logica AND).
          </p>

          {rules.map((rule) => {
            const operators = OPERATOR_OPTIONS[rule.field]
            const isReadField = rule.field === 'is_read'

            return (
              <div key={rule.id} style={smartFolderBuilderStyles.ruleRow}>
                <div style={smartFolderBuilderStyles.ruleField}>
                  <span style={smartFolderBuilderStyles.ruleLabel}>Campo</span>
                  <select
                    value={rule.field}
                    onChange={(e) => updateRule(rule.id, { field: e.target.value as RuleField })}
                    disabled={isSaving}
                    style={smartFolderBuilderStyles.select}
                  >
                    {FIELD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div style={smartFolderBuilderStyles.ruleField}>
                  <span style={smartFolderBuilderStyles.ruleLabel}>Operador</span>
                  <select
                    value={rule.operator}
                    onChange={(e) => updateRule(rule.id, { operator: e.target.value as RuleOperator })}
                    disabled={isSaving}
                    style={smartFolderBuilderStyles.select}
                  >
                    {operators.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div style={smartFolderBuilderStyles.ruleField}>
                  <span style={smartFolderBuilderStyles.ruleLabel}>Valor</span>
                  {isReadField ? (
                    <select
                      value={rule.value || 'true'}
                      onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                      disabled={isSaving}
                      style={smartFolderBuilderStyles.select}
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
                      style={smartFolderBuilderStyles.ruleInput}
                    />
                  )}
                </div>

                {rules.length > 1 ? (
                  <button
                    type='button'
                    onClick={() => removeRule(rule.id)}
                    disabled={isSaving}
                    style={smartFolderBuilderStyles.removeRuleButton}
                    aria-label='Eliminar regla'
                  >
                    x
                  </button>
                ) : (
                  <div style={{ width: '32px' }} />
                )}
              </div>
            )
          })}
        </div>

        {errorMessage ? (
          <p style={smartFolderBuilderStyles.errorText}>{errorMessage}</p>
        ) : null}

        <div style={smartFolderBuilderStyles.actionsRow}>
          <button
            type='button'
            onClick={onClose}
            style={smartFolderBuilderStyles.cancelButton}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type='button'
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            style={!name.trim() || isSaving ? smartFolderBuilderStyles.saveButtonDisabled : smartFolderBuilderStyles.saveButton}
          >
            {isSaving ? 'Creando...' : 'Crear carpeta'}
          </button>
        </div>
      </div>
    </div>
  )
}