import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <ThemedView style={styles.container}>
        <Text type="title">This screen does not exist.</Text>
        <Link href="/(tabs)/home" style={styles.link}>
          <Text type="link">Go to home screen</Text>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
