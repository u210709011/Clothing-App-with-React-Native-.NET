import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Clothing Store",
  slug: "clothing-store",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/expo-icon.jpg",
  scheme: "clothing-store",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: "2793141b-cb9f-4cd8-9935-e3e340fca1be",
    },
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icons/expo-icon.jpg",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.duyubox.clothingStore",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
