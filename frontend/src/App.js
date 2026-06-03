import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import RegistryScreen from "./screens/RegistryScreen";
import CollectionScreen from "./screens/CollectionScreen";
import MatchesScreen from "./screens/MatchesScreen";
import MatchDetailScreen from "./screens/MatchDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegistryScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1e293b",
          borderTopColor: "#334155",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{ tabBarLabel: "Colección", tabBarIcon: ({ color }) => <TabIcon emoji="🃏" color={color} /> }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{ tabBarLabel: "Matches", tabBarIcon: ({ color }) => <TabIcon emoji="🤝" color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Perfil", tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ emoji, color }) {
  const { Text } = require("react-native");
  return <Text style={{ fontSize: 20, opacity: color === "#3b82f6" ? 1 : 0.5 }}>{emoji}</Text>;
}

function AppNav() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#3b82f6" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <AppNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
