import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'What is Blade?', 
    icon: 'code-working', 
    color: '#F97316', 
    content: 'Blade is the simple, yet powerful templating engine that is included with Laravel. Unlike other PHP templating engines, Blade does not restrict you from using plain PHP code in your views. All Blade views are compiled into plain PHP code and cached.',
    code: '// A simple Blade view\n<h1>Hello, {{ $name }}</h1>'
  },
  { 
    id: '2', 
    title: 'Creating Blade Views', 
    icon: 'document-text', 
    color: '#3B82F6', 
    content: 'Views contain the HTML served by your application. They are stored in the resources/views directory and must have a .blade.php file extension to use Blade features.',
    code: '// File: resources/views/welcome.blade.php\n<html>\n  <body>\n    <h1>Welcome to Laravel!</h1>\n  </body>\n</html>'
  },
  { 
    id: '3', 
    title: 'Displaying Data', 
    icon: 'tv', 
    color: '#10B981', 
    content: 'You may display data passed to your Blade views by wrapping the variable in double curly braces. Blade automatically passes this data through PHP\'s htmlspecialchars function to prevent XSS attacks.',
    code: 'Route::get("/", function () {\n  return view("welcome", ["name" => "Samantha"]);\n});\n\n// Inside welcome.blade.php:\nHello, {{ $name }}.'
  },
  { 
    id: '4', 
    title: 'Blade Expressions', 
    icon: 'calculator', 
    color: '#8B5CF6', 
    content: 'You can put any PHP code inside Blade\'s double curly braces. If you need to display raw, unescaped HTML, you use the {!! !!} syntax instead.',
    code: '// Standard echo (escaped)\nThe current time is {{ time() }}.\n\n// Unescaped HTML (use with caution!)\n{!! $htmlContent !!}'
  },
  { 
    id: '5', 
    title: 'Conditional Statements', 
    icon: 'git-branch', 
    color: '#FF3B30', 
    content: 'Blade provides convenient directives for PHP conditional statements. These include @if, @elseif, @else, and @endif, making your templates clean and highly readable.',
    code: '@if (count($records) === 1)\n  I have one record!\n@elseif (count($records) > 1)\n  I have multiple records!\n@else\n  I don\'t have any records!\n@endif'
  },
  { 
    id: '6', 
    title: 'Loops', 
    icon: 'sync', 
    color: '#06B6D4', 
    content: 'Blade offers simple directives for working with PHP loop structures, like @for, @foreach, and @while. The @forelse directive is incredibly useful as it includes a built-in fallback for empty arrays.',
    code: '@forelse ($users as $user)\n  <li>{{$user->name }}</li>\n@empty\n  <p>No users found.</p>\n@endforelse'
  },
  { 
    id: '7', 
    title: 'Layouts', 
    icon: 'grid', 
    color: '#F59E0B', 
    content: 'Most web applications maintain the same general layout across pages (like headers and footers). Blade allows you to define this master layout in a single file to keep your code DRY (Don\'t Repeat Yourself).',
    code: '// File: resources/views/layouts/app.blade.php\n<html>\n  <head><title>App Name</title></head>\n  <body>\n    @yield("content")\n  </body>\n</html>'
  },
  { 
    id: '8', 
    title: 'Template Inheritance', 
    icon: 'copy', 
    color: '#EC4899', 
    content: 'Child pages can "extend" a layout. They use the @section directive to inject content into the specific @yield markers defined by the master layout.',
    code: '// File: resources/views/home.blade.php\n@extends("layouts.app")\n\n@section("content")\n  <h1>Welcome Home</h1>\n  <p>This goes into the yield marker.</p>\n@endsection'
  },
  { 
    id: '9', 
    title: 'Includes', 
    icon: 'download', 
    color: '#14B8A6', 
    content: 'Blade\'s @include directive allows you to include a Blade view from within another view. All variables available to the parent view are automatically available to the included view.',
    code: '<div>\n  @include("shared.errors")\n  <form>\n    <!-- Form contents -->\n  </form>\n</div>\n\n// You can also pass extra data:\n@include("view.name", ["status" => "complete"])'
  },
  { 
    id: '10', 
    title: 'Blade Components', 
    icon: 'cube', 
    color: '#6366F1', 
    content: 'Components and slots provide similar benefits to layouts and includes but feature an HTML-like syntax. They are excellent for building reusable UI elements like buttons or modals.',
    code: '// resources/views/components/alert.blade.php\n<div class="alert alert-{{ $type }}">\n  {{ $slot }}\n</div>\n\n// Usage in another view:\n<x-alert type="danger">\n  <strong>Whoops!</strong> Something went wrong.\n</x-alert>'
  },
  { 
    id: '11', 
    title: 'Slots', 
    icon: 'layers', 
    color: '#3B82F6', 
    content: 'The $slot variable is a special variable injected into components that contains the content placed inside the component tags. You can also define named slots for multiple injection points.',
    code: '// Usage with named slot:\n<x-modal>\n  <x-slot:title>\n    Server Error\n  </x-slot>\n\n  This is the main slot content.\n</x-modal>'
  },
  { 
    id: '12', 
    title: 'Forms in Blade', 
    icon: 'list', 
    color: '#10B981', 
    content: 'When writing HTML forms, HTML only natively supports GET and POST. Blade provides the @method directive to spoof PUT, PATCH, or DELETE requests for your routes.',
    code: '<form action="/users/{{ $user->id }}" method="POST">\n  @method("PUT")\n  @csrf\n  \n  <input type="text" name="name">\n  <button type="submit">Update</button>\n</form>'
  },
  { 
    id: '13', 
    title: 'CSRF Protection', 
    icon: 'shield-checkmark', 
    color: '#FF3B30', 
    content: 'Laravel makes it easy to protect your application from cross-site request forgery (CSRF) attacks. Anytime you define an HTML form, you must include a hidden CSRF token field using @csrf.',
    code: '<form method="POST" action="/profile">\n  @csrf\n  <!-- Equivalent to: -->\n  <!-- <input type="hidden" name="_token" value="abc123xyz..."> -->\n</form>'
  },
  { 
    id: '14', 
    title: 'Blade Directives', 
    icon: 'flash', 
    color: '#F59E0B', 
    content: 'Blade provides many convenient, built-in directives. For example, @auth and @guest quickly check authentication status. You can even define your own custom directives in a Service Provider.',
    code: '@auth\n  // The user is authenticated...\n  <a href="/logout">Logout</a>\n@endauth\n\n@guest\n  // The user is not authenticated...\n  <a href="/login">Login</a>\n@endguest'
  },
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

export default function Module6DetailScreen() { 
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

      const introText = "Module 6: Views and Blade. Master Laravel's powerful templating engine. We will cover creating views, displaying data, template inheritance, loops, and building reusable Blade components.";
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
                Module 6
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Views & Blade
              </Text>
              <Text className="text-orange-100 text-sm leading-relaxed mb-4">
                Master Laravel's powerful templating engine. We will cover creating views, displaying data, template inheritance, conditional rendering, loops, and building reusable Blade components.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="tv" size={14} color="#FFEDD5" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#FF3B30" : "#FFEDD5"} 
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