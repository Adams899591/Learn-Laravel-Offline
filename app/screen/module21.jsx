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
    title: 'What are Queues?', 
    icon: 'layers', 
    color: '#3B82F6', 
    content: 'Queues allow you to defer time-consuming tasks, such as sending emails or processing heavy uploads, until a later time, drastically speeding up web requests for your users.',
    code: '// Configure queue drivers in your environment file:\nQUEUE_CONNECTION=database\n# or redis, sqs, sync'
  },
  { 
    id: '2', 
    title: 'Creating Jobs', 
    icon: 'create', 
    color: '#10B981', 
    content: 'Job classes encapsulate the logic required to run a background task. They are typically stored in the `app/Jobs` directory and use the `Queueable` trait.',
    code: '# Generate a new job via Artisan:\nphp artisan make:job ProcessPodcast'
  },
  { 
    id: '3', 
    title: 'Dispatching Jobs', 
    icon: 'paper-plane', 
    color: '#8B5CF6', 
    content: 'You can push a job onto the queue using the `dispatch` method, passing any required data models or parameters into the job constructor.',
    code: 'use App\\Jobs\\ProcessPodcast;\n\n// Dispatch job to the queue stack\nProcessPodcast::dispatch($podcast);'
  },
  { 
    id: '4', 
    title: 'Queue Connections', 
    icon: 'git-network', 
    color: '#F59E0B', 
    content: 'Laravel supports multiple backends through configuration files in `config/queue.php`, allowing seamless switching between database, Redis, SQS, or synchronous execution.',
    code: '// Dispatch a job to a specific named queue connection\nProcessPodcast::dispatch($podcast)->onConnection(\'redis\');'
  },
  { 
    id: '5', 
    title: 'Queue Workers', 
    icon: 'construct', 
    color: '#06B6D4', 
    content: 'Workers are background daemon processes that continuously poll your queue connection for new pending jobs and execute them sequentially.',
    code: '# Run a worker to process queued jobs\nphp artisan queue:work\n\n# Or run a worker that restarts when code changes\nphp artisan queue:listen'
  },
  { 
    id: '6', 
    title: 'Delayed Jobs', 
    icon: 'time', 
    color: '#F97316', 
    content: 'You can delay the execution of a dispatched job by chaining the `delay` method, specifying an exact carbon timestamp or a number of seconds.',
    code: 'use Carbon\\Carbon;\n\n// Delay job execution by 10 minutes\nProcessPodcast::dispatch($podcast)\n                ->delay(now()->addMinutes(10));'
  },
  { 
    id: '7', 
    title: 'Failed Jobs', 
    icon: 'alert-circle', 
    color: '#EF4444', 
    content: 'When jobs exceed their maximum exception retry limits, they are moved to a `failed_jobs` database table so you can inspect and debug them.',
    code: '# Create the failed jobs table migration\nphp artisan queue:failed-table\nphp artisan migrate\n\n# List all failed jobs\nphp artisan queue:failed'
  },
  { 
    id: '8', 
    title: 'Retrying Jobs', 
    icon: 'refresh', 
    color: '#6366F1', 
    content: 'You can easily retry failed jobs manually via terminal commands or automatically configure retry thresholds inside your job class properties.',
    code: '# Retry a specific failed job identifier\nphp artisan queue:retry 5\n\n# Retry all failed jobs\nphp artisan queue:retry all'
  },
  { 
    id: '9', 
    title: 'Job Batching', 
    icon: 'grid', 
    color: '#14B8A6', 
    content: 'Laravel job batching allows you to execute a block of multiple jobs simultaneously and perform callback actions when the entire batch completes execution.',
    code: 'use Illuminate\\Support\\Facades\\Bus;\n\n$batch = Bus::batch([\n    new ImportCsv($file1),\n    new ImportCsv($file2),\n])->dispatch();'
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

export default function Module21DetailScreen() { 
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
      Speech.speak("Module 21: Queues and Jobs. Learn how to defer time-consuming tasks, dispatch background jobs, and manage queue workers in Laravel.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 21</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">Queues & Jobs</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Learn asynchronous job dispatching, worker daemons, delayed executions, and job batching.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="layers" size={14} color="#DBEAFE" />
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