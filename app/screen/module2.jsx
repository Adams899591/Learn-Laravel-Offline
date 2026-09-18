import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'Variables', 
    icon: 'code-slash', 
    color: '#3B82F6', 
    content: 'In PHP, a variable starts with the $ sign, followed by the name of the variable. PHP is a loosely typed language, meaning you do not have to declare the data type of the variable.',
    code: '$name = "Artisan";\n$age = 25;'
  },
  { 
    id: '2', 
    title: 'Data Types', 
    icon: 'layers', 
    color: '#8B5CF6', 
    content: 'PHP supports several data types: String, Integer, Float (floating point numbers), Boolean, Array, Object, NULL, and Resource. The data type is determined automatically based on the value.',
    code: '$is_admin = true;   // Boolean\n$price = 19.99;     // Float'
  },
  { 
    id: '3', 
    title: 'Strings', 
    icon: 'text', 
    color: '#F59E0B', 
    content: 'A string is a sequence of characters. You can use single or double quotes. Double quotes allow for variable interpolation (inserting variable values directly into the string).',
    code: 'echo "Hello, {$name}!";\n// Or concatenation\necho \'Hello, \' . $name;'
  },
  { 
    id: '4', 
    title: 'Arrays', 
    icon: 'list', 
    color: '#10B981', 
    content: 'An array stores multiple values in one single variable. An indexed array assigns a numeric index to each value automatically, starting at 0.',
    code: '$colors = ["Red", "Green", "Blue"];\necho $colors[0]; // Outputs: Red'
  },
  { 
    id: '5', 
    title: 'Associative Arrays', 
    icon: 'key', 
    color: '#06B6D4', 
    content: 'Associative arrays use named keys that you assign to them, rather than numeric indexes. This is highly useful for structuring related data, much like JSON objects.',
    code: '$user = [\n  "name" => "Alice",\n  "role" => "Admin"\n];\necho $user["name"];'
  },
  { 
    id: '6', 
    title: 'Conditions', 
    icon: 'git-branch', 
    color: '#EF4444', 
    content: 'Conditional statements are used to perform different actions based on different conditions. PHP supports if, else, elseif, and switch statements.',
    code: 'if ($age >= 18) {\n  echo "Adult";\n} else {\n  echo "Minor";\n}'
  },
  { 
    id: '7', 
    title: 'Loops', 
    icon: 'sync', 
    color: '#F97316', 
    content: 'Loops execute a block of code a specified number of times, or while a specified condition is true. The foreach loop is specifically designed for iterating over arrays.',
    code: 'foreach ($colors as $color) {\n  echo$color . "\\n";\n}'
  },
  { 
    id: '8', 
    title: 'Functions', 
    icon: 'cog', 
    color: '#14B8A6', 
    content: 'A function is a block of statements that can be used repeatedly in a program. It will not execute automatically when a page loads; it must be called.',
    code: 'function greet($name) {\n  return "Welcome, " . $name;\n}\necho greet("Taylor");'
  },
  { 
    id: '9', 
    title: 'Classes & Objects', 
    icon: 'cube', 
    color: '#6366F1', 
    content: 'Classes are blueprints for objects. An object is an instance of a class. Object-Oriented Programming (OOP) is crucial for understanding how Laravel is built.',
    code: 'class User {\n  public $name;\n}\n\n$user1 = new User();\n$user1->name = "Bob";'
  },
  { 
    id: '10', 
    title: 'Constructors', 
    icon: 'build', 
    color: '#EC4899', 
    content: 'A constructor allows you to initialize an object\'s properties upon creation. In PHP, the constructor method is always named __construct().',
    code: 'class Car {\n  public function __construct($brand) {\n    $this->brand =$brand;\n  }\n}'
  },
  { 
    id: '11', 
    title: 'Inheritance', 
    icon: 'git-network', 
    color: '#3B82F6', 
    content: 'Inheritance allows a class to inherit the public and protected properties and methods from another class. This is done using the "extends" keyword.',
    code: 'class Admin extends User {\n  public function deleteUser() {\n    // Admin specific method\n  }\n}'
  },
  { 
    id: '12', 
    title: 'Interfaces', 
    icon: 'link', 
    color: '#8B5CF6', 
    content: 'Interfaces specify what methods a class should implement. They make it easy to use a variety of different classes in the same way. You use the "implements" keyword.',
    code: 'interface Logger {\n  public function log($message);\n}\n\nclass FileLogger implements Logger { ... }'
  },
  { 
    id: '13', 
    title: 'Traits', 
    icon: 'copy', 
    color: '#F59E0B', 
    content: 'PHP only supports single inheritance. Traits are a mechanism for code reuse in single inheritance languages. You include a trait inside a class using the "use" keyword.',
    code: 'trait Searchable {\n  public function search() { /* ... */ }\n}\n\nclass Product {\n  use Searchable;\n}'
  },
  { 
    id: '14', 
    title: 'Namespaces', 
    icon: 'folder-open', 
    color: '#10B981', 
    content: 'Namespaces are qualifiers that solve two problems: they allow for better organization by grouping related classes, and they prevent name collisions between your classes and third-party classes.',
    code: 'namespace App\\Models;\n\nclass User {\n  // This is now App\\Models\\User\n}'
  },
  { 
    id: '15', 
    title: 'Exceptions', 
    icon: 'alert-circle', 
    color: '#EF4444', 
    content: 'Exceptions are used to change the normal flow of a script if a specified error occurs. You throw an exception and catch it using a try...catch block.',
    code: 'try {\n  throw new Exception("File not found");\n} catch (Exception $e) {\n  echo$e->getMessage();\n}'
  },
  { 
    id: '16', 
    title: 'Composer & Packages', 
    icon: 'download', 
    color: '#06B6D4', 
    content: 'Composer is the dependency manager for PHP. It allows you to declare the libraries your project depends on and it will manage (install/update) them for you. It is the backbone of Laravel.',
    code: 'composer require guzzlehttp/guzzle'
  },
];

// Helper function to syntax highlight the PHP code blocks
const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;

  // Regex matches Comments, Strings, Variables, and Keywords in that order
  const regex = /(?:\/\/.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false)\b)/g;

  let lastIndex = 0;
  const elements = [];
  let match;

  while ((match = regex.exec(codeText)) !== null) {
    // Push default colored text (like brackets, semicolons, plain text)
    if (match.index > lastIndex) {
      elements.push(
        <Text key={`text-${lastIndex}`} style={{ color: '#E5E7EB' }}>
          {codeText.substring(lastIndex, match.index)}
        </Text>
      );
    }

    const token = match[0];
    let color = '#E5E7EB'; // Default off-white

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

  // Push any remaining text
  if (lastIndex < codeText.length) {
    elements.push(
      <Text key={`text-${lastIndex}`} style={{ color: '#E5E7EB' }}>
        {codeText.substring(lastIndex)}
      </Text>
    );
  }

  return elements;
};

export default function Module2DetailScreen() { 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Clean up speech when leaving the screen
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

      // 1. Queue the introduction first
      const introText = "Module 2: PHP Fundamentals. Master the core concepts of PHP. From basic syntax and data types to advanced Object-Oriented Programming and package management.";
      Speech.speak(introText, { rate: 0.9 });

      // 2. Loop through the array and queue each topic individually (prevents crashes from text being too long)
      lessonContent.forEach((lesson, index) => {
        let topicSpeech = `Topic ${index + 1}: ${lesson.title}. ${lesson.content}`;
        
        // Add code to the speech chunk if it exists
        if (lesson.code) {
          topicSpeech += ` Code snippet: ${lesson.code}`;
        }

        // Check if this is the very last item in the array to turn off the "Stop Audio" button when done
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
    // Silently copy to clipboard without interrupting speech
    await Clipboard.setStringAsync(text);
    setCopiedId(id); 

    // Reset checkmark after 2 seconds
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
                Module 2
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                PHP Fundamentals
              </Text>
              <Text className="text-red-100 text-sm leading-relaxed mb-4">
                Master the core concepts of PHP. From basic syntax and data types to advanced Object-Oriented Programming (OOP) and package management.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="code-slash" size={14} color="#FECDD3" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

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
                
                {/* Updated this Text block to use the renderHighlightedCode helper function */}
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