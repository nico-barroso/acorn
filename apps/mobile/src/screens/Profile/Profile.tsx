import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { User } from '@supabase/supabase-js';

import { supabase } from '../../../lib/supabase';
import { Button } from '../../components/Button/Button';
import { styles } from './Profile.styles';

type ProfileProps = {
  visible: boolean;
  onClose: () => void;
};

function formatDate(isoDate: string | undefined) {
  if (!isoDate) {
    return 'No disponible';
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'No disponible';
  }

  return date.toLocaleString();
}

function buildDisplayName(user: User) {
  const fullName = user.user_metadata?.full_name;
  if (typeof fullName === 'string' && fullName.trim()) {
    return fullName.trim();
  }

  if (user.email) {
    return user.email;
  }

  return 'Usuario';
}

export function Profile({ visible, onClose }: ProfileProps) {
  const [loading, setLoading] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const [error, setError] = React.useState('');
  const [account, setAccount] = React.useState<{
    name: string;
    email: string;
    userId: string;
    createdAt: string;
    lastSignInAt: string;
  } | null>(null);

  const loadProfile = React.useCallback(async () => {
    if (!visible) {
      return;
    }

    setLoading(true);
    setError('');

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    setLoading(false);

    if (userError || !user) {
      setError('No se pudieron cargar los datos de tu cuenta.');
      return;
    }

    setAccount({
      name: buildDisplayName(user),
      email: user.email ?? 'No disponible',
      userId: user.id,
      createdAt: formatDate(user.created_at),
      lastSignInAt: formatDate(user.last_sign_in_at),
    });
  }, [visible]);

  React.useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  React.useEffect(() => {
    if (!visible) {
      setLoading(false);
      setSigningOut(false);
      setError('');
      setAccount(null);
    }
  }, [visible]);

  const handleSignOut = async () => {
    setSigningOut(true);
    setError('');

    const { error: signOutError } = await supabase.auth.signOut();

    setSigningOut(false);

    if (signOutError) {
      setError('No se pudo cerrar sesion. Intentalo de nuevo.');
      return;
    }

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.panel}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Perfil</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.closeLabel}>Cerrar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>Datos basicos de tu cuenta y control de sesion.</Text>

              {loading ? (
                <ActivityIndicator />
              ) : (
                <View style={styles.card}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Nombre</Text>
                    <Text style={styles.value}>{account?.name ?? 'No disponible'}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{account?.email ?? 'No disponible'}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>ID de usuario</Text>
                    <Text style={styles.value}>{account?.userId ?? 'No disponible'}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Fecha de alta</Text>
                    <Text style={styles.value}>{account?.createdAt ?? 'No disponible'}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Ultimo acceso</Text>
                    <Text style={styles.value}>{account?.lastSignInAt ?? 'No disponible'}</Text>
                  </View>
                </View>
              )}

              <View style={styles.actions}>
                <Button
                  label={signingOut ? 'Cerrando sesion...' : 'Cerrar sesion'}
                  variant='secondary'
                  onPress={() => void handleSignOut()}
                  disabled={loading || signingOut}
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
