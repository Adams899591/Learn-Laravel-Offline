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
    title: 'Service Container', 
    icon: 'hardware-chip', 
    color: '#3B82F6', 
    content: 'The Laravel service container is a powerful tool for managing class dependencies and performing dependency injection using automatic type resolution.',
    code: '// Bind a class implementation into the container:\n$this->app->bind(PaymentServiceInterface::class, StripePaymentService::class);'
  },
  { 
    id: '2', 
    title: 'Service Providers', 
    icon: 'albums', 
    color: '#10B981', 
    content: 'Service providers are the central place of all Laravel application bootstrapping. Your app as well as all Laravel core services are bootstrapped via providers.',
    code: 'public function register(): void {\n    $this->app->singleton(MyService::class, function ($app) {\n        return new MyService($app->make(\'config\'));\n    });\n}'
  },
  { 
    id: '3', 
    title: 'Dependency Injection', 
    icon: 'git-network', 
    color: '#8B5CF6', 
    content: 'Type-hint dependencies in controller constructor methods or action parameters, and the container automatically instantiates and injects them.',
    code: 'public function __construct(\n    protected UserRepository $users\n) {}'
  },
  { 
    id: '4', 
    title: 'Contracts', 
    icon: 'document-text', 
    color: '#F59E0B', 
    content: 'Laravel Contracts are a set of interfaces that define core framework services, allowing you to decouple implementations easily.',
    code: 'use Illuminate\\Contracts\\Auth\\Guard;\n\npublic function handle(Guard $auth) {\n    $user =$auth->user();\n}'
  },
  { 
    id: '5', 
    title: 'Facades', 
    icon: 'flash', 
    color: '#06B6D4', 
    content: 'Facades provide a static interface to classes available in the application’s service container, offering concise syntax with full testability.',
    code: 'use Illuminate\\Support\\Facades\\Cache;\n\n$value = Cache::get(\'key\');'
  },
  { 
    id: '6', 
    title: 'Events & Observers', 
    icon: 'eye', 
    color: '#F97316', 
    content: 'Eloquent observers group event handlers for model lifecycle events such as creating, updating, saving, and deleting records.',
    code: 'class UserObserver {\n    public function created(User $user): void {\n        // Send welcome email upon user model creation\n    }\n}'
  },
  { 
    id: '7', 
    title: 'Custom Artisan Commands', 
    icon: 'terminal', 
    color: '#EF4444', 
    content: 'Build your own command-line tools using Artisan to automate maintenance tasks, data imports, or scheduled background scripts.',
    code: '# Generate custom command:\nphp artisan make:command SendInvoices\n\nprotected $signature = \'invoices:send {user}\';'
  },
  { 
    id: '8', 
    title: 'Custom Packages', 
    icon: 'cube', 
    color: '#6366F1', 
    content: 'Package development allows you to package reusable functionality into standalone composer packages for multiple Laravel projects.',
    code: '// Register package service provider inside composer.json extra section'
  },
  { 
    id: '9', 
    title: 'Macros', 
    icon: 'code-working', 
    color: '#14B8A6', 
    content: 'Macros allow you to add custom methods to internal Laravel classes like Request, Response, Collection, or Stringable at runtime.',
    code: 'use Illuminate\\Support\\Str;\n\nStr::macro(\'appSlug\', function ($value) {\n    return Str::slug($value, \'-\');\n});'
  },
  { 
    id: '10', 
    title: 'Broadcasting & WebSockets', 
    icon: 'radio', 
    color: '#EC4899', 
    content: 'Real-time event broadcasting allows you to push server-side Laravel events to your client-side JavaScript or mobile apps via WebSockets (Pusher or Reverb).',
    code: 'class OrderShipped implements ShouldBroadcast {\n    public function broadcastOn(): array {\n        return [new Channel(\'orders.\' . $this->order->id)];\n    }\n}'
  },
  { 
    id: '11', 
    title: 'Localization & i18n', 
    icon: 'globe', 
    color: '#84CC16', 
    content: 'Localization features allow your application to support multiple languages easily using translation strings stored in JSON or PHP files.',
    code: '// Retrieve translated string:\n__(\'messages.welcome\');'
  },
  { 
    id: '12', 
    title: 'Performance Optimization', 
    icon: 'speedometer', 
    color: '#3B82F6', 
    content: 'Tune database indexing, eager load relationships to avoid N+1 query problems, utilize chunking for large datasets, and cache aggressively.',
    code: '// Eager load relationships:\n$books = Book::with(\'author\')->get();'
  },
  { 
    id: '13', 
    title: 'Production-Ready Apps', 
    icon: 'shield-checkmark', 
    color: '#10B981', 
    content: 'Combine architectural design patterns, comprehensive test suites, secure queues, and automated CI/CD pipelines to build bulletproof enterprise Laravel software.',
    code: '// Scale with confidence using Laravel enterprise standards'
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

export default function Module28DetailScreen() { 
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
      Speech.speak("Module 28: Advanced Laravel. Learn service container bindings, dependency injection, service providers, macros, custom commands, and real-time broadcasting.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 28</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">Advanced Laravel</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Master service containers, dependency injection, service providers, macros, WebSockets, and enterprise optimization.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="hardware-chip" size={14} color="#DBEAFE" />
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