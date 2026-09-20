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
    title: 'Why API Authentication?', 
    icon: 'shield', 
    color: '#3B82F6', 
    content: 'APIs are stateless and typically accessed by multiple clients (mobile apps, web apps, third parties). Instead of relying on web sessions and cookies, mobile apps require token-based authentication to verify which user is making requests.',
    code: '// Standard Bearer Token header sent from mobile apps:\n// Authorization: Bearer 1|abcdef123456789...'
  },
  { 
    id: '2', 
    title: 'Laravel Sanctum', 
    icon: 'cube', 
    color: '#10B981', 
    content: 'Laravel Sanctum is a featherweight authentication system for SPAs and mobile applications. It allows each user to generate multiple API tokens for their account, which can be granted specific abilities (scopes).',
    code: '# Install Sanctum via composer\nphp artisan breeze:install api\n# or manually install via composer require laravel/sanctum'
  },
  { 
    id: '3', 
    title: 'API Tokens', 
    icon: 'key', 
    color: '#8B5CF6', 
    content: 'Sanctum tokens are plain text strings generated using the `createToken` method on your User model. When a user authenticates successfully, you return this token back to your mobile client to store securely.',
    code: 'use App\\Models\\User;\n\n$user = User::where(\'email\', $request->email)->first();\n\n// Generate a personal access token for the user\n$token = $user->createToken(\'mobile-app-token\')->plainTextToken;'
  },
  { 
    id: '4', 
    title: 'Login API', 
    icon: 'log-in', 
    color: '#F59E0B', 
    content: 'Your authentication login endpoint validates user credentials, ensures the password matches using `Hash::check`, and returns the Sanctum plain-text access token along with user data back to the client.',
    code: 'public function login(Request $request) {\n    $request->validate([\n        \'email\' => \'required|email\',\n        \'password\' => \'required\',\n    ]);\n\n    $user = User::where(\'email\', $request->email)->first();\n\n    if (! $user || ! Hash::check($request->password, $user->password)) {\n        return response()->json([\'message\' => \'Invalid credentials\'], 401);\n    }\n\n    return response()->json([\n        \'token\' => $user->createToken(\'auth_token\')->plainTextToken,\n        \'user\' => $user\n    ]);\n}'
  },
  { 
    id: '5', 
    title: 'Logout API', 
    icon: 'log-out', 
    color: '#06B6D4', 
    content: 'To log a user out from an API endpoint, you delete the current access token that was used to authenticate the incoming request using `$request->user()->currentAccessToken()->delete()`.',
    code: 'public function logout(Request $request) {\n    // Revoke the token that was used to authenticate the current request\n    $request->user()->currentAccessToken()->delete();\n\n    return response()->json([\n        \'message\' => \'Successfully logged out and token revoked.\'\n    ]);\n}'
  },
  { 
    id: '6', 
    title: 'Protected API Routes', 
    icon: 'lock-closed', 
    color: '#F97316', 
    content: 'To protect your API endpoints, assign the `auth:sanctum` middleware to your routes in `routes/api.php`. Incoming requests must include a valid Bearer token in the authorization header.',
    code: '// In routes/api.php:\nRoute::middleware(\'auth:sanctum\')->group(function () {\n    Route::get(\'/user-profile\', function (Request $request) {\n        return $request->user();\n    });\n});'
  },
  { 
    id: '7', 
    title: 'Token Abilities', 
    icon: 'options', 
    color: '#EF4444', 
    content: 'Sanctum allows you to assign abilities (scopes) when creating tokens (e.g., `[\'post:create\']`). You can then check if a token possesses a specific ability within your controllers using `tokenCan`.',
    code: '// Creating token with specific scoped abilities\n$token = $user->createToken(\'token-name\', [\'post:create\'])->plainTextToken;\n\n// Checking abilities inside controller action\nif (! $request->user()->tokenCan(\'post:create\')) {\n    abort(403, \'Unauthorized action scope.\');\n}'
  },
  { 
    id: '8', 
    title: 'React Native + Laravel API', 
    icon: 'phone-portrait', 
    color: '#EC4899', 
    content: 'In your React Native app, store the token using Expo SecureStore, and attach it to every subsequent Axios or Fetch API request inside the Authorization header to communicate securely with your Laravel backend.',
    code: '// React Native Fetch Example with Bearer Token:\nconst response = await fetch(\'https://api.yoursite.com/api/user-profile\', {\n  method: \'GET\',\n  headers: {\n    \'Content-Type\': \'application/json\',\n    \'Authorization\': `Bearer ${storedToken}`\n  }\n});\nconst data = await response.json();'
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

export default function Module17DetailScreen() { 
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
      Speech.speak("Module 17: API Authentication. Learn how to secure your Laravel REST APIs using Laravel Sanctum tokens, handle logins and logouts, and connect your React Native mobile app.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 17</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">API Authentication</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Learn token-based authentication with Laravel Sanctum and how to authenticate requests from mobile apps like React Native.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="shield" size={14} color="#DBEAFE" />
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