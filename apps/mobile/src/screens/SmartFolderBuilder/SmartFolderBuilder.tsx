import React from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { supabase } from '../../../lib/supabase';
import { Button } from '../../components/Button/Button';
import { styles } from './SmartFolderBuilder.styles';

type RuleField = 'domain' | 'tag' | 'title' | 'is_read';
type RuleOperator = 'contains' | 'equals' | 'not_equals';

type BuilderRule = {
  id: string;
  field: RuleField;
  operator: RuleOperator;
  value: string;
};

type SmartFolderBuilderProps = {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const FIELD_OPTIONS: Array<{ key: RuleField; label: string }> = [
  { key: 'domain', label: 'Dominio' },
  { key: 'tag', label: 'Etiqueta' },
  { key: 'title', label: 'Titulo' },
  { key: 'is_read', label: 'Estado lectura' },
];

const OPERATOR_OPTIONS: Array<{ key: RuleOperator; label: string }> = [
  { key: 'contains', label: 'Contiene' },
  { key: 'equals', label: 'Es igual' },
  { key: 'not_equals', label: 'No es' },
];

function createRule(): BuilderRule {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    field: 'domain',
    operator: 'contains',
    value: '',
  };
}

function sanitizeRuleValue(field: RuleField, value: string) {
  const normalized = value.trim();

  if (field === 'is_read') {
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }

  return normalized;
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.chip, active ? styles.chipActive : null]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SmartFolderBuilder({ visible, onClose, onCreated }: SmartFolderBuilderProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [rules, setRules] = React.useState<BuilderRule[]>([createRule()]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!visible) {
      setName('');
      setDescription('');
      setRules([createRule()]);
      setSaving(false);
      setError('');
    }
  }, [visible]);

  const setRule = (ruleId: string, patch: Partial<BuilderRule>) => {
    setRules((current) => current.map((rule) => (rule.id === ruleId ? { ...rule, ...patch } : rule)));
  };

  const addRule = () => {
    setRules((current) => [...current, createRule()]);
  };

  const removeRule = (ruleId: string) => {
    setRules((current) => current.filter((rule) => rule.id !== ruleId));
  };

  const handleCreateFolder = async () => {
    const normalizedName = name.trim();

    if (!normalizedName) {
      setError('El nombre de la carpeta es obligatorio.');
      return;
    }

    if (rules.length === 0) {
      setError('Debes agregar al menos una regla.');
      return;
    }

    const invalidRule = rules.find((rule) => !rule.value.trim());
    if (invalidRule) {
      setError('Todas las reglas deben tener un valor.');
      return;
    }

    setSaving(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setError('Debes iniciar sesion para crear carpetas inteligentes.');
      return;
    }

    const { data: folderRow, error: insertFolderError } = await supabase
      .from('smart_folders')
      .insert({
        user_id: user.id,
        name: normalizedName,
        description: description.trim() || null,
        is_active: true,
      })
      .select('id')
      .single();

    if (insertFolderError || !folderRow) {
      setSaving(false);
      setError('No se pudo crear la carpeta inteligente.');
      return;
    }

    const rulesPayload = rules.map((rule, index) => ({
      folder_id: folderRow.id,
      field: rule.field,
      operator: rule.operator,
      value: sanitizeRuleValue(rule.field, rule.value),
      position: index,
    }));

    const { error: insertRulesError } = await supabase.from('smart_folder_rules').insert(rulesPayload);

    if (insertRulesError) {
      await supabase.from('smart_folders').delete().eq('id', folderRow.id).eq('user_id', user.id);
      setSaving(false);
      setError('No se pudieron guardar las reglas de la carpeta.');
      return;
    }

    setSaving(false);
    onCreated?.();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.panel}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Nueva carpeta inteligente</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.closeLabel}>Cerrar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>Define reglas visuales para clasificar recursos automaticamente.</Text>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                <Text style={styles.sectionLabel}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder='Ej: Lecturas de producto'
                  placeholderTextColor='#8B8179'
                  editable={!saving}
                />

                <Text style={styles.sectionLabel}>Descripcion</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder='Explica para que sirve esta carpeta...'
                  placeholderTextColor='#8B8179'
                  multiline
                  editable={!saving}
                />

                <Text style={styles.sectionLabel}>Reglas</Text>

                {rules.map((rule, index) => (
                  <View key={rule.id} style={styles.ruleCard}>
                    <View style={styles.ruleHeader}>
                      <Text style={styles.ruleTitle}>Regla {index + 1}</Text>
                      {rules.length > 1 ? (
                        <TouchableOpacity onPress={() => removeRule(rule.id)} activeOpacity={0.8}>
                          <Text style={styles.removeRuleText}>Eliminar</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>

                    <Text style={styles.sectionLabel}>Campo</Text>
                    <View style={styles.chipsWrap}>
                      {FIELD_OPTIONS.map((option) => (
                        <Chip
                          key={option.key}
                          label={option.label}
                          active={rule.field === option.key}
                          onPress={() => {
                            const operator = option.key === 'is_read' ? 'equals' : rule.operator;
                            const value = option.key === 'is_read' ? 'false' : rule.value;
                            setRule(rule.id, {
                              field: option.key,
                              operator,
                              value,
                            });
                          }}
                        />
                      ))}
                    </View>

                    <Text style={styles.sectionLabel}>Operador</Text>
                    <View style={styles.chipsWrap}>
                      {(rule.field === 'is_read'
                        ? OPERATOR_OPTIONS.filter((option) => option.key === 'equals' || option.key === 'not_equals')
                        : OPERATOR_OPTIONS
                      ).map((option) => (
                        <Chip
                          key={option.key}
                          label={option.label}
                          active={rule.operator === option.key}
                          onPress={() => setRule(rule.id, { operator: option.key })}
                        />
                      ))}
                    </View>

                    <Text style={styles.sectionLabel}>Valor</Text>
                    {rule.field === 'is_read' ? (
                      <View style={styles.chipsWrap}>
                        <Chip
                          label='No visto'
                          active={rule.value === 'false'}
                          onPress={() => setRule(rule.id, { value: 'false' })}
                        />
                        <Chip
                          label='Visto'
                          active={rule.value === 'true'}
                          onPress={() => setRule(rule.id, { value: 'true' })}
                        />
                      </View>
                    ) : (
                      <TextInput
                        style={styles.input}
                        value={rule.value}
                        onChangeText={(nextValue) => setRule(rule.id, { value: nextValue })}
                        placeholder='Valor de la regla'
                        placeholderTextColor='#8B8179'
                        editable={!saving}
                      />
                    )}
                  </View>
                ))}

                <View style={styles.actions}>
                  <Button label='Agregar regla' variant='secondary' onPress={addRule} disabled={saving} />
                  <Button
                    label={saving ? 'Creando carpeta...' : 'Crear carpeta inteligente'}
                    onPress={() => void handleCreateFolder()}
                    disabled={saving}
                  />
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
