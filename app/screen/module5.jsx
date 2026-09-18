import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'What is a Controller?', 
    icon: 'cube', 
    color: '#8B5CF6', 
    content: 'Controllers group related request handling logic into a single class. Instead of defining all your request logic as closures in route files, you can organize this behavior using Controller classes.',
    code: 'namespace App\\Http\\Controllers;\n\nclass UserController extends Controller\n{\n  // Controller logic goes here\n}'
  },
  { 
    id: '2', 
    title: 'Creating Controllers', 
    icon: 'terminal', 
    color: '#10B981', 
    content: 'You can quickly generate a new controller using the Artisan CLI. By default, all controllers are stored in the app/Http/Controllers directory.',
    code: '// Generate a basic controller\nphp artisan make:controller UserController\n\n// Generate a resource controller (includes CRUD methods)\nphp artisan make:controller PostController --resource'
  },
  { 
    id: '3', 
    title: 'Controller Methods', 
    icon: 'code-slash', 
    color: '#3B82F6', 
    content: 'Controllers contain methods (often called actions) that map to specific routes. These methods handle the incoming request, interact with databases/models, and return a response.',
    code: 'public function show($id)\n{\n  $user = User::findOrFail($id);\n  return view("user.profile", ["user" => $user]);\n}'
  },
  { 
    id: '4', 
    title: 'Returning Responses', 
    icon: 'return-up-back', 
    color: '#F59E0B', 
    content: 'Every controller method should return a response. This can be a simple string, a full Blade view, a JSON response for APIs, or a redirect to another URL.',
    code: '// JSON response\nreturn response()->json(["name" => "Abigail", "state" => "CA"]);\n\n// Redirect response\nreturn redirect()->route("home");'
  },
  { 
    id: '5', 
    title: 'Passing Data to Views', 
    icon: 'tv', 
    color: '#EC4899', 
    content: 'To display dynamic data, you can pass an array of data to the view helper. The keys of the array become variables accessible within your Blade template.',
    code: 'public function index()\n{\n  $title = "Dashboard";\n  $users = User::all();\n\n  // Passing data using an array\n  return view("dashboard", ["title" => $title, "users" => $users]);\n  \n  // Or using the compact() helper\n  // return view("dashboard", compact("title", "users"));\n}'
  },
  { 
    id: '6', 
    title: 'Request Injection', 
    icon: 'download', 
    color: '#06B6D4', 
    content: 'You can type-hint the Illuminate\\Http\\Request class on your controller methods. The current incoming request instance will automatically be injected by the Laravel service container.',
    code: 'use Illuminate\\Http\\Request;\n\npublic function store(Request $request)\n{\n  $name =$request->input("name");\n  $email =$request->email; // accessing as dynamic property\n\n  // Save to database logic...\n}'
  },
  { 
    id: '7', 
    title: 'Dependency Injection', 
    icon: 'git-network', 
    color: '#F97316', 
    content: 'Besides the Request object, you can type-hint any class your controller needs in its constructor or methods. The container will automatically resolve and inject them.',
    code: 'use App\\Services\\PaymentService;\n\npublic function charge(PaymentService $payment)\n{\n  // $payment is automatically instantiated and passed in\n$payment->process(100);\n}'
  },
  { 
    id: '8', 
    title: 'Resource Controllers', 
    icon: 'layers', 
    color: '#14B8A6', 
    content: 'If you assign CRUD routes to a controller using Route::resource, Artisan can generate a controller that already has all the corresponding methods (index, create, store, show, edit, update, destroy).',
    code: 'class PhotoController extends Controller\n{\n  public function index() { /* Show all */ }\n  public function store(Request $request) { /* Save new */ }\n  public function destroy($id) { /* Delete */ }\n  // ... other resource methods\n}'
  },
  { 
    id: '9', 
    title: 'Single-Action Controllers', 
    icon: 'flash', 
    color: '#FF3B30', 
    content: 'If a controller action is particularly complex, you might find it convenient to dedicate an entire controller class to that single action by using the __invoke method.',
    code: 'class ProvisionServer extends Controller\n{\n  public function __invoke(Request $request)\n  {\n    // Logic to provision the server\n  }\n}\n\n// Route definition:\n// Route::post("/server", ProvisionServer::class);'
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

export default function Module5DetailScreen() { 
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

      const introText = "Module 5: Laravel Controllers. Learn how to group related request handling logic into controller classes. We will cover creating controllers, returning responses, request injection, and single-action controllers.";
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
                Module 5
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Laravel Controllers
              </Text>
              <Text className="text-violet-100 text-sm leading-relaxed mb-4">
                Learn how to group related request handling logic into controller classes. We will cover creating controllers, returning responses, request injection, and single-action controllers.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="cube" size={14} color="#DDD6FE" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#8B5CF6" : "#DDD6FE"} 
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