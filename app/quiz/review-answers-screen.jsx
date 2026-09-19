import React, { useMemo, useState } from 'react';
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
import { UsePracticeStore } from '../../zustand/StorePraticalQuestions';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function CBTReviewAnswersScreen() {
  const router = useRouter();

  const [filter, setFilter] = useState('all');
  const { practiceQuestions, userAnswers } = UsePracticeStore();

  const evaluatedQuestions = useMemo(() => {
    if (!practiceQuestions || practiceQuestions.length === 0) return [];

    return practiceQuestions.map((q, index) => {
      const userAnswerIndex = userAnswers[q.id];
      const correctAnswerIndex = q.answer ?? q.correctAnswer ?? 0;

      const hasAnswered = userAnswerIndex !== undefined && userAnswerIndex !== null;
      const isCorrect = hasAnswered && userAnswerIndex === correctAnswerIndex;

      return {
        ...q,
        questionNumber: index + 1,
        userAnswerIndex,
        correctAnswerIndex,
        hasAnswered,
        isCorrect,
      };
    });
  }, [practiceQuestions, userAnswers]);

  const filteredQuestions = useMemo(() => {
    if (filter === 'passed') return evaluatedQuestions.filter((q) => q.isCorrect);
    if (filter === 'failed') return evaluatedQuestions.filter((q) => !q.isCorrect);
    return evaluatedQuestions;
  }, [evaluatedQuestions, filter]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-9 h-9 rounded-xl bg-gray-100 justify-center items-center mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Review Answers</Text>
        </View>

        <View className="bg-red-50 px-3 py-1 rounded-full border border-red-100">
          <Text className="text-xs font-bold text-[#FF3B30]">
            {practiceQuestions.length} Questions
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="px-6 pt-4 pb-2 flex-row space-x-2 bg-white">
        <TouchableOpacity
          // onPress={() => setFilter('all')}
          className={`flex-1 py-2.5 rounded-xl border items-center ${filter === 'all' ? 'bg-gray-900 border-gray-900' : 'bg-gray-50 border-gray-200'}`}
        >
          <Text className={`text-xs font-bold ${filter === 'all' ? 'text-white' : 'text-gray-600'}`}>
            All ({evaluatedQuestions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          // onPress={() => setFilter('passed')}
          className={`flex-1 py-2.5 rounded-xl border items-center ${filter === 'passed' ? 'bg-green-600 border-green-600' : 'bg-green-50 border-green-200'}`}
        >
          <Text className={`text-xs font-bold ${filter === 'passed' ? 'text-white' : 'text-green-700'}`}>
            Passed ({evaluatedQuestions.filter(q => q.isCorrect).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          // onPress={() => setFilter('failed')}
          className={`flex-1 py-2.5 rounded-xl border items-center ${filter === 'failed' ? 'bg-red-600 border-red-600' : 'bg-red-50 border-red-200'}`}
        >
          <Text className={`text-xs font-bold ${filter === 'failed' ? 'text-white' : 'text-red-700'}`}>
            Failed ({evaluatedQuestions.filter(q => !q.isCorrect).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1 px-6 pt-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {filteredQuestions.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 font-semibold mt-3 text-sm">
              No questions found in this filter category.
            </Text>
          </View>
        ) : (
          filteredQuestions.map((item) => (
            <View 
              key={item.id}
              className="bg-stone-50 border border-stone-200 rounded-3xl p-5 mb-5 shadow-sm"
            >
              {/* Question Header & Status Badge */}
              <View className="flex-row justify-between items-center mb-3">
                <View className="bg-red-50 px-2.5 py-0.5 rounded-md border border-red-100">
                  <Text className="text-[10px] font-bold text-[#FF3B30] uppercase">
                    Question {item.questionNumber}
                  </Text>
                </View>

                <View className={`flex-row items-center px-2.5 py-1 rounded-full border ${item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <Ionicons 
                    name={item.isCorrect ? 'checkmark-circle' : 'close-circle'} 
                    size={14} 
                    color={item.isCorrect ? '#16a34a' : '#dc2626'} 
                    style={{ marginRight: 4 }}
                  />
                  <Text className={`text-xs font-bold ${item.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {item.isCorrect ? 'Passed' : item.hasAnswered ? 'Failed' : 'Unanswered'}
                  </Text>
                </View>
              </View>

              {/* Question Text */}
              <View className="mb-4">
                <Text className="text-base text-gray-900 font-medium leading-6">
                  {item.question}
                </Text>
              </View>

              {/* Options Array Mapping */}
              <View className="mb-4">
                {item.options.map((optionText, optIdx) => {
                  const letter = OPTION_LETTERS[optIdx];
                  const isUserPick = item.userAnswerIndex === optIdx;
                  const isCorrectAnswer = item.correctAnswerIndex === optIdx;

                  let optionStyle = 'bg-white border-stone-200';
                  let badgeStyle = 'bg-gray-100 text-gray-600';
                  let textStyle = 'text-gray-700';

                  if (isCorrectAnswer) {
                    optionStyle = 'bg-green-50 border-green-500';
                    badgeStyle = 'bg-green-600 text-white';
                    textStyle = 'text-green-900 font-semibold';
                  } else if (isUserPick && !isCorrectAnswer) {
                    optionStyle = 'bg-red-50 border-red-400';
                    badgeStyle = 'bg-red-500 text-white';
                    textStyle = 'text-red-900 font-semibold';
                  }

                  return (
                    <View
                      key={optIdx}
                      className={`flex-row items-center p-3.5 rounded-2xl border mb-2 ${optionStyle}`}
                    >
                      <View className={`w-7 h-7 rounded-lg justify-center items-center mr-3 ${badgeStyle}`}>
                        <Text className="text-xs font-bold">{letter}</Text>
                      </View>
                      <Text className={`text-sm flex-1 font-medium ${textStyle}`}>
                        {optionText}
                      </Text>
                      
                      {isCorrectAnswer && <Ionicons name="checkmark-sharp" size={16} color="#16a34a" />}
                      {isUserPick && !isCorrectAnswer && <Ionicons name="close-sharp" size={16} color="#dc2626" />}
                    </View>
                  );
                })}
              </View>

              {/* Explanation Box */}
              {item.solution ? (
                <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="bulb-outline" size={16} color="#1d4ed8" style={{ marginRight: 6 }} />
                    <Text className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                      Explanation
                    </Text>
                  </View>
                  <Text className="text-xs text-blue-900 leading-relaxed font-medium">
                    {item.solution}
                  </Text>
                </View>
              ) : null}

              {/* Footer Summary */}
              <View className="pt-3 border-t border-stone-200 flex-row justify-between items-center">
                <Text className="text-xs font-medium text-gray-500">
                  Your Choice: <Text className="font-bold uppercase text-gray-800">
                    {item.hasAnswered ? OPTION_LETTERS[item.userAnswerIndex] : 'None'}
                  </Text>
                </Text>
                <Text className="text-xs font-medium text-gray-500">
                  Correct Choice: <Text className="font-bold uppercase text-green-600">
                    {OPTION_LETTERS[item.correctAnswerIndex]}
                  </Text>
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}