import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import CartIconWithBadge from "@/components/molecules/CartIconWithBadge";
import WishlistIconWithBadge from "@/components/molecules/WishlistIconWithBadge";
import { Text } from "@/components/atoms/Text";

import { Colors } from "@/constants/Colors";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function TabLayout() {
  const { isAdmin, checked } = useAdminRole();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        tabBarLabel: () => null,
        tabBarButton: (props) => {
          const viewRef = props.ref as React.Ref<View>;
          return (
            <View ref={viewRef} style={styles.tabBarItems}>
              <TouchableWithoutFeedback onPress={props.onPress}>
                <View>{props.children}</View>
              </TouchableWithoutFeedback>
            </View>
          );
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.tabIconSelected,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: "white",
        },
      }}
    >
      {/* TAB: Home */}
      <Tabs.Screen
        name="home/index"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons size={28} name="home" color={color} />
            </View>
          ),
        }}
      />

      {/* TAB: Wishlist */}
      <Tabs.Screen
        name="wishlist/index"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <WishlistIconWithBadge size={28} color={color} />
          ),
        }}
      />

      {/* TAB: Cart */}
      <Tabs.Screen
        name="cart/index"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <CartIconWithBadge size={28} color={color} />
          ),
        }}
      />

      {/* TAB: Profile */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="person" color={color} />
          ),
        }}
      />

      {/* TAB: Admin */}
      <Tabs.Screen
        name="admin/index"
        options={{
          title: "Admin",
          href: checked && isAdmin ? undefined : null,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              size={28}
              name="admin-panel-settings"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarItems: {
    paddingTop: 10,
    alignItems: "center",
  },
});
