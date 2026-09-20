import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const lessonContent = [
  { 
    id: '1', 
    title: 'Why Test Laravel Applications?', 
    icon: 'shield-checkmark', 
    color: '#3B82F6', 
    content: 'Testing ensures your code performs correctly under varied scenarios, catching regressions early before changes reach production servers.',
    code: '// Laravel is built with testing in mind right out of the box.'
  },
  { 
    id: '2', 
    title: 'PHPUnit & Pest Basics', 
    icon: 'code-working', 
    color: '#10B981', 
    content: 'Laravel projects include Pest or PHPUnit testing frameworks configured via `phpunit.xml` with support for descriptive test suites.',
    code: 'test(\'it has a welcome page\', function () {\n    $response = $this->get(\'/\');\n$response->assertStatus(200);\n});'
  },
  { 
    id: '3', 
    title: 'Feature Tests', 
    icon: 'albums', 
    color: '#8B5CF6', 
    content: 'Feature tests allow you to test larger portions of your code, including HTTP requests, database interactions, authentication, and full user workflows.',
    code: '# Generate a feature test class:\nphp artisan make:test UserRegistrationTest'
  },
  { 
    id: '4', 
    title: 'Unit Tests', 
    icon: 'cube', 
    color: '#F59E0B', 
    content: 'Unit tests focus on very small, isolated parts of your code such as individual model methods or custom utility service classes.',
    code: '# Generate a unit test class:\nphp artisan make:test CalculatorTest --unit'
  },
  { 
    id: '5', 
    title: 'HTTP Tests', 
    icon: 'globe', 
    color: '#06B6D4', 
    content: 'Simulate HTTP requests to your application routes and inspect returned headers, JSON responses, status codes, and rendered views.',
    code: '$response = $this->post(\'/login\', [\n    \'email\' => \'test@example.com\',\n    \'password\' => \'secret\',\n]);\n$response->assertAuthenticated();'
  },
  { 
    id: '6', 
    title: 'Testing Database Operations', 
    icon: 'server', 
    color: '#F97316', 
    content: 'Laravel provides helpful database assertions like `assertDatabaseHas` to confirm records were successfully written during testing.',
    code: '$this->assertDatabaseHas(\'users\', [\n    \'email\' => \'john@example.com\',\n]);'
  },
  { 
    id: '7', 
    title: 'Factories', 
    icon: 'construct', 
    color: '#EF4444', 
    content: 'Model factories allow you to quickly generate fake database records using Faker for your tests and database seeders.',
    code: 'use App\\Models\\User;\n\n// Generate a fake user record in test database\n$user = User::factory()->create();'
  },
  { 
    id: '8', 
    title: 'Testing Authentication', 
    icon: 'key', 
    color: '#6366F1', 
    content: 'Easily authenticate specific user models during tests using the `actingAs` helper method.',
    code: '$user = User::factory()->create();\n\n$response = $this->actingAs($user)\n                 ->get(\'/dashboard\');'
  },
  { 
    id: '9', 
    title: 'Assertions', 
    icon: 'checkmark-circle', 
    color: '#14B8A6', 
    content: 'Laravel test responses provide dozens of custom assertions like `assertRedirect`, `assertSessionHasErrors`, and `assertJsonValidationErrors`.',
    code: '$response->assertSessionHas(\'status\', \'Profile updated!\');'
  },
  { 
    id: '10', 
    title: 'Running Tests', 
    icon: 'play', 
    color: '#EC4899', 
    content: 'Execute your test suite instantly from your terminal using Artisan or Pest command runners.',
    code: '# Run your test suite:\nphp artisan test'
  }
];

const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;
  const regex = /(?:\/\/.*|--.*|#.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null|Attribute|fn|array|test)\b)/g;
  let lastIndex = 0;
  const elements = [];
  let match;

  while ((match = regex.exec(codeText)) !== null) {
    if (match.index > lastIndex) {
      elements.push(<Text key={`text-${lastIndex}`} style={{ color: '#E5E7EB' }}>{codeText.substring(lastIndex, match.index)}</Text>);
    }
    const token = match[0];
    let color = '#E5E7EB'; 
    if (token.startsWith('//') || token.startsWith('--') || token.startsWith('#')) color = '#4ADE80';
    else if (token.startsWith('"') || token.startsWith("'")) color = '#FDE047';
    else if (token.startsWith('$')) color = '#C084FC';
    else color = '#60A5FA';

    elements.push(<Text key={`token-${match.index}`} style={{ color }}>{token}</Text>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < codeText.length) {
    elements.push(<Text key={`text-${lastIndex}`} style={{ color: '#E5E7EB' }}>{codeText.substring(lastIndex)}</Text>);
  }
  return elements;
};

export default function Module24DetailScreen() { 
  const insets = useSafeAreaInsets();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { return () => { Speech.stop(); }; }, []);

  const handleReadAloud = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak("Module 24: Testing. Learn feature tests, unit testing, model factories, and HTTP assertions in Laravel.", { rate: 0.9 });
      lessonContent.forEach((lesson, index) => {
        let topicSpeech = `Topic ${index + 1}: ${lesson.title}. ${lesson.content}`;
        if (lesson.code) topicSpeech += ` Code snippet: ${lesson.code}`;
        const isLastItem = index === lessonContent.length - 1;
        Speech.speak(topicSpeech, {
          rate: 0.9,
          onDone: isLastItem ? () => setIsSpeaking(false) : undefined,
          onStopped: isLastItem ? () => setIsSpeaking(false) : undefined,
          onError: isLastItem ? () => setIsSpeaking(false) : undefined,
        });
      });
    }
  };

  const copyToClipboard = async (text, id) => {
    await Clipboard.setStringAsync(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />
      <View style={{ paddingTop: insets.top }} className="bg-[#FF3B30] rounded-b-[48px] shadow-lg z-20">
        <SafeAreaView>
          <View className="pt-4 pb-10 px-6">
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity onPress={() => { Speech.stop(); router.back(); }} className="w-10 h-10 bg-black/10 rounded-full items-center justify-center">
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 24</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">Testing</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Learn HTTP testing, database assertions, model factories, and authentication simulation.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="shield-checkmark" size={14} color="#DBEAFE" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>
                <TouchableOpacity onPress={handleReadAloud} className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}>
                  <Ionicons name={isSpeaking ? "stop-circle" : "volume-high"} size={14} color={isSpeaking ? "#FF3B30" : "#DBEAFE"} />
                  <Text className={`${isSpeaking ? 'text-[#FF3B30]' : 'text-white'} text-xs font-semibold ml-1.5`}>{isSpeaking ? "Stop Audio" : "Listen"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
      <ScrollView className="flex-1 px-5 pt-8" showsVerticalScrollIndicator={false}>
        {lessonContent.map((lesson, index) => (
          <View key={lesson.id} className="bg-white p-5 mb-6 rounded-3xl border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${lesson.color}15` }}>
                <Ionicons name={lesson.icon} size={20} color={lesson.color} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Topic {index + 1}</Text>
                <Text className="text-gray-800 font-bold text-base">{lesson.title}</Text>
              </View>
            </View>
            <Text className="text-gray-500 text-sm leading-relaxed">{lesson.content}</Text>
            {lesson.code && (
              <View className="bg-gray-800 p-4 rounded-xl mt-4 flex-row items-start justify-between">
                <Text className="font-mono text-xs leading-relaxed flex-1 mr-3">{renderHighlightedCode(lesson.code)}</Text>
                <TouchableOpacity onPress={() => copyToClipboard(lesson.code, lesson.id)} className="bg-white/10 p-2 rounded-lg" disabled={copiedId === lesson.id}>
                  <Ionicons name={copiedId === lesson.id ? "checkmark" : "copy-outline"} size={16} color={copiedId === lesson.id ? "#10B981" : "#9CA3AF"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        <View className="h-12" />
      </ScrollView>
    </View>
  );
}