import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { Text } from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import LoginForm from '@/components/molecules/LoginForm';
import AuthLayout from '@/components/templates/AuthLayout';


export default function SignInScreen() {
  const router = useRouter();

  return (
    <AuthLayout title="Welcome Back!" subtitle="Sign in to continue">
      <Stack.Screen options={{ title: "Sign In", headerBackVisible: true }} />
      <LoginForm />
      <ThemedView style={styles.detailsContainer}>
        <View style={styles.signupContainer}>
          <Text>Don't have an account? </Text>
          <Button
            title="Sign Up"
            type="link"
            onPress={() => router.push('/(auth)/sign-up')}
          />
        </View>
        <View style={styles.continueAsGuestContainer}>
          <Button
            style= {styles.continueAsGuestButton}
            title="Continue as guest"
            type="link"
            onPress={() => router.navigate('/(tabs)/home')}
          />
        </View>


      </ThemedView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  detailsContainer: {
    flexDirection: 'column'
  },

  continueAsGuestContainer: {
    justifyContent: 'center',
  },

  continueAsGuestButton: {
  }
});
