import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

import { Colors } from '@/constants/Colors';

import { useAuthContext } from '@/auth/providers/AuthProvider';

const LoginForm = () => {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  
  const { signIn, loading } = useAuthContext();

  const handleLogin = async () => {
    const result = await signIn(email, password);
    if (result?.success) {
      router.navigate('/(tabs)/home');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleLogin} disabled={loading} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
});

export default LoginForm;
