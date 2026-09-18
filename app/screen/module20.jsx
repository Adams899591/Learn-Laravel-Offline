import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'What are Notifications?', 
    icon: 'notifications', 
    color: '#3B82F6', 
    content: 'Notifications allow you to send short informational messages to users across multiple delivery channels, such as email, SMS via Vonage, Slack, databases, or mobile push notifications.',
    code: '// Send a notification to any model using the Notifiable trait:\nuse Illuminate\\Support\\Facades\\Notification;\n\nNotification::send($users, new InvoicePaidNotification($invoice));'
  },
  { 
    id: '2', 
    title: 'Database Notifications', 
    icon: 'server', 
    color: '#10B981', 
    content: 'Laravel allows you to store notification payloads directly in a database table so users can view their recent notification history inside your web or mobile app UI dashboard.',
    code: '# Generate the database notifications table migration:\nphp artisan notifications:table\nphp artisan migrate'
  },
  { 
    id: '3', 
    title: 'Mail Notifications', 
    icon: 'mail', 
    color: '#8B5CF6', 
    content: 'In addition to databases, notifications can format and dispatch emails seamlessly by returning a `MailMessage` representation inside the notification delivery channel method.',
    code: 'public function toMail(object $notifiable): MailMessage {\n    return (new MailMessage)\n                ->line(\'Your invoice has been paid successfully.\')\n                ->action(\'View Invoice\', url(\'/invoice\'));\n}'
  },
  { 
    id: '4', 
    title: 'Notification Classes', 
    icon: 'create', 
    color: '#F59E0B', 
    content: 'Notification classes are generated inside `app/Notifications`. Each class defines which channels it should broadcast through and builds the data payload for each channel.',
    code: '# Generate a notification class via Artisan:\nphp artisan make:notification NewCommentNotification'
  },
  { 
    id: '5', 
    title: 'Reading Notifications', 
    icon: 'book', 
    color: '#06B6D4', 
    content: 'You can access all notifications, unread notifications, or read notifications associated with an authenticated user model directly using Eloquent relationships.',
    code: '$user = Auth::user();\n\n// Retrieve all unread database notifications\n$unread =$user->unreadNotifications;'
  },
  { 
    id: '6', 
    title: 'Marking Notifications as Read', 
    icon: 'checkmark-done', 
    color: '#F97316', 
    content: 'When a user views their notifications in your app interface, you can mark individual notifications or all unread notifications as read using the `markAsRead` method.',
    code: '$user = Auth::user();\n\n// Mark a specific notification as read by ID\n$user->notifications()->where(\'id\', $notificationId)->first()->markAsRead();\n\n// Or mark all unread notifications at once\n$user->unreadNotifications->markAsRead();'
  },
  { 
    id: '7', 
    title: 'Notification Channels', 
    icon: 'layers', 
    color: '#EF4444', 
    content: 'The `via` method on your notification class defines which delivery channels receive the notification payload when triggered, such as combining database storage and email delivery simultaneously.',
    code: 'public function via(object $notifiable): array {\n    // Dispatch to database and mail channels concurrently\n    return [\'database\', \'mail\'];\n}'
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

export default function Module20DetailScreen() { 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { return () => { Speech.stop(); }; }, []);

  const handleReadAloud = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak("Module 20: Notifications. Learn how to dispatch multi-channel notifications across database, email, and mobile push channels in Laravel.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 20</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">Notifications</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Learn multi-channel notifications, database storage, unread tracking, and marking notifications as read.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="notifications" size={14} color="#DBEAFE" />
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