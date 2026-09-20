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
    title: 'What is Task Scheduling?', 
    icon: 'calendar', 
    color: '#3B82F6', 
    content: 'Laravel’s command scheduler offers a fresh approach to managing scheduled tasks on your server, allowing you to define a single cron entry.',
    code: '# Add this single cron entry on your server:\n* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1'
  },
  { 
    id: '2', 
    title: 'Creating Scheduled Tasks', 
    icon: 'create', 
    color: '#10B981', 
    content: 'All scheduled tasks are configured inside the `routes/console.php` file or the `schedule` method of your application `Kernel` class.',
    code: 'use Illuminate\\Support\\Facades\\Schedule;\n\nSchedule::call(function () {\n    DB::table(\'recent_users\')->delete();\n})->daily();'
  },
  { 
    id: '3', 
    title: 'Scheduling Commands', 
    icon: 'terminal', 
    color: '#8B5CF6', 
    content: 'You can schedule Artisan console commands to run automatically at custom frequency intervals with zero friction.',
    code: 'Schedule::command(\'emails:send\')->hourly();'
  },
  { 
    id: '4', 
    title: 'Scheduling Jobs', 
    icon: 'layers', 
    color: '#F59E0B', 
    content: 'Queued jobs can also be directly dispatched on a repeating schedule using the `Schedule::job` builder method.',
    code: 'use App\\Jobs\\HeartbeatJob;\n\nSchedule::job(new HeartbeatJob)->everyTenMinutes();'
  },
  { 
    id: '5', 
    title: 'Scheduling Frequency', 
    icon: 'time', 
    color: '#06B6D4', 
    content: 'Laravel provides a rich set of fluent frequency methods like `everyMinute`, `weeklyOn`, `mondays`, and custom cron expressions.',
    code: 'Schedule::command(\'reports:generate\')\n         ->fridays()\n         ->at(\'17:00\');'
  },
  { 
    id: '6', 
    title: 'Preventing Overlapping Tasks', 
    icon: 'lock-closed', 
    color: '#F97316', 
    content: 'Use the `withoutOverlapping` method to prevent long-running scheduled tasks from executing simultaneously if a previous instance is still running.',
    code: 'Schedule::command(\'import:feed\')\n         ->hourly()\n         ->withoutOverlapping();'
  },
  { 
    id: '7', 
    title: 'Running the Scheduler', 
    icon: 'play-circle', 
    color: '#EF4444', 
    content: 'You can test your scheduled tasks locally using the Artisan CLI command to verify intervals and outputs.',
    code: '# Run scheduled tasks manually for testing:\nphp artisan schedule:work'
  }
];

const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;
  const regex = /(?:\/\/.*|--.*|#.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null|Attribute|fn|array)\b)/g;
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

export default function Module23DetailScreen() { 
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
      Speech.speak("Module 23: Task Scheduling. Learn server cron management, fluent frequency intervals, and overlapping task protection in Laravel.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 23</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">Task Scheduling</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Learn fluent cron scheduling, Artisan commands automation, and overlapping protections.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="calendar" size={14} color="#DBEAFE" />
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