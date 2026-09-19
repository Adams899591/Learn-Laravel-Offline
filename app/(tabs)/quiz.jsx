import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { UsePracticeStore } from '../../zustand/StorePraticalQuestions';
import allQuestionsData from '../questions/laravel-questions.json'; // Adjust path if needed

const QUIZ_TOPIC = 'Laravel Architecture';

// Quick facts shown in the card that overlaps the hero
const STATS = [
  { icon: 'help-circle-outline', value: '20', label: 'Questions' },
  { icon: 'speedometer-outline', value: 'Mixed', label: 'Difficulty' },
  { icon: 'shuffle-outline', value: 'Random', label: 'Order' },
];

// What the user can expect before they start
const EXPECTATIONS = [
  {
    icon: 'shuffle',
    color: '#3B82F6',
    bg: 'bg-blue-50',
    title: 'A fresh set every time',
    text: 'Each attempt picks 20 new questions at random from the Laravel question bank.',
  },
  {
    icon: 'layers',
    color: '#8B5CF6',
    bg: 'bg-purple-50',
    title: 'Basics to trickier concepts',
    text: 'Questions vary in difficulty, so you can see exactly where you stand.',
  },
  {
    icon: 'refresh',
    color: '#10B981',
    bg: 'bg-green-50',
    title: 'Retake anytime',
    text: 'Practice as often as you like to improve your score.',
  },
];

export default function QuizWelcomeScreen() {
  const router = useRouter();
  const { clearPracticeData, setPracticeData } = UsePracticeStore();

  const handleStartQuiz = () => {
    // Clear old data first, then generate a brand new set of random questions
    clearPracticeData();
    setPracticeData(allQuestionsData, QUIZ_TOPIC);
    router.push('/quiz/quiz-screen');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />

      {/* --- HERO --- */}
      <View className="bg-[#FF3B30] rounded-b-[40px] overflow-hidden">
        {/* Soft decorative circles */}
        <View
          className="absolute rounded-full"
          style={{ width: 220, height: 220, top: -80, right: -60, backgroundColor: 'rgba(255,255,255,0.12)' }}
        />
        <View
          className="absolute rounded-full"
          style={{ width: 160, height: 160, bottom: -60, left: -50, backgroundColor: 'rgba(0,0,0,0.08)' }}
        />

        <SafeAreaView>
          <View className="items-center px-6 pt-6 pb-16">
            <View className="bg-white p-4 rounded-3xl shadow-lg mb-5">
              <Image
                source={require('../../assets/images/icon.png')}
                className="w-14 h-14"
                resizeMode="contain"
              />
            </View>

            <Text className="text-white text-2xl font-extrabold text-center">
              Ready for the challenge?
            </Text>
            <Text className="text-red-100 text-sm text-center leading-relaxed mt-2 px-2">
              Test your Laravel knowledge, reinforce what you've learned, and see how far you've come.
            </Text>

            {/* Topic pill (glass style, matches the welcome screen) */}
            <View
              className="flex-row items-center mt-5 px-4 py-2 rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.35)',
              }}
            >
              <Ionicons name="bookmark-outline" size={14} color="#fff" />
              <Text className="text-white text-xs font-semibold ml-1.5">{QUIZ_TOPIC}</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* --- CONTENT (slides up over the hero) --- */}
      <ScrollView
        className="flex-1 px-5 -mt-10"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats card */}
        <View className="flex-row bg-white rounded-3xl py-5 border border-gray-100 shadow-md">
          {STATS.map((s, i) => (
            <View
              key={s.label}
              className={`flex-1 items-center ${i < STATS.length - 1 ? 'border-r border-gray-100' : ''}`}
            >
              <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center mb-2">
                <Ionicons name={s.icon} size={18} color="#FF3B30" />
              </View>
              <Text className="text-gray-900 text-base font-extrabold">{s.value}</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* What to expect */}
        <Text className="text-gray-900 text-base font-bold mt-8 mb-3 px-1">What to expect</Text>

        {EXPECTATIONS.map((item) => (
          <View
            key={item.title}
            className="flex-row items-center bg-white p-3.5 mb-3 rounded-2xl border border-gray-100 shadow-sm"
          >
            <View className={`w-11 h-11 rounded-xl items-center justify-center mr-4 ${item.bg}`}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-bold text-sm">{item.title}</Text>
              <Text className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* --- STICKY START BUTTON --- */}
      <SafeAreaView className="bg-gray-50">
        <View className="px-5 pt-3 pb-4 border-t border-gray-100">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleStartQuiz}
            accessibilityRole="button"
            accessibilityLabel="Start quiz"
            className="bg-[#FF3B30] w-full py-4 rounded-2xl flex-row justify-center items-center"
            style={{
              shadowColor: '#FF3B30',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 14,
              elevation: 8,
            }}
          >
            <Text className="text-white text-base font-bold mr-2">Start quiz</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}