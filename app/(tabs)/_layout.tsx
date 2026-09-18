import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
     tabBarActiveTintColor: '#FF3B30' 
     }}

    screenListeners={{
        tabPress: () => {
          // Trigger a clean, professional haptic vibration globally on any tab press
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
     >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: "Lessons",
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Quiz",
          tabBarIcon: ({ color }) => <Ionicons name="help-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}