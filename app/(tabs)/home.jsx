import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* --- HERO WELCOME SECTION --- */}
        <View className="bg-[#FF3B30] pt-16 pb-12 px-6 rounded-b-[40px] shadow-lg">
          <View className="items-center mb-6">
            <View className="bg-white p-4 rounded-full shadow-md mb-4">
              <Image 
                source={require("../../assets/images/icon.png")} // Ensure this matches your project path
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
            <Text className="text-white text-3xl font-extrabold tracking-wide text-center">
              Welcome Artisan
            </Text>
            <Text className="text-red-100 text-sm font-medium mt-2 text-center px-4 leading-relaxed">
              Your comprehensive, offline guide to mastering PHP's most elegant framework.
            </Text>
          </View>
        </View>

        {/* --- ABOUT THE APP CARD --- */}
        <View className="px-5 -mt-6">
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <Text className="text-gray-800 text-lg font-bold mb-2">About This App</Text>
            <Text className="text-gray-500 text-sm leading-relaxed">
              Learn Laravel Offline is designed to take you from a complete beginner to a confident backend developer. Whether you are building simple web pages or complex APIs, this app provides everything you need to learn at your own pace, completely offline.
            </Text>
          </View>
        </View>

        {/* --- WHAT YOU WILL LEARN SECTION --- */}
        <View className="px-5 mt-8">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 px-1">
            What You Will Learn
          </Text>

          {/* Pillar 1: MVC Architecture */}
          <View className="flex-row items-start mb-5 pl-1">
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4 mt-1">
              <Ionicons name="cube-outline" size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-bold text-base mb-1">MVC Architecture</Text>
              <Text className="text-gray-500 text-xs leading-relaxed">
                Understand how to separate your application logic using Models, Views (Blade templates), and Controllers for clean, maintainable code.
              </Text>
            </View>
          </View>

          {/* Pillar 2: Database & Eloquent */}
          <View className="flex-row items-start mb-5 pl-1">
            <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center mr-4 mt-1">
              <Ionicons name="server-outline" size={20} color="#8B5CF6" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-bold text-base mb-1">Database Mastery</Text>
              <Text className="text-gray-500 text-xs leading-relaxed">
                Design databases effortlessly with Migrations and interact with your data using the powerful, expressive Eloquent ORM.
              </Text>
            </View>
          </View>

          {/* Pillar 3: Security & Authentication */}
          <View className="flex-row items-start mb-5 pl-1">
            <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-4 mt-1">
              <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-bold text-base mb-1">Robust Security</Text>
              <Text className="text-gray-500 text-xs leading-relaxed">
                Implement secure user authentication, role-based authorization, and protect your apps against common vulnerabilities like CSRF and XSS.
              </Text>
            </View>
          </View>

          {/* Pillar 4: APIs & Advanced Concepts */}
          <View className="flex-row items-start mb-5 pl-1">
            <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-4 mt-1">
              <Ionicons name="globe-outline" size={20} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-bold text-base mb-1">Modern APIs</Text>
              <Text className="text-gray-500 text-xs leading-relaxed">
                Build scalable RESTful APIs, manage background jobs, handle file storage, and master advanced Laravel ecosystems.
              </Text>
            </View>
          </View>

        </View>

        {/* --- CALL TO ACTION BUTTON --- */}
        <View className="px-5 mt-6 mb-12">
          <TouchableOpacity 
            className="bg-[#FF3B30] py-4 rounded-2xl shadow-md flex-row justify-center items-center"
            // onPress={() => navigation.navigate('Modules')} // Add your navigation logic here
          >
            <Text className="text-white text-base font-bold mr-2">Start Learning</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}