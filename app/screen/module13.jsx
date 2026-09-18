import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'Authentication vs Authorization', 
    icon: 'git-compare', 
    color: '#3B82F6', 
    content: 'While authentication verifies "who" a user is (logging in), authorization determines "what" they are allowed to do. Once a user is authenticated, authorization rules control whether they can view, update, or delete specific resources within your application.',
    code: '// Authentication verifies identity (Who are you?)\nif (Auth::check()) { /* ... */ }\n\n// Authorization verifies permissions (Can you do this?)\nif ($user->can(\'update\',$post)) { /* ... */ }'
  },
  { 
    id: '2', 
    title: 'Gates', 
    icon: 'key', 
    color: '#10B981', 
    content: 'Gates are simple closures that determine if a user is authorized to perform a given action. They are typically defined within the `boot` method of the `App\\Providers\\AuthServiceProvider` class and are great for actions not tied to any model.',
    code: 'use Illuminate\\Support\\Facades\\Gate;\n\n// Defining a Gate in AuthServiceProvider\nGate::define(\'update-setting\', function (User $user) {\n    return$user->is_admin \n        ? Response::allow()\n        : Response::deny(\'You must be an administrator.\');\n});\n\n// Executing the gate\nif (Gate::allows(\'update-setting\')) { /* ... */ }'
  },
  { 
    id: '3', 
    title: 'Policies', 
    icon: 'shield', 
    color: '#8B5CF6', 
    content: 'Policies are classes that organize authorization logic around a particular model or resource. For example, if you have a `Post` model, you should create a corresponding `PostPolicy` to handle authorization for creating, updating, and deleting posts.',
    code: 'namespace App\\Policies;\n\nclass PostPolicy\n{\n    public function update(User $user, Post$post): bool\n    {\n        // Only allow authors to update their own posts\n        return $user->id ===$post->user_id;\n    }\n}'
  },
  { 
    id: '4', 
    title: 'Creating Policies', 
    icon: 'add-circle', 
    color: '#F59E0B', 
    content: 'You can generate policy classes using the Artisan CLI. Laravel can automatically scaffold a policy with stub methods (viewAny, view, create, update, delete, restore, forceDelete) linked directly to your target model.',
    code: '# Generate a standard policy for a Post model\nphp artisan make:policy PostPolicy --model=Post\n\n# Generate an empty policy without model stubs\nphp artisan make:policy Api/V1/DashboardPolicy'
  },
  { 
    id: '5', 
    title: 'Checking Permissions', 
    icon: 'checkmark-circle', 
    color: '#06B6D4', 
    content: 'Laravel provides multiple ways to check authorization throughout your application: using the `Gate` facade, helper methods on the `User` model (`can` / `cant`), Blade directives in views, or controller middleware validation.',
    code: '// 1. Using the User model instance\nif ($request->user()->can(\'update\', $post)) { /* ... */ }\n\n// 2. Using Blade directives in front-end views\n// @can(\'update\',$post)\n//     <button>Edit Post</button>\n// @endcan'
  },
  { 
    id: '6', 
    title: 'Authorizing Controllers', 
    icon: 'server', 
    color: '#F97316', 
    content: 'Controllers can easily leverage policies by calling the `authorize` method inside controller actions. If authorization fails, Laravel automatically throws an AuthorizationException resulting in an HTTP 403 response.',
    code: 'public function update(Request $request, Post $post)\n{\n    // Automatically resolves PostPolicy and checks \'update\' method\n$this->authorize(\'update\', $post);\n\n$post->update($request->validated());\n    return redirect()->route(\'posts.show\',$post);\n}'
  },
  { 
    id: '7', 
    title: 'Roles & Permissions', 
    icon: 'people', 
    color: '#EF4444', 
    content: 'For large-scale applications, you often manage access control through granular Roles and Permissions (e.g., packages like Spatie Laravel Permission). Users are assigned roles, and roles possess collections of specific permissions.',
    code: '// Checking role assignments directly on the user model\nif ($request->user()->hasRole(\'editor\')) {\n    // Allow publishing process...\n}\n\n// Checking fine-grained permission flags\nif ($request->user()->can(\'publish-articles\')) {\n    // Grant publishing access...\n}'
  }
];

// Helper function to syntax highlight the PHP code blocks
const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;

  const regex = /(?:\/\/.*|--.*|#.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null|Attribute|fn|bool)\b)/g;

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

export default function Module13DetailScreen() { 
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

      const introText = "Module 13: Authorization. Learn how to manage user access rights using Laravel Gates, model-based Policies, controller checks, and role-based access control strategies.";
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
                Module 13
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Authorization
              </Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">
                Master access control mechanisms in Laravel using global Gates, resource-specific Policies, controller hooks, and permission management structures.
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