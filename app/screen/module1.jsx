import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'What is Laravel?', 
    icon: 'information-circle', 
    color: '#3B82F6', 
    content: 'Laravel is a free, open-source PHP web framework created by Taylor Otwell. It is intended for the development of web applications following the model–view–controller (MVC) architectural pattern. It provides an elegant, expressive syntax that makes web development fast and enjoyable.' 
  },
  { 
    id: '2', 
    title: 'Why Laravel?', 
    icon: 'star', 
    color: '#F59E0B', 
    content: 'Laravel takes the pain out of development by easing common tasks used in the majority of web projects, such as authentication, routing, sessions, and caching. It has a massive ecosystem, excellent documentation, and a friendly community.' 
  },
  { 
    id: '3', 
    title: 'Laravel Requirements', 
    icon: 'list-circle', 
    color: '#8B5CF6', 
    content: 'Before installing Laravel, your server must meet a few requirements. You will need PHP >= 8.1, and several PHP extensions including BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, and XML.' 
  },
  { 
    id: '4', 
    title: 'Installing PHP', 
    icon: 'terminal', 
    color: '#10B981', 
    content: 'You can install PHP locally using tools like XAMPP or MAMP, or use Laravel Herd (for macOS/Windows) which bundles PHP, Composer, and Nginx into a single, seamless application without requiring background services.' 
  },
  { 
    id: '5', 
    title: 'Installing Composer', 
    icon: 'cube', 
    color: '#06B6D4', 
    content: 'Composer is a dependency manager for PHP. Laravel uses Composer to manage its dependencies. You can download and install Composer from getcomposer.org. Once installed, you can run composer commands from your terminal.' 
  },
  { 
    id: '6', 
    title: 'Creating a Laravel Project', 
    icon: 'add-circle', 
    color: '#F97316', 
    content: 'Once Composer is installed, you can create a new Laravel project using the Composer create-project command in your terminal.',
    code: 'composer create-project laravel/laravel example-app'
  },
  { 
    id: '7', 
    title: 'Running a Laravel Application', 
    icon: 'play-circle', 
    color: '#14B8A6', 
    content: 'To start the local development server, navigate into your project directory and use the Artisan CLI serve command. This will host your app at http://localhost:8000.',
    code: 'cd example-app\nphp artisan serve'
  },
  { 
    id: '8', 
    title: 'Laravel Project Structure', 
    icon: 'folder-open', 
    color: '#6366F1', 
    content: 'The default Laravel application structure provides a great starting point. Key folders include:\n• /app: Contains your core application code (Models, Controllers).\n• /routes: Contains all route definitions.\n• /resources: Contains your views (Blade files) and raw assets.\n• /public: The entry point for all requests.' 
  },
  { 
    id: '9', 
    title: 'Understanding the Request Lifecycle', 
    icon: 'git-network', 
    color: '#EC4899', 
    content: 'Every request enters your application through the public/index.php file. From there, it is sent to the HTTP Kernel, which passes it through global middleware. Then, the request is routed to the appropriate Controller or route closure, which returns a response back to the user.' 
  },
];

export default function Module1DetailScreen() { 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null); // Tracks which block was copied

  // Stop speaking if the user navigates away from the screen
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  // Handle Text-to-Speech reading
  const handleReadAloud = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      // Add the red section introduction text first
      const introText = "Module 1: Getting Started. Lay the foundation. Learn what Laravel is, set up your local development environment, and understand how a Laravel application operates under the hood.";
      
      // Combine it with all the topic titles and contents
      const topicsText = lessonContent
        .map(lesson => `${lesson.title}. ${lesson.content}`)
        .join('. Next topic: ');
      
      const textToRead = `${introText}. ${topicsText}`;
      
      setIsSpeaking(true);
      Speech.speak(textToRead, {
        rate: 0.9, 
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  // Handle Copy to Clipboard with temporary checkmark
  const copyToClipboard = async (text, id) => {
    await Clipboard.setStringAsync(text);
    setCopiedId(id); // Set the current block as copied
    
    // Revert back to the copy icon after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />
      
      {/* --- HEADER SECTION --- */}
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
                Module 1
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Getting Started
              </Text>
              <Text className="text-red-100 text-sm leading-relaxed mb-4">
                Lay the foundation. Learn what Laravel is, set up your local development environment, and understand how a Laravel application operates under the hood.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="book" size={14} color="#FECDD3" />
                  <Text className="text-white text-xs font-semibold ml-1.5">Read Mode</Text>
                </View>

                {/* TTS Listen/Stop Button */}
                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#FF3B30" : "#FECDD3"} 
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

      {/* --- CONTENT LIST --- */}
      <ScrollView className="flex-1 px-5 pt-8" showsVerticalScrollIndicator={false}>
        
        {lessonContent.map((lesson, index) => (
          <View 
            key={lesson.id} 
            className="bg-white p-5 mb-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            {/* Topic Header */}
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

            {/* Topic Text Content */}
            <Text className="text-gray-500 text-sm leading-relaxed">
              {lesson.content}
            </Text>

            {/* Optional Code Snippet Block */}
            {lesson.code && (
              <View className="bg-gray-800 p-4 rounded-xl mt-4 flex-row items-start justify-between">
                <Text className="text-green-400 font-mono text-xs leading-relaxed flex-1 mr-3">
                  {lesson.code}
                </Text>
                
                {/* Visual Copy to Clipboard Button */}
                <TouchableOpacity 
                  onPress={() => copyToClipboard(lesson.code, lesson.id)}
                  className="bg-white/10 p-2 rounded-lg"
                  disabled={copiedId === lesson.id} // Prevent spam clicking while copied
                >
                  <Ionicons 
                    name={copiedId === lesson.id ? "checkmark" : "copy-outline"} 
                    size={16} 
                    color={copiedId === lesson.id ? "#10B981" : "#9CA3AF"} // Turns green on copy
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* Bottom Padding */}
        <View className="h-12" />
      </ScrollView>
    </View>
  );
}