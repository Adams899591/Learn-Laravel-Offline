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
    title: 'File Storage Basics', 
    icon: 'folder', 
    color: '#3B82F6', 
    content: 'Laravel provides a powerful filesystem abstraction thanks to the Flysystem PHP package. This allows you to interact seamlessly with local disks, Amazon S3, or Google Cloud Storage using the exact same methods.',
    code: 'use Illuminate\\Support\\Facades\\Storage;\n\n// Store file on the default disk\nStorage::disk(\'public\')->put(\'example.txt\', \'Contents\');'
  },
  { 
    id: '2', 
    title: 'Uploading Files', 
    icon: 'cloud-upload', 
    color: '#10B981', 
    content: 'When users upload files via HTTP forms or API requests, you can access the uploaded file instance from the request object and verify its validity before processing.',
    code: 'public function upload(Request $request) {\n    if ($request->hasFile(\'avatar\')) {\n        $file =$request->file(\'avatar\');\n        // File is ready to be stored...\n    }\n}'
  },
  { 
    id: '3', 
    title: 'Validating Files', 
    icon: 'shield-checkmark', 
    color: '#8B5CF6', 
    content: 'Laravel validation rules make it easy to enforce restrictions on uploaded files, such as limiting maximum file sizes in kilobytes or restricting allowed extension types.',
    code: '$request->validate([\n    \'avatar\' => \'required|image|mimes:jpeg,png,jpg,gif|max:2048\',\n]);'
  },
  { 
    id: '4', 
    title: 'Storing Files', 
    icon: 'save', 
    color: '#F59E0B', 
    content: 'The `store` method automatically generates a unique filename for your uploaded file and saves it within your designated storage disk directory, returning the relative storage path.',
    code: '// Stores file in storage/app/public/avatars with a hashed filename\n$path =$request->file(\'avatar\')->store(\'avatars\', \'public\');\n\n// Or specify a custom filename explicitly\n$path =$request->file(\'avatar\')->storeAs(\'avatars\', \'profile.jpg\', \'public\');'
  },
  { 
    id: '5', 
    title: 'Retrieving Files', 
    icon: 'document', 
    color: '#06B6D4', 
    content: 'You can check if a file exists, retrieve its raw contents, or download it directly to the user browser using the `Storage` facade methods.',
    code: 'use Illuminate\\Support\\Facades\\Storage;\n\nif (Storage::disk(\'public\')->exists(\'avatars/profile.jpg\')) {\n    $contents = Storage::disk(\'public\')->get(\'avatars/profile.jpg\');\n}\n\nreturn Storage::disk(\'public\')->download(\'avatars/profile.jpg\');'
  },
  { 
    id: '6', 
    title: 'Public Storage', 
    icon: 'globe', 
    color: '#F97316', 
    content: 'Files stored on the `public` disk are intended for public access (such as user avatars or product images). They are saved inside `storage/app/public` directory.',
    code: '// Configuration in config/filesystems.php:\n// \'public\' => [\n//     \'driver\' => \'local\',\n//     \'root\' => storage_path(\'app/public\'),\n//     \'url\' => env(\'APP_URL\').\'/storage\',\n//     \'visibility\' => \'public\',\n// ]'
  },
  { 
    id: '7', 
    title: 'Storage Links', 
    icon: 'link', 
    color: '#EF4444', 
    content: 'Because files in `storage/app/public` are not directly accessible via web browsers, Laravel provides an Artisan command to create a symbolic link from `public/storage` to `storage/app/public`.',
    code: '# Run this Artisan command in your terminal:\nphp artisan storage:link\n\n// Generates public URL:\n$url = Storage::url(\'avatars/profile.jpg\');'
  },
  { 
    id: '8', 
    title: 'Deleting Files', 
    icon: 'trash', 
    color: '#EC4899', 
    content: 'To remove a file from your storage disk when a model or record is deleted, use the `delete` method passing the file path.',
    code: 'use Illuminate\\Support\\Facades\\Storage;\n\n// Delete a single file or an array of files\nStorage::disk(\'public\')->delete(\'avatars/old_profile.jpg\');'
  },
  { 
    id: '9', 
    title: 'Cloud Storage', 
    icon: 'cloud', 
    color: '#14B8A6', 
    content: 'By installing the official Flysystem S3 package, you can seamlessly migrate your file uploads from local storage to Amazon S3 or compatible cloud storage providers by updating your environment config.',
    code: '# Install AWS S3 Flysystem package via Composer:\ncomposer require league/flysystem-aws-s3-v3 ^3.0\n\n// Switch driver in .env:\nFILESYSTEM_DISK=s3'
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

export default function Module18DetailScreen() { 
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
      Speech.speak("Module 18: File Storage. Learn how to handle file uploads, validate files, manage local and cloud disks, and create public storage symlinks in Laravel.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 18</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">File Storage</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Master Laravel file uploading, validation, Flysystem disk management, and cloud storage integration.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="folder" size={14} color="#DBEAFE" />
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