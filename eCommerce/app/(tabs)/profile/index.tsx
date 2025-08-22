import React from "react";
import { ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import ProfileHeader from "@/components/molecules/ProfileHeader";
import ProfileMenu from "@/components/organisms/ProfileMenu";

import { useAuthContext } from "@/auth/providers/AuthProvider";
import { whoAmI, adminPing } from "@/services/admin";

export default function ProfileScreen() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();

  const handleMenuItemPress = async (item: string) => {
    switch (item) {
      case "orders":
        router.push("/profile/orders");
        break;
      case "addresses":
        router.push("/profile/addresses");
        break;
      case "profile-info":
        router.push("/profile/settings");
        break;
      case "payment":
        Alert.alert(
          "TODO",
          "will implement later"
        );
        break;
      case "notifications":
        Alert.alert(
          "TODO",
          "will implement later"
        );
        break;
      case "help":
        Alert.alert(
          "TODO",
          "will implement later"
        );
        break;
      case "about":
        Alert.alert(
          "TODO",
          "will implement later"
        );
        break;
      case "sign-in":
        router.push("/(auth)/sign-in");
        break;
      case "sign-out":
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign Out",
            style: "destructive",
            onPress: async () => {
              await signOut();
              router.replace("/(auth)/sign-in");
            },
          },
        ]);
        break;
      default:
        console.log("Unknown menu item:", item);
    }
  };

  return (
    <ThemedView style={{ flex: 1}}>
      <ScrollView style={{ flex: 1 }}>
        <ProfileHeader
          name={user?.displayName}
          email={user?.email}
          imageUrl={user?.photoURL}
          isGuest={!user}
        />
        <ProfileMenu
          isSignedIn={!!user}
          onMenuItemPress={handleMenuItemPress}
          orderCount={3} // TODO: Get from orders API
          addressCount={2} // TODO: Get from addresses API
        />
      </ScrollView>
    </ThemedView>
  );
}