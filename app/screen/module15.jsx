import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'What are Sessions?', 
    icon: 'server', 
    color: '#3B82F6', 
    content: 'HTTP requests are stateless by nature. Sessions allow you to store information about a user across multiple requests by assigning them a secure session cookie, enabling features like shopping carts or login persistence.',
    code: '// Accessing the session instance via request or global helper\nuse Illuminate\\Support\\Facades\\Session;\n\n$value = session()->get(\'key\');'
  },
  { 
    id: '2', 
    title: 'Storing Session Data', 
    icon: 'save', 
    color: '#10B981', 
    content: 'You can store data in the user session using the global `session()` helper, the `Session` facade, or directly on the incoming `Request` instance.',
    code: '// 1. Using request instance\n$request->session()->put(\'user_id\', 42);\n\n// 2. Using the global helper function\nsession([\'cart_count\' => 3]);\n\n// 3. Using the Session facade\nSession::put(\'theme\', \'dark\');'
  },
  { 
    id: '3', 
    title: 'Retrieving Session Data', 
    icon: 'search', 
    color: '#8B5CF6', 
    content: 'To retrieve data, pass the session key. You can also provide a default second parameter that will be returned automatically if the specified key does not exist.',
    code: '// Retrieve with a fallback default value if missing\n$theme = session()->get(\'theme\', \'light\');\n\n// Check if a session key exists\nif ($request->session()->has(\'user_id\')) {\n    // Session variable exists and is not null...\n}'
  },
  { 
    id: '4', 
    title: 'Flash Data', 
    icon: 'flash', 
    color: '#F59E0B', 
    content: 'Flash data allows you to store items in the session for only the very next immediate HTTP request. Once retrieved, the flashed data is automatically deleted—ideal for status or success notification messages.',
    code: '// Flash a status message for the next redirect response\nreturn redirect()->route(\'profile\')\n                 ->with(\'success\', \'Profile updated successfully!\');\n\n// Inside your blade/view:\n// {{ session(\'success\') }}'
  },
  { 
    id: '5', 
    title: 'Removing Session Data', 
    icon: 'trash', 
    color: '#06B6D4', 
    content: 'You can remove specific items by forgetting their keys, clear entire session payloads using `flush`, or regenerate the session ID completely to protect against session fixation attacks.',
    code: '// Forget a specific key\nsession()->forget(\'cart_count\');\n\n// Wipe all session data\nsession()->flush();\n\n// Regenerate session ID (important after login)\n$request->session()->regenerate();'
  },
  { 
    id: '6', 
    title: 'Session Drivers', 
    icon: 'settings', 
    color: '#F97316', 
    content: 'Laravel supports multiple session drivers out of the box. You can store session payloads in files, cookies, databases, or high-performance memory stores like Redis and Memcached.',
    code: '// Configured in config/session.php:\n// \'driver\' => env(\'SESSION_DRIVER\', \'file\'),\n\n// Common options:\n// - file (stored in storage/framework/sessions)\n// - database (stored in a database table)\n// - redis (lightning-fast cache storage)'
  },
  { 
    id: '7', 
    title: 'Session Security', 
    icon: 'shield-checkmark', 
    color: '#EF4444', 
    content: 'Laravel protects your app automatically using encrypted session cookies, HttpOnly flags to prevent cross-site scripting (XSS), and SameSite configurations to defend against cross-site request forgery (CSRF).',
    code: '// Configured in config/session.php:\n\'encrypt\' => true,\n\'http_only\' => true,\n\'same_site\' => \'lax\','
  }
];

const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;
  const regex = /(?:\/\/.*|--.*|#.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null|Attribute|fn)\b)/g;
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

export default function Module15DetailScreen() { 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { return () => { Speech.stop(); }; }, []);

  const handleReadAloud = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak("Module 15: Sessions. Learn how to persist state across HTTP requests using drivers, flash notifications, and secure cookie configurations.", { rate: 0.9 });
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
      <View className="bg-[#FF3B30] rounded-b-[48px] shadow-lg z-20">
        <SafeAreaView>
          <View className="pt-4 pb-10 px-6">
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity onPress={() => { Speech.stop(); router.back(); }} className="w-10 h-10 bg-black/10 rounded-full items-center justify-center">
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 15</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">Sessions</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Learn how Laravel handles state persistence across stateless HTTP requests with robust session drivers and security controls.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="server" size={14} color="#DBEAFE" />
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