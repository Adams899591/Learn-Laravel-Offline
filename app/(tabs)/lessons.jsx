import React from 'react';
import { View, Text, ScrollView,  SafeAreaView,TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Import router for navigation
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Added a 'screen' property to map to your module detail pages
const curriculumList = [
  { id: '1', title: 'Getting Started', icon: 'rocket', color: '#3B82F6', bg: 'bg-blue-50', screen: '/screen/module1' },
  { id: '2', title: 'PHP Fundamentals', icon: 'code-slash', color: '#8B5CF6', bg: 'bg-purple-50', screen: '/screen/module2' },
  { id: '3', title: 'Laravel Fundamentals', icon: 'cube', color: '#EF4444', bg: 'bg-red-50', screen: '/screen/module3' },
  { id: '4', title: 'Routing', icon: 'git-network', color: '#10B981', bg: 'bg-green-50', screen: '/screen/module4' },
  { id: '5', title: 'Controllers', icon: 'game-controller', color: '#F59E0B', bg: 'bg-yellow-50', screen: '/screen/module5' },
  { id: '6', title: 'Views & Blade', icon: 'browsers', color: '#06B6D4', bg: 'bg-cyan-50', screen: '/screen/module6' },
  { id: '7', title: 'Forms & Validation', icon: 'checkbox', color: '#14B8A6', bg: 'bg-teal-50', screen: '/screen/module7' },
  { id: '8', title: 'Database', icon: 'server', color: '#6366F1', bg: 'bg-indigo-50', screen: '/screen/module8' },
  { id: '9', title: 'Migrations', icon: 'swap-vertical', color: '#8B5CF6', bg: 'bg-purple-50', screen: '/screen/module9' },
  { id: '10', title: 'Eloquent ORM', icon: 'layers', color: '#EC4899', bg: 'bg-pink-50', screen: '/screen/module10' },
  { id: '11', title: 'Relationships', icon: 'people', color: '#F97316', bg: 'bg-orange-50', screen: '/screen/module11' },
  { id: '12', title: 'Authentication', icon: 'key', color: '#3B82F6', bg: 'bg-blue-50', screen: '/screen/module12' },
  { id: '13', title: 'Authorization', icon: 'shield-checkmark', color: '#10B981', bg: 'bg-green-50', screen: '/screen/module13' },
  { id: '14', title: 'Middleware', icon: 'funnel', color: '#6B7280', bg: 'bg-gray-100', screen: '/screen/module14' },
  { id: '15', title: 'Sessions', icon: 'time', color: '#F59E0B', bg: 'bg-yellow-50', screen: '/screen/module15' },
  { id: '16', title: 'APIs', icon: 'globe', color: '#0EA5E9', bg: 'bg-sky-50', screen: '/screen/module16' },
  { id: '17', title: 'API Authentication', icon: 'lock-closed', color: '#EF4444', bg: 'bg-red-50', screen: '/screen/module17' },
  { id: '18', title: 'File Storage', icon: 'folder', color: '#EAB308', bg: 'bg-yellow-50', screen: '/screen/module18' },
  { id: '19', title: 'Mail', icon: 'mail', color: '#3B82F6', bg: 'bg-blue-50', screen: '/screen/module19' },
  { id: '20', title: 'Notifications', icon: 'notifications', color: '#F59E0B', bg: 'bg-yellow-50', screen: '/screen/module20' },
  { id: '21', title: 'Queues & Jobs', icon: 'list', color: '#8B5CF6', bg: 'bg-purple-50', screen: '/screen/module21' },
  { id: '22', title: 'Events & Listeners', icon: 'pulse', color: '#EF4444', bg: 'bg-red-50', screen: '/screen/module22' },
  { id: '23', title: 'Task Scheduling', icon: 'calendar', color: '#10B981', bg: 'bg-green-50', screen: '/screen/module23' },
  { id: '24', title: 'Testing', icon: 'flask', color: '#06B6D4', bg: 'bg-cyan-50', screen: '/screen/module24' },
  { id: '25', title: 'Caching', icon: 'flash', color: '#F59E0B', bg: 'bg-yellow-50', screen: '/screen/module25' },
  { id: '26', title: 'Security', icon: 'shield-half', color: '#3B82F6', bg: 'bg-blue-50', screen: '/screen/module26' },
  { id: '27', title: 'Deployment', icon: 'cloud-upload', color: '#6366F1', bg: 'bg-indigo-50', screen: '/screen/module27' },
  { id: '28', title: 'Advanced Laravel', icon: 'star', color: '#EC4899', bg: 'bg-pink-50', screen: '/screen/module28' },
];

export default function ModulesListScreen() {
   const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-gray-50">
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />
      
      {/* --- PROFESSIONAL HERO SECTION --- */}
      <SafeAreaView  className="bg-[#FF3B30]">
        <View style={{ paddingTop: insets.top + 4 }} className="bg-[#FF3B30] pt-4 pb-10 px-5 rounded-b-[40px] shadow-lg z-25 -mb-4">
          
          <View className="flex-row items-center mb-4">
            <View className="bg-white p-3 rounded-2xl shadow-sm mr-4">
              <Image 
                source={require("../../assets/images/icon.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-extrabold tracking-wide">
                Learn Laravel Offline
              </Text>
              <Text className="text-red-200 text-xs font-medium">
                Your offline companion to modern web development
              </Text>
            </View>
          </View>

          <View className="bg-black/10 p-3.5 rounded-2xl border border-white/10 mb-4">
            <Text className="text-white text-xs leading-relaxed font-normal">
              Master the PHP framework for web artisans. Designed for developers of all levels, this app provides structured modules, clear concepts, and practical examples to build robust web applications—completely offline.
            </Text>
          </View>

          <View className="flex-row items-center justify-between px-1">
            <View className="flex-row items-center space-x-1">
              <Ionicons name="book-outline" size={14} color="#FECDD3" />
              <Text className="text-red-100 text-[11px] font-semibold ml-1">28 Core Modules</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Ionicons name="cloud-offline-outline" size={14} color="#FECDD3" />
              <Text className="text-red-100 text-[11px] font-semibold ml-1">100% Offline</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Ionicons name="flash-outline" size={14} color="#FECDD3" />
              <Text className="text-red-100 text-[11px] font-semibold ml-1">Step-by-Step</Text>
            </View>
          </View>

        </View>
      </SafeAreaView>

      {/* --- SCROLLABLE CURRICULUM LIST --- */}
      <ScrollView className="flex-1 px-4 pt-8" showsVerticalScrollIndicator={false}>
        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
          Curriculum Modules
        </Text>

        {curriculumList.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => router.push(item.screen)} // Pushes to the corresponding module screen
            className="flex-row items-center bg-white p-3.5 mb-3 rounded-2xl border border-gray-100 shadow-sm"
          >
            <View className={`w-11 h-11 rounded-xl items-center justify-center mr-4 ${item.bg}`}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>

            <View className="flex-1">
              <Text className="text-gray-800 font-bold text-sm">
                {item.title}
              </Text>
              <Text className="text-gray-400 text-xs mt-0.5">
                Module {item.id} of 28
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
        
        <View className="h-28" />
      </ScrollView>
    </View>
  );
}

