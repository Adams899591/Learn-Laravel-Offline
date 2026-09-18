import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuizWelcomeScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />
      
      <ScrollView className="flex-1 px-5 pt-8" showsVerticalScrollIndicator={false}>
        
        {/* --- MAIN CARD CONTAINER --- */}
        <View className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 items-center mt-10">
          
          {/* --- LOGO WRAPPER --- */}
          <View className="bg-red-50 p-6 rounded-full shadow-inner mb-6">
            <Image 
              source={require("../../assets/images/icon.png")} // Ensure this matches your project path
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>

          {/* --- TITLE --- */}
          <Text className="text-gray-900 text-2xl font-extrabold tracking-wide text-center mb-3">
            Ready for the Challenge?
          </Text>

          {/* --- SUBTITLE / DESCRIPTION --- */}
          <Text className="text-gray-500 text-sm font-medium text-center leading-relaxed px-2 mb-8">
            Take a quick quiz to test your Laravel knowledge, reinforce what you've learned, and track your progress.
          </Text>

          {/* --- STATS / QUICK INFO BADGES (OPTIONAL PROFESSIONAL TOUCH) --- */}
          <View className="flex-row justify-between w-full bg-gray-50 p-4 rounded-2xl mb-8">
            <View className="items-center flex-1 border-r border-gray-200">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Questions</Text>
              <Text className="text-gray-800 text-lg font-extrabold mt-1">15</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Difficulty</Text>
              <Text className="text-red-500 text-lg font-extrabold mt-1">Mixed</Text>
            </View>
          </View>

          {/* --- START BUTTON --- */}
          <TouchableOpacity 
            className="bg-[#FF3B30] w-full py-4 rounded-2xl shadow-md flex-row justify-center items-center active:opacity-90"
            onPress={() => {
              // Add your navigation logic here, e.g.:
              // navigation.navigate('QuizScreen');
            }}
          >
            <Text className="text-white text-base font-bold mr-2">Start Quiz</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>

        </View>

        {/* --- FOOTER HINT --- */}
        <View className="items-center mt-8 mb-12">
          <Text className="text-gray-400 text-xs text-center">
            You can retake this quiz anytime to improve your score.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}