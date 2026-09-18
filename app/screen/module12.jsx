import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'What is Authentication?', 
    icon: 'shield-checkmark', 
    color: '#3B82F6', 
    content: 'Authentication is the process of verifying who a user is, whereas authorization determines what actions they are allowed to perform. Laravel makes building secure authentication fast and simple out of the box using built-in guards and providers.',
    code: '// Authentication verifies identity, authorization checks permissions\nif (Auth::check()) {\n  // The user is logged in...\n}'
  },
  { 
    id: '2', 
    title: 'Registration', 
    icon: 'person-add', 
    color: '#10B981', 
    content: 'User registration involves validating incoming user input (like name, email, and password), hashing the password securely, and persisting a new user record into the database.',
    code: 'use App\\Models\\User;\nuse Illuminate\\Support\\Facades\\Hash;\n\n$user = User::create([\n  \'name\' =>$request->name,\n  \'email\' => $request->email,\n  \'password\' => Hash::make($request->password),\n]);'
  },
  { 
    id: '3', 
    title: 'Login', 
    icon: 'log-in', 
    color: '#8B5CF6', 
    content: 'The login process validates user credentials against the database. Laravel\'s `Auth::attempt` method verifies the hashed password and handles session creation securely.',
    code: '$credentials =$request->only(\'email\', \'password\');\n\nif (Auth::attempt($credentials)) {\n$request->session()->regenerate();\n  return redirect()->intended(\'dashboard\');\n}'
  },
  { 
    id: '4', 
    title: 'Logout', 
    icon: 'log-out', 
    color: '#F59E0B', 
    content: 'To log a user out of your application, you need to clear the authentication data from their session and invalidate the active session token to prevent session fixation attacks.',
    code: 'Auth::logout();\n\n$request->session()->invalidate();\n$request->session()->regenerateToken();\n\nreturn redirect(\'/\');'
  },
  { 
    id: '5', 
    title: 'Password Hashing', 
    icon: 'key', 
    color: '#06B6D4', 
    content: 'Laravel provides the `Hash` facade, which uses secure Bcrypt and Argon2 algorithms for hashing user passwords. Never store plain-text passwords in your database.',
    code: 'use Illuminate\\Support\\Facades\\Hash;\n\n// Hash a password\n$hashedPassword = Hash::make(\'plain-text-password\');\n\n// Verify a password against a hash\nif (Hash::check(\'plain-text-password\',$hashedPassword)) {\n  // Passwords match!\n}'
  },
  { 
    id: '6', 
    title: 'Authentication Middleware', 
    icon: 'lock-closed', 
    color: '#F97316', 
    content: 'Middleware acts as a filter for HTTP requests. The `auth` middleware can be assigned to specific routes or route groups to restrict access to authenticated users only.',
    code: '// Protect a single route or group\nRoute::middleware([\'auth\'])->group(function () {\n  Route::get(\'/dashboard\', [DashboardController::class, \'index\']);\n});'
  },
  { 
    id: '7', 
    title: 'Accessing the Authenticated User', 
    icon: 'person', 
    color: '#EF4444', 
    content: 'Once a user is logged in, you can easily access their user instance throughout your application using either the `Auth` facade or the global `auth()` helper function.',
    code: 'use Illuminate\\Support\\Facades\\Auth;\n\n// Using the Auth facade\n$user = Auth::user();\n$userId = Auth::id();\n\n// Using the global helper function\n$email = auth()->user()->email;'
  },
  { 
    id: '8', 
    title: 'Password Reset', 
    icon: 'refresh-circle', 
    color: '#EC4899', 
    content: 'Laravel includes built-in services for handling forgotten passwords. It generates secure tokens, emails secure reset links to users, and updates the password upon verification.',
    code: '// Password reset routes and logic are pre-configured\n// in starter kits like Laravel Breeze or Jetstream.\n// Token validation and hashing are managed automatically.'
  },
  { 
    id: '9', 
    title: 'Email Verification', 
    icon: 'mail-open', 
    color: '#14B8A6', 
    content: 'Email verification requires users to verify ownership of their email address upon registration. Laravel provides the `MustVerifyEmail` interface and built-in verification middleware.',
    code: '// Implement the interface on your User model:\nclass User extends Authenticatable implements MustVerifyEmail\n{\n  // ...\n}\n\n// Protect routes requiring verification:\nRoute::get(\'/profile\', ...)->middleware([\'auth\', \'verified\']);'
  },
  { 
    id: '10', 
    title: 'Authentication Scaffolding', 
    icon: 'apps', 
    color: '#6366F1', 
    content: 'Instead of building authentication from scratch, Laravel offers official starter kits like Laravel Breeze (lightweight Blade or Inertia setup) or Laravel Jetstream (advanced features with teams and two-factor auth).',
    code: '# Install Laravel Breeze via Composer\ncomposer require laravel/breeze --dev\n\n# Run the breeze artisan installation command\nphp artisan breeze:install'
  }
];

// Helper function to syntax highlight the PHP code blocks
const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;

  const regex = /(?:\/\/.*|--.*|#.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null|Attribute|fn)\b)/g;

  let lastIndex = 0;
  const elements = [];
  let match;

  while ((match = regex.exec(codeText)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <Text key={`text-${lastIndex}`} style={{ color: '#E5E7EB' }}>
          {codeText.substring(lastIndex, match.index)}
        </Text>
      );
    }

    const token = match[0];
    let color = '#E5E7EB'; 

    if (token.startsWith('//') || token.startsWith('--') || token.startsWith('#')) {
      color = '#4ADE80'; // Green comments
    } else if (token.startsWith('"') || token.startsWith("'")) {
      color = '#FDE047'; // Yellow strings
    } else if (token.startsWith('$')) {
      color = '#C084FC'; // Purple variables
    } else {
      color = '#60A5FA'; // Blue keywords
    }

    elements.push(
      <Text key={`token-${match.index}`} style={{ color }}>
        {token}
      </Text>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < codeText.length) {
    elements.push(
      <Text key={`text-${lastIndex}`} style={{ color: '#E5E7EB' }}>
        {codeText.substring(lastIndex)}
      </Text>
    );
  }

  return elements;
};

export default function Module12DetailScreen() { 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleReadAloud = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);

      const introText = "Module 12: Authentication. Learn how to secure your Laravel application with user registration, login, session management, password hashing, and authentication middleware.";
      Speech.speak(introText, { rate: 0.9 });

      lessonContent.forEach((lesson, index) => {
        let topicSpeech = `Topic ${index + 1}: ${lesson.title}. ${lesson.content}`;
        
        if (lesson.code) {
          topicSpeech += ` Code snippet: ${lesson.code}`;
        }

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

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />
      
      <View className="bg-[#FF3B30] rounded-b-[48px] shadow-lg z-20">
        <SafeAreaView>
          <View className="pt-4 pb-10 px-6">
            
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity 
                onPress={() => {
                  Speech.stop(); 
                  router.back();
                }} 
                className="w-10 h-10 bg-black/10 rounded-full items-center justify-center"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                Module 12
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Authentication
              </Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">
                Learn how to secure your application with user registration, login sessions, password hashing, middleware protection, and scaffolding kits.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="shield-checkmark" size={14} color="#DBEAFE" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#FF3B30" : "#DBEAFE"} 
                  />
                  <Text className={`${isSpeaking ? 'text-[#FF3B30]' : 'text-white'} text-xs font-semibold ml-1.5`}>
                    {isSpeaking ? "Stop Audio" : "Listen"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </SafeAreaView>
      </View>

      <ScrollView className="flex-1 px-5 pt-8" showsVerticalScrollIndicator={false}>
        
        {lessonContent.map((lesson, index) => (
          <View 
            key={lesson.id} 
            className="bg-white p-5 mb-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${lesson.color}15` }}>
                <Ionicons name={lesson.icon} size={20} color={lesson.color} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Topic {index + 1}
                </Text>
                <Text className="text-gray-800 font-bold text-base">
                  {lesson.title}
                </Text>
              </View>
            </View>

            <Text className="text-gray-500 text-sm leading-relaxed">
              {lesson.content}
            </Text>

            {lesson.code && (
              <View className="bg-gray-800 p-4 rounded-xl mt-4 flex-row items-start justify-between">
                
                <Text className="font-mono text-xs leading-relaxed flex-1 mr-3">
                  {renderHighlightedCode(lesson.code)}
                </Text>
                
                <TouchableOpacity 
                  onPress={() => copyToClipboard(lesson.code, lesson.id)}
                  className="bg-white/10 p-2 rounded-lg"
                  disabled={copiedId === lesson.id} 
                >
                  <Ionicons 
                    name={copiedId === lesson.id ? "checkmark" : "copy-outline"} 
                    size={16} 
                    color={copiedId === lesson.id ? "#10B981" : "#9CA3AF"} 
                  />
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