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
    title: 'What is Caching?', 
    icon: 'hardware-chip', 
    color: '#3B82F6', 
    content: 'Caching stores heavy database queries or computed responses in fast memory layers like Redis or Memcached so subsequent requests load instantly.',
    code: '// Speed up response times by avoiding heavy database computations'
  },
  { 
    id: '2', 
    title: 'Cache Configuration', 
    icon: 'settings', 
    color: '#10B981', 
    content: 'Cache settings and default drivers are managed in `config/cache.php`, supporting file, database, Redis, and Memcached out of the box.',
    code: '# Configure your default driver in .env:\nCACHE_STORE=redis'
  },
  { 
    id: '3', 
    title: 'Storing Cache', 
    icon: 'save', 
    color: '#8B5CF6', 
    content: 'You can store items in the cache using the Cache facade, passing a unique string key, value data, and an expiration time.',
    code: 'use Illuminate\\Support\\Facades\\Cache;\n\n// Store items for 60 minutes\nCache::put(\'posts.recent\', $posts, minutes: 60);'
  },
  { 
    id: '4', 
    title: 'Retrieving Cache', 
    icon: 'folder-open', 
    color: '#F59E0B', 
    content: 'Retrieve items easily using `Cache::get`. You can also pass a closure callback to compute and store missing values automatically using `remember`.',
    code: '$posts = Cache::remember(\'posts.recent\', 60, function () {\n    return Post::with(\'user\')->get();\n});'
  },
  { 
    id: '5', 
    title: 'Cache Expiration', 
    icon: 'time', 
    color: '#06B6D4', 
    content: 'Control data lifetime with minutes, seconds, or Carbon timestamp instances, or remove items manually using `Cache::forget`.',
    code: '// Remove a specific cache key manually\nCache::forget(\'posts.recent\');\n\n// Flush the entire cache store\nCache::flush();'
  },
  { 
    id: '6', 
    title: 'Cache Drivers', 
    icon: 'server', 
    color: '#F97316', 
    content: 'You can access specific secondary cache stores directly when working with multi-driver applications using the `store` method.',
    code: '// Store data into a specific cache driver instance\nCache::store(\'memcached\')->put(\'key\', \'value\', 600);'
  },
  { 
    id: '7', 
    title: 'Cache Tags', 
    icon: 'pricetags', 
    color: '#EF4444', 
    content: 'Cache tags allow you to tag related items stored in supported drivers (like Redis) so you can flush entire groups of cached items together.',
    code: '// Tag cached records\nCache::tags([\'people\', \'authors\'])->put(\'john\', $john, 600);\n\n// Flush all items associated with the tag\nCache::tags([\'authors\'])->flush();'
  },
  { 
    id: '8', 
    title: 'Application Caching', 
    icon: 'speedometer', 
    color: '#6366F1', 
    content: 'Optimize your entire Laravel application performance in production by caching routes, configuration files, and events via Artisan.',
    code: '# Cache application configurations and routes for speed:\nphp artisan config:cache\nphp artisan route:cache'
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

export default function Module25DetailScreen() { 
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
      Speech.speak("Module 25: Caching. Learn memory cache configuration, retrieving data, expiration handling, cache tags, and application optimization in Laravel.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 25</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">Caching</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Learn store configuration, cache expiration, tag grouping, and application optimization.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="hardware-chip" size={14} color="#DBEAFE" />
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