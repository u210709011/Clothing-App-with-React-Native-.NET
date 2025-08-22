import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Image } from '@/components/atoms/Image';
import { Colors } from '@/constants/Colors';

interface ProfileAvatarProps {
  imageUrl?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large';
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  imageUrl, 
  name, 
  size = 'medium' 
}) => {
  const avatarSize = size === 'small' ? 40 : size === 'large' ? 80 : 60;
  const fontSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

  const getInitials = (fullName?: string) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <View style={[styles.container, { width: avatarSize, height: avatarSize }]}>
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={[styles.image, { width: avatarSize, height: avatarSize }]}
        />
      ) : (
        <View style={[styles.placeholder, { width: avatarSize, height: avatarSize }]}>
          <Text style={[styles.initials, { fontSize }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 50,
  },
  placeholder: {
    backgroundColor: Colors.tabIconSelected,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  initials: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileAvatar;
