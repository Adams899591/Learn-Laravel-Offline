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
    title: 'HTML Forms', 
    icon: 'list', 
    color: '#EC4899', 
    content: 'Forms are the primary way users submit data to your application. In Laravel, any form pointing to a POST, PUT, PATCH, or DELETE route must include a hidden CSRF token to protect against cross-site request forgery.',
    code: '<form method="POST" action="/users">\n  @csrf\n  <label>Name:</label>\n  <input type="text" name="name">\n  <button type="submit">Submit</button>\n</form>'
  },
  { 
    id: '2', 
    title: 'Form Requests', 
    icon: 'document-lock', 
    color: '#3B82F6', 
    content: 'For complex validation scenarios, you may create a "Form Request". These are custom request classes that encapsulate their own validation and authorization logic, keeping your controllers clean.',
    code: '// Generate using Artisan\nphp artisan make:request StoreUserRequest\n\n// Inside the generated class:\npublic function rules()\n{\n  return [\n    "name" => "required|string|max:255",\n  ];\n}'
  },
  { 
    id: '3', 
    title: 'Request Data', 
    icon: 'download', 
    color: '#10B981', 
    content: 'The Illuminate\\Http\\Request object provides a variety of methods to examine the incoming HTTP request and retrieve the submitted form data, regardless of which HTTP verb was used.',
    code: '$name = $request->input("name");\n$email = $request->email; // Dynamic property\n$allData = $request->all();\n\n// Check if a value is present\nif ($request->has("name")) { ... }'
  },
  { 
    id: '4', 
    title: 'Validation', 
    icon: 'checkmark-circle', 
    color: '#8B5CF6', 
    content: 'Laravel provides several different approaches to validate your application\'s incoming data. The most common is using the validate method available on all incoming HTTP requests.',
    code: 'public function store(Request $request)\n{\n  $validated =$request->validate([\n    "title" => "required|unique:posts|max:255",\n    "body" => "required",\n  ]);\n\n  // The data is valid, proceed with saving...\n}'
  },
  { 
    id: '5', 
    title: 'Validation Rules', 
    icon: 'options', 
    color: '#FF3B30', 
    content: 'Laravel includes a wide variety of powerful validation rules out of the box. You can check for data types, string lengths, numeric ranges, valid emails, and even check if a value exists in your database.',
    code: '$rules = [\n  "age" => "required|numeric|min:18",\n  "email" => "required|email|unique:users,email",\n  "password" => "required|confirmed|min:8",\n  "website" => "nullable|url",\n];'
  },
  { 
    id: '6', 
    title: 'Custom Validation Messages', 
    icon: 'chatbubble-ellipses', 
    color: '#06B6D4', 
    content: 'If you need to customize the error messages returned by Laravel\'s validator, you can pass an array of custom messages as the second argument to the validate method.',
    code: '$request->validate([\n  "title" => "required|unique:posts"\n], [\n  "title.required" => "A catchy title is required!",\n  "title.unique" => "Oops, that title is already taken.",\n]);'
  },
  { 
    id: '7', 
    title: 'Conditional Validation', 
    icon: 'git-branch', 
    color: '#F59E0B', 
    content: 'Sometimes you may want to require a given field only if another field has a specific value. Laravel provides rules like required_if, required_unless, and exclude_if for this exact purpose.',
    code: '$request->validate([\n  "status" => "required|string",\n  "reason" => "required_if:status,rejected",\n  "credit_card" => "exclude_if:payment_type,cash|required",\n]);'
  },
  { 
    id: '8', 
    title: 'Displaying Validation Errors', 
    icon: 'warning', 
    color: '#EC4899', 
    content: 'When validation fails, Laravel automatically redirects the user back to their previous location and flashes the errors to the session. You can display these using the @error Blade directive.',
    code: '<input type="text" name="email">\n\n@error("email")\n  <div class="alert alert-danger">{{ $message }}</div>\n@enderror'
  },
  { 
    id: '9', 
    title: 'Old Form Input', 
    icon: 'refresh', 
    color: '#14B8A6', 
    content: 'When a user submits a form that fails validation, you should repopulate the form fields so they do not have to retype everything. Blade\'s old() helper makes this incredibly easy.',
    code: '<input type="text" name="username" value="{{ old("username") }}">\n\n// Providing a default fallback value for edit forms\n<input type="text" name="email" value="{{ old("email", $user->email) }}">'
  },
  { 
    id: '10', 
    title: 'File Validation', 
    icon: 'document-attach', 
    color: '#6366F1', 
    content: 'Laravel provides specific validation rules for uploaded files, allowing you to easily restrict file types (MIME types), maximum file sizes, and image dimensions.',
    code: '$request->validate([\n  "avatar" => "required|image|mimes:jpeg,png,jpg,gif|max:2048",\n  "document" => "required|file|mimes:pdf,doc,docx|max:10000",\n]);'
  },
  { 
    id: '11', 
    title: 'Custom Validation Rules', 
    icon: 'build', 
    color: '#3B82F6', 
    content: 'If the built-in rules do not meet your needs, you can easily create your own custom rule classes using Artisan, which gives you complete control over the validation logic.',
    code: '// Generate rule\nphp artisan make:rule Uppercase\n\n// Inside the rule class:\npublic function passes($attribute,$value)\n{\n  return strtoupper($value) ===$value;\n}'
  }
];

// Helper function to syntax highlight the PHP code blocks
const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;

  const regex = /(?:\/\/.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null)\b)/g;

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

    if (token.startsWith('//')) {
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

export default function Module7DetailScreen() { 
  const insets = useSafeAreaInsets();
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

      const introText = "Module 7: Forms and Validation. Learn how to securely handle user input. We will cover HTML forms, extracting request data, applying validation rules, and displaying error messages to the user.";
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
      
      <View style={{ paddingTop: insets.top }} className="bg-[#FF3B30] rounded-b-[48px] shadow-lg z-20">
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
                Module 7
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Forms & Validation
              </Text>
              <Text className="text-pink-100 text-sm leading-relaxed mb-4">
                Learn how to securely handle user input. We will cover HTML forms, extracting request data, applying validation rules, and displaying error messages to the user.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="checkmark-done" size={14} color="#FCE7F3" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#FF3B30" : "#FCE7F3"} 
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