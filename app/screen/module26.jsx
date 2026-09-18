import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'CSRF Protection', 
    icon: 'shield-checkmark', 
    color: '#3B82F6', 
    content: 'Cross-Site Request Forgery protection automatically generates a secret token for each active user session. Laravel validates this token on POST, PUT, PATCH, and DELETE requests to ensure requests are initiated by your app interface.',
    code: '// In Blade templates, include the CSRF field directive:\n<form method="POST" action="/profile">\n    @csrf\n    <input type="text" name="name">\n</form>'
  },
  { 
    id: '2', 
    title: 'XSS Protection', 
    icon: 'code', 
    color: '#10B981', 
    content: 'Cross-Site Scripting (XSS) occurs when malicious JavaScript is injected into trusted web pages. Laravel Blade double-curly syntax automatically runs output through PHP htmlspecialchars to neutralize malicious scripts.',
    code: '{{-- Blade automatically escapes variables to block XSS injection --}}\n<span>{{ $userInput }}</span>\n\n{{-- Use unescaped output only with trusted sanitized data --}}\n<span>{!!$trustedHtml !!}</span>'
  },
  { 
    id: '3', 
    title: 'SQL Injection', 
    icon: 'server', 
    color: '#8B5CF6', 
    content: 'SQL Injection allows attackers to manipulate database queries. Laravel Eloquent ORM and Query Builder use PDO parameter binding under the hood, completely shielding your application from raw input injections.',
    code: '// Secure parameter binding built into Eloquent:\n$user = User::where(\'email\',$request->input(\'email\'))->first();'
  },
  { 
    id: '4', 
    title: 'Mass Assignment', 
    icon: 'layers', 
    color: '#F59E0B', 
    content: 'Mass assignment vulnerabilities happen when users pass unexpected HTTP request parameters that modify protected model attributes like is_admin. Protect models using fillable or guarded properties.',
    code: 'class User extends Model {\n    // Only allow specific attributes to be mass assigned:\n    protected $fillable = [\'name\', \'email\', \'password\'];\n    \n    // Or block specific sensitive columns:\n    // protected$guarded = [\'is_admin\', \'id\'];\n}'
  },
  { 
    id: '5', 
    title: 'Authentication Security', 
    icon: 'key', 
    color: '#06B6D4', 
    content: 'Protect user sessions against fixation attacks by regenerating session identifiers upon login, and secure routes using strict middleware guards.',
    code: '// Regenerate session tokens on login success:\n$request->session()->regenerate();\n\n// Protect routes via auth middleware:\nRoute::middleware([\'auth\'])->group(function () {\n    Route::get(\'/dashboard\', [DashboardController::class, \'index\']);\n});'
  },
  { 
    id: '6', 
    title: 'Authorization', 
    icon: 'lock-closed', 
    color: '#F97316', 
    content: 'Authorization determines whether an authenticated user is permitted to perform an action. Laravel Gates and Policy classes provide clean, expressive controls.',
    code: 'use App\\Models\\Post;\nuse App\\Models\\User;\n\n// Define a Policy method:\npublic function update(User $user, Post$post): bool {\n    return $user->id ===$post->user_id;\n}'
  },
  { 
    id: '7', 
    title: 'Password Security', 
    icon: 'finger-print', 
    color: '#EF4444', 
    content: 'Laravel hashes passwords using strong bcrypt and Argon2id algorithms by default via the Hash facade. Never store plain text passwords.',
    code: 'use Illuminate\\Support\\Facades\\Hash;\n\n// Hash a new user password securely:\n$password = Hash::make($request->password);\n\n// Verify incoming login credentials:\nif (Hash::check($inputPassword,$hashedPassword)) { /* Match */ }'
  },
  { 
    id: '8', 
    title: 'Rate Limiting', 
    icon: 'speedometer', 
    color: '#6366F1', 
    content: 'Protect your API endpoints and login routes from brute-force attacks using Laravel rate limiters configured in AppServiceProvider.',
    code: 'use Illuminate\\Cache\\RateLimiting\\Limit;\nuse Illuminate\\Support\\Facades\\RateLimiter;\n\nRateLimiter::for(\'login\', function (Request $request) {\n    return Limit::perMinute(5)->by($request->ip());\n});'
  },
  { 
    id: '9', 
    title: 'Secure File Uploads', 
    icon: 'cloud-upload', 
    color: '#14B8A6', 
    content: 'Prevent execution of malicious uploaded scripts by storing uploaded files on isolated disks (like S3 or private local storage) and validating mime types.',
    code: '$path = $request->file(\'avatar\')->storeAs(\n    \'avatars\',\n$userId,\n    \'public\'\n);'
  },
  { 
    id: '10', 
    title: 'Environment Variables', 
    icon: 'options', 
    color: '#EC4899', 
    content: 'Keep sensitive API keys, database credentials, and encryption secrets out of version control by managing them securely inside your `.env` configuration files.',
    code: '# Access config values safely via helpers:\n$stripeKey = config(\'services.stripe.key\');'
  },
  { 
    id: '11', 
    title: 'Production Security', 
    icon: 'shield', 
    color: '#84CC16', 
    content: 'Always disable application debug mode in production (`APP_DEBUG=false`), force HTTPS links, and ensure proper directory file permissions on your server.',
    code: '# Production .env setting:\nAPP_ENV=production\nAPP_DEBUG=false'
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

export default function Module26DetailScreen() { 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { return () => { Speech.stop(); }; }, []);

  const handleReadAloud = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak("Module 26: Security. Learn CSRF tokens, XSS defense, SQL injection protection, mass assignment rules, and production security in Laravel.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 26</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">Security</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Master robust application security measures, encryption, rate limiters, and defensive architecture.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="shield-checkmark" size={14} color="#DBEAFE" />
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