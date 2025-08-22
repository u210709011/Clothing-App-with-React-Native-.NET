import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import ProfileMenuItem from '@/components/molecules/ProfileMenuItem';
import { Colors } from '@/constants/Colors';

interface ProfileMenuProps {
  isSignedIn: boolean;
  onMenuItemPress: (item: string) => void;
  orderCount?: number;
  addressCount?: number;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isSignedIn,
  onMenuItemPress,
  orderCount = 0,
  addressCount = 0,
}) => {
  const accountMenuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      subtitle: 'Track your orders',
      iconName: 'receipt-long',
      badge: orderCount > 0 ? orderCount : undefined,
    },
    {
      id: 'addresses',
      title: 'Addresses',
      subtitle: 'Manage shipping addresses',
      iconName: 'place',
      badge: addressCount > 0 ? addressCount : undefined,
    },
    {
      id: 'profile-info',
      title: 'Profile Information',
      subtitle: 'Update your details',
      iconName: 'person',
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      subtitle: 'Manage cards and payment',
      iconName: 'payment',
    },
  ];

  const generalMenuItems = [
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your preferences',
      iconName: 'notifications',
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      iconName: 'help',
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'Terms, privacy & app info',
      iconName: 'info',
    },
  ];

  const authMenuItems = [
    {
      id: isSignedIn ? 'sign-out' : 'sign-in',
      title: isSignedIn ? 'Sign Out' : 'Sign In',
      subtitle: isSignedIn ? 'Log out of your account' : 'Access your account',
      iconName: isSignedIn ? 'logout' : 'login',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Account Section */}
      {isSignedIn && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {accountMenuItems.map((item) => (
            <ProfileMenuItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              iconName={item.iconName}
              onPress={() => onMenuItemPress(item.id)}
              badge={item.badge}
            />
          ))}
        </View>
      )}

      {/* General Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        {generalMenuItems.map((item) => (
          <ProfileMenuItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            iconName={item.iconName}
            onPress={() => onMenuItemPress(item.id)}
          />
        ))}
      </View>

      {/* Authentication SectionSign-In/Out */}
      <View style={styles.logoutContainer}>
        {authMenuItems.map((item) => (
          <ProfileMenuItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            iconName={item.iconName}
            onPress={() => onMenuItemPress(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
  },
  logoutContainer: {
  },
  sectionTitle: {
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: '600',
    color: Colors.tabIconSelected,
    backgroundColor: '#f8f9fa',
  },
});

export default ProfileMenu;
