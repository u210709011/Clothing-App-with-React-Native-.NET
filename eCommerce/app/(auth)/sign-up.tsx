import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { Text } from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import SignupForm from '@/components/molecules/SignupForm';
import AuthLayout from '@/components/templates/AuthLayout';


export default function SignUpScreen() {
  const router = useRouter();

  return (
    <AuthLayout title="Create Account" subtitle="Get started with your new account">
      <Stack.Screen options={{ title: "Sign Up", headerBackVisible: true }} />
      <SignupForm />
      <ThemedView style={styles.signinContainer}>
        <Text>Already have an account? </Text>
        <Button
          title="Sign In"
          type="link"
          onPress={() => router.push('/(auth)/sign-in')}
        />
      </ThemedView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  signinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
