
import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ProductoProvider } from "./src/context/ProductoContext";

import ProductosScreen from "./src/screens/ProductosScreen";
import NuevoProductoScreen from "./src/screens/NuevoProductoScreen";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <ProductoProvider>

            <NavigationContainer>

                <Tab.Navigator
                    screenOptions={{
                        headerShown: false,

                        tabBarActiveTintColor: "#0F2747",
                        tabBarInactiveTintColor: "#94A3B8",

                        tabBarStyle: {
                            height: 72,
                            paddingBottom: 10,
                            paddingTop: 8,
                            backgroundColor: "#FFFFFF",
                            borderTopWidth: 1,
                            borderTopColor: "#DCE5EF"
                        },

                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: "700"
                        }
                    }}
                >

                    <Tab.Screen
                        name="Productos"
                        component={ProductosScreen}
                        options={{
                            tabBarLabel: "Productos",

                            tabBarIcon: ({ focused }) => (
                                <Text
                                    style={{
                                        fontSize: 24,
                                        opacity: focused ? 1 : 0.45
                                    }}
                                >
                                    📦
                                </Text>
                            )
                        }}
                    />

                    <Tab.Screen
                        name="NuevoProducto"
                        component={NuevoProductoScreen}
                        options={{
                            tabBarLabel: "Nuevo producto",

                            tabBarIcon: ({ focused }) => (
                                <Text
                                    style={{
                                        fontSize: 24,
                                        opacity: focused ? 1 : 0.45
                                    }}
                                >
                                    ➕
                                </Text>
                            )
                        }}
                    />

                </Tab.Navigator>

            </NavigationContainer>

        </ProductoProvider>
    );
}
