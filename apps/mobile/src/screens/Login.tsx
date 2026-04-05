import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../components/Input/Input';
import { Button } from '../components/Button/Button';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    if (!email.includes('@')) {
      setEmailError('Introduce un correo electrónico válido');
      valid = false;
    } else {
      setEmailError('');
    }
    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleLogin = () => {
    if (validate()) {
      console.log('Login con:', email, password);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Input
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            placeholder="tu@email.com"
            keyboardType="email-address"
          />
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            placeholder="••••••••"
            secureTextEntry
          />
          <Button label="Iniciar sesión" onPress={handleLogin} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFCFB',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    justifyContent: 'center',
  },
});
