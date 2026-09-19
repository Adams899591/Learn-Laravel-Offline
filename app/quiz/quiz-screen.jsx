// import React, { useEffect, useState } from 'react';
// import {
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router'; // 1. Import useRouter

// import allQuestionsData from '../questions/laravel-questions.json';
// import { UsePracticeStore } from '../../zustand/StorePraticalQuestions';

// const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

// export default function QuizScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter(); // 2. Initialize router
  
//   // SINGLE STORE CALL
//   const { 
//     practiceQuestions, 
//     userAnswers, 
//     setPracticeData, 
//     setUserAnswer 
//   } = UsePracticeStore();
  
//   // Local state for pagination index
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Initialize 20 random questions on component mount if store is empty
//   useEffect(() => {
//     if (!practiceQuestions || practiceQuestions.length === 0) {
//       setPracticeData(allQuestionsData, 'Laravel Architecture');
//     }
//   }, []);

//   // Safe early return AFTER all hooks have executed
//   if (!practiceQuestions || practiceQuestions.length === 0) {
//     return (
//       <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
//         <Text className="text-gray-500 font-medium">Loading questions...</Text>
//       </SafeAreaView>
//     );
//   }

//   const currentQuestion = practiceQuestions[currentIndex];
//   const selectedOptionIndex = userAnswers[currentQuestion.id] ?? null;

//   const handleSelectOption = (optionIndex) => {
//     setUserAnswer(currentQuestion.id, optionIndex);
//   };

//   // 3. Update handleNext to push or replace to the result screen when finishing
//   const handleNext = () => {
//     if (currentIndex < practiceQuestions.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       // Replace with your actual result screen file path/route name
//       router.replace('/quiz/quiz-result-screen'); 
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       {/* --- TOP HEADER BAR --- */}
//       <View className="px-6 py-3.5 bg-white flex-row justify-between items-center border-b border-gray-100">
//         <View className="bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100 flex-row items-center">
//           <View className="w-2 h-2 rounded-full bg-[#FF3B30] mr-2" />
//           <Text className="text-xs font-bold text-[#FF3B30] tracking-wide">
//             Laravel Architecture
//           </Text>
//         </View>

//         <View className="flex-row items-center px-3.5 py-1.5 rounded-2xl bg-gray-50 border border-gray-200">
//           <Ionicons name="time-outline" size={16} color="#FF3B30" style={{ marginRight: 6 }} />
//           <Text className="text-xs font-extrabold text-gray-800">
//             24:59
//           </Text>
//         </View>
//       </View>

//       {/* --- MAIN CONTENT SCROLL AREA --- */}
//       <ScrollView 
//         className="flex-1 px-6 pt-6" 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 110 }}
//       >
//         <View className="flex-row justify-between items-center mb-4">
//           <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//             Question {currentIndex + 1} of {practiceQuestions.length}
//           </Text>

//           <View className="bg-gray-100 px-3 py-0.5 rounded-md">
//             <Text className="text-[10px] font-bold text-gray-600 uppercase">
//               Core Concepts
//             </Text>
//           </View>
//         </View>

//         <View className="bg-white p-6 rounded-3xl border border-gray-100 mb-6 shadow-sm">
//           <Text className="text-gray-900 text-lg font-bold leading-relaxed">
//             {currentQuestion.question}
//           </Text>
//         </View>

//         {/* --- OPTIONS LIST --- */}
//         <View>
//           {currentQuestion.options.map((optionText, index) => {
//             const letter = OPTION_LETTERS[index];
//             const isSelected = selectedOptionIndex === index;
            
//             return (
//               <TouchableOpacity
//                 key={letter}
//                 activeOpacity={0.8}
//                 onPress={() => handleSelectOption(index)}
//                 className={`flex-row items-center p-4 rounded-2xl border mb-3 ${
//                   isSelected 
//                     ? 'bg-red-50 border-[#FF3B30]' 
//                     : 'bg-white border-gray-200'
//                 }`}
//               >
//                 <View 
//                   className={`w-9 h-9 rounded-xl justify-center items-center mr-3.5 ${
//                     isSelected ? 'bg-[#FF3B30]' : 'bg-gray-100'
//                   }`}
//                 >
//                   <Text 
//                     className={`text-sm font-extrabold uppercase ${
//                       isSelected ? 'text-white' : 'text-gray-600'
//                     }`}
//                   >
//                     {letter}
//                   </Text>
//                 </View>

//                 <Text 
//                   className={`text-sm font-semibold flex-1 ${
//                     isSelected ? 'text-gray-900 font-bold' : 'text-gray-700'
//                   }`}
//                 >
//                   {optionText}
//                 </Text>

//                 <View 
//                   className={`w-5 h-5 rounded-full border items-center justify-center ml-2 ${
//                     isSelected 
//                       ? 'bg-[#FF3B30] border-[#FF3B30]' 
//                       : 'bg-transparent border-gray-300'
//                   }`}
//                 >
//                   {isSelected && <Ionicons name="checkmark" size={12} color="#ffffff" />}
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       </ScrollView>

//       {/* --- FLOATING BOTTOM NAVIGATION BAR --- */}
//       <View 
//         style={{ paddingBottom: Math.max(insets.bottom, 12) }}
//         className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-4 flex-row justify-between items-center z-50 shadow-lg"
//       >
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={handlePrevious}
//           disabled={currentIndex === 0}
//           className={`w-28 h-12 rounded-2xl flex-row justify-center items-center border border-gray-200 bg-white ${
//             currentIndex === 0 ? 'opacity-50' : 'opacity-100'
//           }`}
//         >
//           <Ionicons name="arrow-back-outline" size={18} color="#374151" style={{ marginRight: 6 }} />
//           <Text className="text-sm font-bold text-gray-700">
//             Previous
//           </Text>
//         </TouchableOpacity>

//         {/* 4. Removed 'disabled' condition on the final index so users can click Finish */}
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={handleNext}
//           className="flex-1 ml-4 h-12 rounded-2xl bg-[#FF3B30] flex-row justify-center items-center shadow-md opacity-100"
//         >
//           <Text className="text-sm font-bold text-white mr-2">
//             {currentIndex === practiceQuestions.length - 1 ? 'Finish' : 'Next Question'}
//           </Text>
//           <Ionicons 
//             name={currentIndex === practiceQuestions.length - 1 ? 'checkmark-circle-outline' : 'arrow-forward-outline'} 
//             size={18} 
//             color="#ffffff" 
//           />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }






// import React, { useEffect, useState } from 'react';
// import {
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// import allQuestionsData from '../questions/laravel-questions.json';
// import { UsePracticeStore } from '../../zustand/StorePraticalQuestions';

// const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
// const TOTAL_QUIZ_TIME = 1 * 60; // 25 minutes in seconds (change as needed)

// export default function QuizScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
  
//   // SINGLE STORE CALL
//   const { 
//     practiceQuestions, 
//     userAnswers, 
//     setPracticeData, 
//     setUserAnswer 
//   } = UsePracticeStore();
  
//   // Local state for pagination and timer (e.g., 25 minutes = 1500 seconds)
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(TOTAL_QUIZ_TIME);

//   // Initialize 25 random questions on component mount if store is empty
//   useEffect(() => {
//     if (!practiceQuestions || practiceQuestions.length === 0) {
//       setPracticeData(allQuestionsData, 'Laravel Architecture');
//     }
//   }, []);

//   // --- TIMER COUNTDOWN EFFECT ---
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       // Auto-navigate to result screen when time runs out
//       router.replace('/quiz/quiz-result-screen');
//       return;
//     }

//     const timerId = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         if (prevTime <= 1) {
//           clearInterval(timerId);
//           router.replace('/quiz/quiz-result-screen');
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft]);

//   // Format seconds into MM:SS format (e.g., 24:59, 04:59)
//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//   };

//   // Determine if time is 5 minutes (300 seconds) or less
//   const isTimeCritical = timeLeft <= 300;

//   // Safe early return AFTER all hooks have executed
//   if (!practiceQuestions || practiceQuestions.length === 0) {
//     return (
//       <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
//         <Text className="text-gray-500 font-medium">Loading questions...</Text>
//       </SafeAreaView>
//     );
//   }

//   const currentQuestion = practiceQuestions[currentIndex];
//   const selectedOptionIndex = userAnswers[currentQuestion.id] ?? null;

//   const handleSelectOption = (optionIndex) => {
//     setUserAnswer(currentQuestion.id, optionIndex);
//   };

//   const handleNext = () => {
//     if (currentIndex < practiceQuestions.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       router.replace('/quiz/quiz-result-screen'); 
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       {/* --- TOP HEADER BAR --- */}
//       <View className="px-6 py-3.5 bg-white flex-row justify-between items-center border-b border-gray-100">
//         <View className="bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100 flex-row items-center">
//           <View className="w-2 h-2 rounded-full bg-[#FF3B30] mr-2" />
//           <Text className="text-xs font-bold text-[#FF3B30] tracking-wide">
//             Laravel Architecture
//           </Text>
//         </View>

//         {/* Dynamic Timer Badge */}
//         <View className={`flex-row items-center px-3.5 py-1.5 rounded-2xl border ${isTimeCritical ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
//           <Ionicons 
//             name="time-outline" 
//             size={16} 
//             color={isTimeCritical ? '#FF3B30' : '#374151'} 
//             style={{ marginRight: 6 }} 
//           />
//           <Text className={`text-xs font-extrabold ${isTimeCritical ? 'text-[#FF3B30]' : 'text-gray-800'}`}>
//             {formatTime(timeLeft)}
//           </Text>
//         </View>
//       </View>

//       {/* --- MAIN CONTENT SCROLL AREA --- */}
//       <ScrollView 
//         className="flex-1 px-6 pt-6" 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 110 }}
//       >
//         <View className="flex-row justify-between items-center mb-4">
//           <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//             Question {currentIndex + 1} of {practiceQuestions.length}
//           </Text>

//           <View className="bg-gray-100 px-3 py-0.5 rounded-md">
//             <Text className="text-[10px] font-bold text-gray-600 uppercase">
//               Core Concepts
//             </Text>
//           </View>
//         </View>

//         <View className="bg-white p-6 rounded-3xl border border-gray-100 mb-6 shadow-sm">
//           <Text className="text-gray-900 text-lg font-bold leading-relaxed">
//             {currentQuestion.question}
//           </Text>
//         </View>

//         {/* --- OPTIONS LIST --- */}
//         <View>
//           {currentQuestion.options.map((optionText, index) => {
//             const letter = OPTION_LETTERS[index];
//             const isSelected = selectedOptionIndex === index;
            
//             return (
//               <TouchableOpacity
//                 key={letter}
//                 activeOpacity={0.8}
//                 onPress={() => handleSelectOption(index)}
//                 className={`flex-row items-center p-4 rounded-2xl border mb-3 ${
//                   isSelected 
//                     ? 'bg-red-50 border-[#FF3B30]' 
//                     : 'bg-white border-gray-200'
//                 }`}
//               >
//                 <View 
//                   className={`w-9 h-9 rounded-lg justify-center items-center mr-3.5 ${
//                     isSelected ? 'bg-[#FF3B30]' : 'bg-gray-100'
//                   }`}
//                 >
//                   <Text 
//                     className={`text-sm font-extrabold uppercase ${
//                       isSelected ? 'text-white' : 'text-gray-600'
//                     }`}
//                   >
//                     {letter}
//                   </Text>
//                 </View>

//                 <Text 
//                   className={`text-sm font-semibold flex-1 ${
//                     isSelected ? 'text-gray-900 font-bold' : 'text-gray-700'
//                   }`}
//                 >
//                   {optionText}
//                 </Text>

//                 <View 
//                   className={`w-5 h-5 rounded-full border items-center justify-center ml-2 ${
//                     isSelected 
//                       ? 'bg-[#FF3B30] border-[#FF3B30]' 
//                       : 'bg-transparent border-gray-300'
//                   }`}
//                 >
//                   {isSelected && <Ionicons name="checkmark" size={12} color="#ffffff" />}
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       </ScrollView>

//       {/* --- FLOATING BOTTOM NAVIGATION BAR --- */}
//       <View 
//         style={{ paddingBottom: Math.max(insets.bottom, 12) }}
//         className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-4 flex-row justify-between items-center z-50 shadow-lg"
//       >
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={handlePrevious}
//           disabled={currentIndex === 0}
//           className={`w-28 h-12 rounded-2xl flex-row justify-center items-center border border-gray-200 bg-white ${
//             currentIndex === 0 ? 'opacity-50' : 'opacity-100'
//           }`}
//         >
//           <Ionicons name="arrow-back-outline" size={18} color="#374151" style={{ marginRight: 6 }} />
//           <Text className="text-sm font-bold text-gray-700">
//             Previous
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={handleNext}
//           className="flex-1 ml-4 h-12 rounded-2xl bg-[#FF3B30] flex-row justify-center items-center shadow-md opacity-100"
//         >
//           <Text className="text-sm font-bold text-white mr-2">
//             {currentIndex === practiceQuestions.length - 1 ? 'Finish' : 'Next Question'}
//           </Text>
//           <Ionicons 
//             name={currentIndex === practiceQuestions.length - 1 ? 'checkmark-circle-outline' : 'arrow-forward-outline'} 
//             size={18} 
//             color="#ffffff" 
//           />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }



import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import allQuestionsData from '../questions/laravel-questions.json';
import { UsePracticeStore } from '../../zustand/StorePraticalQuestions';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const TOTAL_QUIZ_TIME = 20 * 60; // 25 minutes in seconds

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // SINGLE STORE CALL
  const { 
    practiceQuestions, 
    userAnswers, 
    setPracticeData, 
    setUserAnswer 
  } = UsePracticeStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_QUIZ_TIME);

  // Initialize questions on mount safely
  useEffect(() => {
    if (!practiceQuestions || practiceQuestions.length === 0) {
      setPracticeData(allQuestionsData, 'Laravel Architecture');
    }
  }, []);

  // --- STABLE TIMER COUNTDOWN EFFECT ---
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          // Defer navigation slightly out of the immediate reducer tick to avoid render conflicts
          setTimeout(() => {
            router.replace('/quiz/quiz-result-screen');
          }, 0);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []); // Empty dependency array ensures interval starts only once on mount

  // Format seconds into MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Determine if time is 5 minutes (300 seconds) or less
  const isTimeCritical = timeLeft <= 300;

  // Safe early return AFTER all hooks have executed
  if (!practiceQuestions || practiceQuestions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 font-medium">Loading questions...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = practiceQuestions[currentIndex];
  const selectedOptionIndex = userAnswers[currentQuestion.id] ?? null;

  const handleSelectOption = (optionIndex) => {
    setUserAnswer(currentQuestion.id, optionIndex);
  };

  const handleNext = () => {
    if (currentIndex < practiceQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/quiz/quiz-result-screen'); 
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* --- TOP HEADER BAR --- */}
      <View className="px-6 py-3.5 bg-white flex-row justify-between items-center border-b border-gray-100">
        <View className="bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100 flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-[#FF3B30] mr-2" />
          <Text className="text-xs font-bold text-[#FF3B30] tracking-wide">
            Laravel Architecture
          </Text>
        </View>

        {/* Dynamic Timer Badge */}
        <View className={`flex-row items-center px-3.5 py-1.5 rounded-2xl border ${isTimeCritical ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <Ionicons 
            name="time-outline" 
            size={16} 
            color={isTimeCritical ? '#FF3B30' : '#374151'} 
            style={{ marginRight: 6 }} 
          />
          <Text className={`text-xs font-extrabold ${isTimeCritical ? 'text-[#FF3B30]' : 'text-gray-800'}`}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      {/* --- MAIN CONTENT SCROLL AREA --- */}
      <ScrollView 
        className="flex-1 px-6 pt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Question {currentIndex + 1} of {practiceQuestions.length}
          </Text>

          <View className="bg-gray-100 px-3 py-0.5 rounded-md">
            <Text className="text-[10px] font-bold text-gray-600 uppercase">
              Core Concepts
            </Text>
          </View>
        </View>

        <View className="bg-white p-6 rounded-3xl border border-gray-100 mb-6 shadow-sm">
          <Text className="text-gray-900 text-lg font-bold leading-relaxed">
            {currentQuestion.question}
          </Text>
        </View>

        {/* --- OPTIONS LIST --- */}
        <View>
          {currentQuestion.options.map((optionText, index) => {
            const letter = OPTION_LETTERS[index];
            const isSelected = selectedOptionIndex === index;
            
            return (
              <TouchableOpacity
                key={letter}
                activeOpacity={0.8}
                onPress={() => handleSelectOption(index)}
                className={`flex-row items-center p-4 rounded-2xl border mb-3 ${
                  isSelected 
                    ? 'bg-red-50 border-[#FF3B30]' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <View 
                  className={`w-9 h-9 rounded-lg justify-center items-center mr-3.5 ${
                    isSelected ? 'bg-[#FF3B30]' : 'bg-gray-100'
                  }`}
                >
                  <Text 
                    className={`text-sm font-extrabold uppercase ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {letter}
                  </Text>
                </View>

                <Text 
                  className={`text-sm font-semibold flex-1 ${
                    isSelected ? 'text-gray-900 font-bold' : 'text-gray-700'
                  }`}
                >
                  {optionText}
                </Text>

                <View 
                  className={`w-5 h-5 rounded-full border items-center justify-center ml-2 ${
                    isSelected 
                      ? 'bg-[#FF3B30] border-[#FF3B30]' 
                      : 'bg-transparent border-gray-300'
                  }`}
                >
                  {isSelected && <Ionicons name="checkmark" size={12} color="#ffffff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* --- FLOATING BOTTOM NAVIGATION BAR --- */}
      <View 
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-4 flex-row justify-between items-center z-50 shadow-lg"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          className={`w-28 h-12 rounded-2xl flex-row justify-center items-center border border-gray-200 bg-white ${
            currentIndex === 0 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <Ionicons name="arrow-back-outline" size={18} color="#374151" style={{ marginRight: 6 }} />
          <Text className="text-sm font-bold text-gray-700">
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNext}
          className="flex-1 ml-4 h-12 rounded-2xl bg-[#FF3B30] flex-row justify-center items-center shadow-md opacity-100"
        >
          <Text className="text-sm font-bold text-white mr-2">
            {currentIndex === practiceQuestions.length - 1 ? 'Finish' : 'Next Question'}
          </Text>
          <Ionicons 
            name={currentIndex === practiceQuestions.length - 1 ? 'checkmark-circle-outline' : 'arrow-forward-outline'} 
            size={18} 
            color="#ffffff" 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}