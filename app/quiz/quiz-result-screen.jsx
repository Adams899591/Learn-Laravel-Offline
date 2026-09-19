import React, { useMemo } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import your Zustand store
import { UsePracticeStore } from '../../zustand/StorePraticalQuestions';

export default function QuizResultScreen() {
  const router = useRouter();

  // Pull practice questions, current courses, and user answers from Zustand
  const { practiceQuestions, currentCourses, userAnswers } = UsePracticeStore();

  // Calculate scores and metrics dynamically for the 20 random practice questions
  const examResult = useMemo(() => {
    if (!practiceQuestions || practiceQuestions.length === 0) {
      return { totalScore: 0, maxScore: 0, percentage: 0, passed: false };
    }

    let totalScore = 0;
    const maxScore = practiceQuestions.length;

    practiceQuestions.forEach((q) => {
      const userAnswerIndex = userAnswers[q.id]; // e.g., number 0, 1, 2, 3

      // Laravel questions standard key check for correct option
      // Depending on your JSON structure, 'answer' or 'correctAnswer' could be an index or letter string
      const correctAnswer = q.answer ?? q.correctAnswer ?? 0;

      // Match user selection with the correct answer format
      if (userAnswerIndex !== undefined && userAnswerIndex !== null) {
        if (userAnswerIndex === correctAnswer) {
          totalScore += 1;
        }
      }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return {
      totalScore,
      maxScore,
      percentage,
      passed: percentage >= 50,
    };
  }, [practiceQuestions, userAnswers]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* --- TOP HEADER BAR --- */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-xl bg-red-50 justify-center items-center mr-3 border border-red-100">
            <Ionicons name="trophy-outline" size={20} color="#FF3B30" />
          </View>
          <Text className="text-lg font-bold text-gray-900">Practice Results</Text>
        </View>

        <TouchableOpacity 
          onPress={() => router.replace('/home')}
          className="w-9 h-9 rounded-xl bg-gray-100 justify-center items-center"
        >
          <Ionicons name="close-outline" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* --- MAIN CONTENT SCROLL AREA --- */}
      <ScrollView 
        className="flex-1 px-6 pt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Score Card Banner */}
        <View className={`rounded-3xl p-6 mb-6 shadow-sm overflow-hidden relative ${examResult.passed ? 'bg-red-600' : 'bg-gray-800'}`}>
          {/* Decorative Background Icon Ring */}
          <View className="absolute -right-6 -bottom-6 opacity-10">
            <Ionicons name="ribbon" size={160} color="#ffffff" />
          </View>

          <View className="flex-row justify-between items-start mb-4">
            <View className="bg-white/20 px-3.5 py-1 rounded-full border border-white/30">
              <Text className="text-xs font-bold text-white uppercase tracking-wider">
                {examResult.passed ? '🎉 Great Job!' : 'Keep Practicing'}
              </Text>
            </View>
          </View>

          <View className="items-center my-3">
            <Text className="text-4xl font-extrabold text-white tracking-tight mb-1">
              {examResult.percentage}%
            </Text>
            <Text className="text-sm font-medium text-white/90">
              Score: {examResult.totalScore} out of {examResult.maxScore} questions
            </Text>
          </View>
        </View>

        {/* Breakdown Section Title */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Category Breakdown
          </Text>
        </View>

        {/* Single/Main Subject Performance Card */}
        <View className="mb-8">
          <View className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-xl bg-red-50 justify-center items-center mr-3.5 border border-red-100">
                <Ionicons name="logo-laravel" size={20} color="#FF3B30" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 mb-0.5">
                  {currentCourses || 'Laravel Architecture'}
                </Text>
                <Text className="text-xs font-medium text-gray-500">
                  Correct: {examResult.totalScore} / {examResult.maxScore}
                </Text>
              </View>
            </View>

            <View className="items-end">
              <Text className="text-base font-extrabold text-[#FF3B30] mb-0.5">
                {examResult.percentage}%
              </Text>
              <View className="bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                <Text className="text-[10px] font-bold text-[#FF3B30]">Completed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {/* <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace('/home')}
            className="w-full h-14 rounded-2xl bg-[#FF3B30] flex-row justify-center items-center shadow-md"
          >
            <Text className="text-sm font-bold text-white mr-2">
              Back to Dashboard
            </Text>
            <Ionicons name="arrow-forward-outline" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View> */}
        {/* Action Buttons */}
        <View>
          {/* --- ADD THIS REVIEW BUTTON HERE --- */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/quiz/review-answers-screen')} // Update path to match your review screen route
            className="w-full h-14 rounded-2xl bg-white border border-gray-200 flex-row justify-center items-center shadow-sm mb-3"
          >
            <Ionicons name="eye-outline" size={18} color="#374151" style={{ marginRight: 8 }} />
            <Text className="text-sm font-bold text-gray-700">
              Review Detailed Answers
            </Text>
          </TouchableOpacity>
          {/* ------------------------------------ */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace('/home')}
            className="w-full h-14 rounded-2xl bg-[#FF3B30] flex-row justify-center items-center shadow-md"
          >
            <Text className="text-sm font-bold text-white mr-2">
              Back to Dashboard
            </Text>
            <Ionicons name="arrow-forward-outline" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>









      </ScrollView>
    </SafeAreaView>
  );
}