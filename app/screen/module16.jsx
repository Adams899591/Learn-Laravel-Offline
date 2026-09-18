import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'What is an API?', 
    icon: 'globe', 
    color: '#3B82F6', 
    content: 'An Application Programming Interface (API) allows different software systems (like a React Native mobile app or Vue frontend) to communicate with your Laravel backend using standard JSON payloads over HTTP.',
    code: '// APIs decouple your database and business logic\n// from the user interface presentation layer.'
  },
  { 
    id: '2', 
    title: 'API Routes', 
    icon: 'git-network', 
    color: '#10B981', 
    content: 'Laravel stores API route definitions inside `routes/api.php`. These routes are automatically stateless, wrapped under the `api` middleware group, and typically prefixed with `/api` by default.',
    code: 'use App\\Http\\Controllers\\Api\\UserController;\n\n// Automatically prefixed with /api\nRoute::get(\'/users\', [UserController::class, \'index\']);'
  },
  { 
    id: '3', 
    title: 'API Controllers', 
    icon: 'server', 
    color: '#8B5CF6', 
    content: 'API controllers handle incoming JSON requests and return serialized data structures instead of rendering HTML blade templates. You can generate them with the `--api` flag to omit create/edit view methods.',
    code: '# Generate an API controller without create/edit methods\nphp artisan make:controller Api/V1/PostController --api'
  },
  { 
    id: '4', 
    title: 'JSON Responses', 
    icon: 'code-slash', 
    color: '#F59E0B', 
    content: 'Laravel controllers can return arrays or Eloquent models directly. Laravel automatically converts them into properly formatted JSON HTTP responses with `application/json` headers.',
    code: 'public function show(User $user)\n{\n    // Automatically converted to a JSON response\n    return response()->json([\n        \'status\' => \'success\',\n        \'data\' =>$user\n    ], 200);\n}'
  },
  { 
    id: '5', 
    title: 'Request Data', 
    icon: 'download', 
    color: '#06B6D4', 
    content: 'When clients send JSON payloads via POST, PUT, or PATCH requests, you can access the input data cleanly using the `Request` injection parameter.',
    code: 'public function store(Request $request)\n{\n$name = $request->input(\'name\');\n$email = $request->json(\'email\'); // Access raw JSON payload\n\n    return User::create($request->all());\n}'
  },
  { 
    id: '6', 
    title: 'API Validation', 
    icon: 'shield-checkmark', 
    color: '#F97316', 
    content: 'If API validation fails, Laravel automatically throws a validation exception and returns a standard JSON response containing error fields with an HTTP 422 Unprocessable Entity status code.',
    code: '$validated =$request->validate([\n    \'title\' => \'required|max:255\',\n    \'email\' => \'required|email|unique:users\',\n]);'
  },
  { 
    id: '7', 
    title: 'API Resources', 
    icon: 'layers', 
    color: '#EF4444', 
    content: 'API Resources act as a transformation layer between your database models and the JSON output sent to clients, allowing you to explicitly shape attributes, hide sensitive keys, or format dates.',
    code: '// Generate resource transformation class\nphp artisan make:resource UserResource\n\n// Inside UserResource.php:\npublic function toArray(Request $request): array\n{\n    return [\n        \'id\' =>$this->id,\n        \'full_name\' => strtoupper($this->name),\n        \'joined_at\' =>$this->created_at->toIso8601String(),\n    ];\n}'
  },
  { 
    id: '8', 
    title: 'Resource Collections', 
    icon: 'list', 
    color: '#EC4899', 
    content: 'While an individual API Resource transforms a single model instance, Resource Collections allow you to transform paginated or un-paginated lists of models effortlessly.',
    code: '// Returning a collection in a controller\nreturn UserResource::collection(User::all());'
  },
  { 
    id: '9', 
    title: 'API Pagination', 
    icon: 'ellipsis-horizontal', 
    color: '#14B8A6', 
    content: 'Laravel API Resources seamlessly preserve pagination metadata (such as current page, total count, next and previous links) when transforming paginated query results.',
    code: 'public function index()\n{\n    // Automatically wraps items and includes links & meta\n    return UserResource::collection(User::paginate(15));\n}'
  },
  { 
    id: '10', 
    title: 'API Error Responses', 
    icon: 'warning', 
    color: '#6366F1', 
    content: 'You can handle exceptions cleanly in `bootstrap/app.php` to ensure your API always returns consistent JSON error structures even when records are missing or unauthenticated.',
    code: 'use Illuminate\\Http\\Request;\nuse Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException;\n\n$exceptions->render(function (NotFoundHttpException$e, Request $request) {\n    if ($request->is(\'api/*\')) {\n        return response()->json([\'message\' => \'Record not found.\'], 404);\n    }\n});'
  },
  { 
    id: '11', 
    title: 'API Versioning', 
    icon: 'git-commit', 
    color: '#3B82F6', 
    content: 'Versioning your API (e.g., `/api/v1/users` vs `/api/v2/users`) ensures that future breaking changes do not disrupt mobile apps or third-party clients currently consuming older versions.',
    code: '// Grouping routes by version namespace\nRoute::prefix(\'v1\')->group(function () {\n    Route::apiResource(\'posts\', Api\\V1\\PostController::class);\n});'
  },
  { 
    id: '12', 
    title: 'Building a REST API', 
    icon: 'construct', 
    color: '#10B981', 
    content: 'Combining route definitions, controllers, validation rules, and resource transformers lets you build a clean, bulletproof RESTful API for modern frontend and mobile app ecosystems.',
    code: '// Register full standard RESTful resource routes instantly\nRoute::apiResource(\'flights\', FlightController::class);\n\n// Generates index, store, show, update, and destroy endpoints.'
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

export default function Module16DetailScreen() { 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { return () => { Speech.stop(); }; }, []);

  const handleReadAloud = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak("Module 16: APIs. Learn how to build robust RESTful APIs with Laravel route definitions, controllers, JSON responses, validation, and resource transformation layers.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 16</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">APIs</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Master building scalable JSON APIs in Laravel complete with routing, request validation, resource transformers, and error handling.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="globe" size={14} color="#DBEAFE" />
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