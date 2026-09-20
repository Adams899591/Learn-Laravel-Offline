import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from "react-native-safe-area-context";

// The four learning pillars (same content as before, now data-driven)
const PILLARS = [
  {
    icon: 'cube-outline',
    color: '#3B82F6',
    bg: 'bg-blue-50',
    title: 'MVC Architecture',
    text: 'Understand how to separate your application logic using Models, Views (Blade templates), and Controllers for clean, maintainable code.',
  },
  {
    icon: 'server-outline',
    color: '#8B5CF6',
    bg: 'bg-purple-50',
    title: 'Database Mastery',
    text: 'Design databases effortlessly with Migrations and interact with your data using the powerful, expressive Eloquent ORM.',
  },
  {
    icon: 'shield-checkmark-outline',
    color: '#10B981',
    bg: 'bg-green-50',
    title: 'Robust Security',
    text: 'Implement secure user authentication, role-based authorization, and protect your apps against common vulnerabilities like CSRF and XSS.',
  },
  {
    icon: 'globe-outline',
    color: '#F97316',
    bg: 'bg-orange-50',
    title: 'Modern APIs',
    text: 'Build scalable RESTful APIs, manage background jobs, handle file storage, and master advanced Laravel ecosystems.',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />

      {/* --- FIXED HERO (sits on top, content scrolls underneath it) --- */}
      <View
        className="bg-[#FF3B30] rounded-b-[40px]"
        style={{
          zIndex: 10,
          elevation: 10, // makes zIndex work on Android
          shadowColor: '#7F1D1D',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 14,
        }}
      >
        <SafeAreaView>
          <View style={{ paddingTop: insets.top + 4 }} className="items-center px-6 pt-4 pb-8">
            <View className="bg-white p-3 rounded-full shadow-md mb-3">
              <Image
                source={require('../../assets/images/icon.png')} // Ensure this matches your project path
                className="w-12 h-12"
                resizeMode="contain"
              />
            </View>
            <Text className="text-white text-2xl font-extrabold tracking-wide text-center">
              Welcome Artisan
            </Text>
            <Text className="text-red-100 text-xs font-medium mt-1.5 text-center px-4 leading-relaxed">
              Your comprehensive, offline guide to mastering PHP's most elegant framework.
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* --- SCROLLABLE CONTENT ---
          -mt-8 tucks the top of the list behind the hero's rounded bottom,
          and paddingTop pushes the first card back down so it starts just below the curve. */}
      <ScrollView
        className="flex-1 -mt-8 px-5"
        contentContainerStyle={{ paddingTop: 52, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* About card */}
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <Text className="text-gray-800 text-lg font-bold mb-2">About This App</Text>
          <Text className="text-gray-500 text-sm leading-relaxed">
            Learn Laravel Offline is designed to take you from a complete beginner to a confident backend developer. Whether you are building simple web pages or complex APIs, this app provides everything you need to learn at your own pace, completely offline.
          </Text>
        </View>

        {/* What you will learn */}
        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-8 mb-4 px-1">
          What You Will Learn
        </Text>

        {PILLARS.map((p) => (
          <View key={p.title} className="flex-row items-start mb-5 pl-1">
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 mt-1 ${p.bg}`}>
              <Ionicons name={p.icon} size={20} color={p.color} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-bold text-base mb-1">{p.title}</Text>
              <Text className="text-gray-500 text-xs leading-relaxed">{p.text}</Text>
            </View>
          </View>
        ))}

        {/* Call to action */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/lessons')}
          accessibilityRole="button"
          accessibilityLabel="Start learning"
          className="bg-[#FF3B30] py-4 rounded-2xl flex-row justify-center items-center mt-2"
          style={{
            shadowColor: '#FF3B30',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <Text className="text-white text-base font-bold mr-2">Start Learning</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}