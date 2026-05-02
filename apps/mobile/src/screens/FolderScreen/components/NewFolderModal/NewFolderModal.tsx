import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavBarHeight } from '@/context/NavBarHeightContext';
import { useSession } from '@/context/SessionContext';
import { supabase } from '@mobile/lib/supabase';
import { styles } from './NewFolderModal.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

function slugifyName(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type RuleField = 'tag' | 'domain';
type MatchLogic = 'ALL' | 'ANY';

type Rule = {
  id: string;
  field: RuleField;
  value: string;
  expanded: boolean;
};

type NewFolderModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
};

let ruleCounter = 0;
function newRuleId() {
  ruleCounter += 1;
  return `r${ruleCounter}`;
}

export function NewFolderModal({ visible, onClose, onCreated }: NewFolderModalProps) {
  const insets = useSafeAreaInsets();
  const { height: navBarHeight } = useNavBarHeight();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [rules, setRules] = useState<Rule[]>([]);
  const [logic, setLogic] = useState<MatchLogic>('ALL');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const { session } = useSession();
  const user = session?.user;

  const loadOptions = useCallback(async () => {
    if (!user) return;

    const [tagsRes, domainsRes] = await Promise.all([
      supabase.from('tags').select('name').eq('user_id', user.id).order('name'),
      supabase.from('items_with_links').select('domain').eq('user_id', user.id),
    ]);

    setAvailableTags(
      ((tagsRes.data ?? []) as { name: string }[]).map((t) => t.name),
    );

    const uniqueDomains = [
      ...new Set(
        ((domainsRes.data ?? []) as { domain: string | null }[])
          .map((d) => d.domain)
          .filter((d): d is string => Boolean(d)),
      ),
    ].sort();
    setAvailableDomains(uniqueDomains);
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      void loadOptions();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      setName('');
      setDescription('');
      setError('');
      setLoading(false);
      setRules([]);
      setLogic('ALL');
    }
  }, [visible, loadOptions]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      { id: newRuleId(), field: 'tag', value: '', expanded: true },
    ]);
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleField = (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, field: r.field === 'tag' ? 'domain' : 'tag', value: '', expanded: true }
          : r,
      ),
    );
  };

  const toggleExpanded = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, expanded: !r.expanded } : r)),
    );
  };

  const selectValue = (id: string, value: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, value, expanded: false } : r)),
    );
  };

  const getOptions = (field: RuleField) =>
    field === 'tag' ? availableTags : availableDomains;

  const handleCreate = async () => {
    const trimmed = name.trim();
    const slug = slugifyName(trimmed);

    if (!trimmed || !slug) {
      setError('El nombre de la carpeta es obligatorio.');
      return;
    }

    setLoading(true);
    setError('');

    if (!user) {
      setError('Debes iniciar sesión para crear carpetas.');
      setLoading(false);
      return;
    }

    const trimmedDescription = description.trim();

    const { data: folder, error: insertError } = await supabase
      .from('smart_folders')
      .insert({
        name: trimmed,
        slug,
        user_id: user.id,
        is_active: true,
        logic,
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
      })
      .select('id')
      .single();

    if (insertError || !folder) {
      console.error(
        '[NewFolderModal] Error al crear carpeta:',
        JSON.stringify(insertError, null, 2),
      );
      setError('No se pudo crear la carpeta. Inténtalo de nuevo.');
      setLoading(false);
      return;
    }

    const validRules = rules.filter((r) => r.value.trim());
    if (validRules.length > 0) {
      const ruleRows = validRules.map((r, i) => ({
        folder_id: folder.id,
        field: r.field,
        operator: 'equals',
        value_type: 'text',
        value: r.value,
        position: i,
        order_index: i,
      }));
      const { error: rulesError } = await supabase
        .from('smart_folder_rules')
        .insert(ruleRows);
      if (rulesError) {
        console.error(
          '[NewFolderModal] Error al guardar reglas:',
          JSON.stringify(rulesError, null, 2),
        );
      }
    }

    setLoading(false);
    onCreated();
    handleClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.backdrop}>
      <TouchableOpacity style={styles.backdropPress} activeOpacity={1} onPress={handleClose} />
      <Animated.View
        style={[
          styles.sheet,
          {
            maxHeight: SCREEN_HEIGHT * 0.88,
            transform: [{ translateY }],
            paddingBottom:
              keyboardHeight > 0
                ? keyboardHeight + 16
                : insets.bottom + navBarHeight + 16,
          },
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Nueva carpeta</Text>
          <Text style={styles.subtitle}>Dale un nombre para identificarla fácilmente.</Text>

          <TextInput
            style={styles.input}
            placeholder="Ej. Tutoriales de diseño"
            placeholderTextColor="#8B8179"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError('');
            }}
            editable={!loading}
            autoFocus
          />

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Descripción (opcional)"
            placeholderTextColor="#8B8179"
            value={description}
            onChangeText={setDescription}
            editable={!loading}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Rules section */}
          <View style={styles.rulesSection}>
            <Text style={styles.rulesSectionTitle}>
              Mostrar items que contengan los siguientes recursos
            </Text>

            {rules.map((rule) => {
              const options = getOptions(rule.field);
              return (
                <View key={rule.id} style={styles.ruleWrapper}>
                  <View style={styles.ruleRow}>
                    <TouchableOpacity
                      style={styles.fieldPill}
                      onPress={() => toggleField(rule.id)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.fieldPillText}>
                        {rule.field === 'tag' ? 'Etiqueta' : 'Dominio'} ▾
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.valuePill, rule.value ? styles.valuePillActive : null]}
                      onPress={() => toggleExpanded(rule.id)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.valuePillText,
                          rule.value ? styles.valuePillTextActive : null,
                        ]}
                        numberOfLines={1}
                      >
                        {rule.value
                          ? rule.field === 'tag'
                            ? `#${rule.value}`
                            : rule.value
                          : 'Seleccionar...'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeRule}
                      onPress={() => removeRule(rule.id)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.removeRuleText}>×</Text>
                    </TouchableOpacity>
                  </View>

                  {rule.expanded && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.optionsContent}
                      keyboardShouldPersistTaps="handled"
                    >
                      {options.length === 0 ? (
                        <Text style={styles.noOptions}>
                          {rule.field === 'tag'
                            ? 'No tienes etiquetas guardadas.'
                            : 'No tienes dominios guardados.'}
                        </Text>
                      ) : (
                        options.map((opt) => (
                          <TouchableOpacity
                            key={opt}
                            style={[
                              styles.optionChip,
                              rule.value === opt && styles.optionChipSelected,
                            ]}
                            onPress={() => selectValue(rule.id, opt)}
                            activeOpacity={0.75}
                          >
                            <Text
                              style={[
                                styles.optionChipText,
                                rule.value === opt && styles.optionChipTextSelected,
                              ]}
                            >
                              {rule.field === 'tag' ? `#${opt}` : opt}
                            </Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  )}
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.addRuleBtn}
              onPress={addRule}
              activeOpacity={0.75}
            >
              <Text style={styles.addRuleBtnText}>+ Añadir regla</Text>
            </TouchableOpacity>

            {rules.length > 1 && (
              <View style={styles.logicRow}>
                <Text style={styles.logicLabel}>Coincide:</Text>
                <View style={styles.logicToggle}>
                  <TouchableOpacity
                    style={[styles.logicPill, logic === 'ALL' && styles.logicPillActive]}
                    onPress={() => setLogic('ALL')}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.logicPillText,
                        logic === 'ALL' && styles.logicPillTextActive,
                      ]}
                    >
                      Y (AND)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.logicPill, logic === 'ANY' && styles.logicPillActive]}
                    onPress={() => setLogic('ANY')}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.logicPillText,
                        logic === 'ANY' && styles.logicPillTextActive,
                      ]}
                    >
                      O (OR)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose} activeOpacity={0.7}>
            <Text style={styles.cancelLabel}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleCreate}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={styles.confirmLabel}>{loading ? 'Creando...' : 'Crear carpeta'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
