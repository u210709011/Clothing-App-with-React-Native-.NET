import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

type Props = {
  email?: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSignedIn: boolean;
};

const UserProfile: React.FC<Props> = ({ email, onSignIn, onSignOut, isSignedIn }) => {
  return (
    <View style={styles.container}>
      {isSignedIn ? (
        <>
          <Text type="title">Welcome!</Text>
          {!!email && <Text style={styles.email}>{email}</Text>}
          <Button title="Sign Out" onPress={onSignOut} style={styles.button} />
        </>
      ) : (
        <>
          <Text type="title">You are not signed in.</Text>
          <Button title="Sign In" onPress={onSignIn} style={styles.button} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  email: {
    marginVertical: 20,
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    minWidth: 200,
  },
});

export default UserProfile;


