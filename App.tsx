import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Admin from "./src/screens/Admin";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#2196F3" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Minhas Consultas" }}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{ title: "Painel Administrativo" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}