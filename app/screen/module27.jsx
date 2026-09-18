import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'Development vs Production', 
    icon: 'git-compare', 
    color: '#3B82F6', 
    content: 'Local development prioritizes debugging tools and hot reloading, while production prioritizes optimized performance, security locks, caching, and uptime stability.',
    code: '# Local: php artisan serve\n# Production: Nginx + PHP-FPM + Supervisor'
  },
  { 
    id: '2', 
    title: 'Production Environment', 
    icon: 'server', 
    color: '#10B981', 
    content: 'Provision a robust cloud server (such as AWS EC2, DigitalOcean, or Laravel Forge) running Linux, PHP, Composer, and a secure database engine.',
    code: '# Ensure proper file permissions on storage and bootstrap/cache:\nsudo chmod -R 775 storage bootstrap/cache'
  },
  { 
    id: '3', 
    title: 'Production .env', 
    icon: 'options', 
    color: '#8B5CF6', 
    content: 'Configure your production environment variables securely with live database credentials, production URLs, and disabled debug mode.',
    code: 'APP_ENV=production\nAPP_DEBUG=false\nAPP_URL=https://yourdomain.com'
  },
  { 
    id: '4', 
    title: 'Database Setup', 
    icon: 'albums', 
    color: '#F59E0B', 
    content: 'Set up a high-performance relational database instance (MySQL or PostgreSQL), configure secure user credentials, and restrict public network access.',
    code: 'DB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_DATABASE=production_db'
  },
  { 
    id: '5', 
    title: 'Running Migrations', 
    icon: 'play', 
    color: '#06B6D4', 
    content: 'Deploy database schema changes safely to your production server without downtime using native Artisan migration flags.',
    code: '# Execute migrations on production without interaction prompts:\nphp artisan migrate --force'
  },
  { 
    id: '6', 
    title: 'Storage Configuration', 
    icon: 'folder', 
    color: '#F97316', 
    content: 'Link your public storage directory so uploaded files are accessible via the web server using the storage:link artisan command.',
    code: '# Create a symbolic link to public/storage:\nphp artisan storage:link'
  },
  { 
    id: '7', 
    title: 'Application Caching', 
    icon: 'speedometer', 
    color: '#EF4444', 
    content: 'Compile routes, configuration parameters, and events into lightning-fast cached files to boost application request throughput.',
    code: 'php artisan config:cache\nphp artisan route:cache\nphp artisan view:cache'
  },
  { 
    id: '8', 
    title: 'Queue Workers', 
    icon: 'construct', 
    color: '#6366F1', 
    content: 'Manage background queue workers reliably using Supervisor daemon processes so background jobs restart automatically if they crash.',
    code: '# Supervisor configuration snippet:\n[program:laravel-worker]\ncommand=php /var/www/artisan queue:work redis --sleep=3 --tries=3'
  },
  { 
    id: '9', 
    title: 'Cron Jobs', 
    icon: 'time', 
    color: '#14B8A6', 
    content: 'Configure your server cron tab to execute the Laravel task scheduler every minute to handle scheduled commands and notifications.',
    code: '* * * * * cd /var/www && php artisan schedule:run >> /dev/null 2>&1'
  },
  { 
    id: '10', 
    title: 'Web Server (Nginx)', 
    icon: 'globe', 
    color: '#EC4899', 
    content: 'Configure Nginx virtual host server blocks to point directly to your Laravel `public/index.php` entry point.',
    code: 'server {\n    listen 80;\n    server_name yourdomain.com;\n    root /var/www/public;\n    index index.php;\n    # ...\n}'
  },
  { 
    id: '11', 
    title: 'Domain & DNS', 
    icon: 'wifi', 
    color: '#84CC16', 
    content: 'Configure your domain registrar DNS records (A records and CNAME records) to point directly to your cloud server public IP address.',
    code: '# Point A Record @ to your server IPv4 address'
  },
  { 
    id: '12', 
    title: 'SSL / HTTPS', 
    icon: 'lock-closed', 
    color: '#3B82F6', 
    content: 'Secure data in transit by installing free SSL/TLS certificates via Certbot and enforcing mandatory HTTPS redirects in your application code.',
    code: '# Install Let\'s Encrypt SSL via Certbot:\nsudo certbot --nginx -d yourdomain.com'
  },
  { 
    id: '13', 
    title: 'Laravel Deployment', 
    icon: 'rocket', 
    color: '#10B981', 
    content: 'Automate your release cycle using zero-downtime deployment strategies with Git, Composer, and deployment scripts.',
    code: '# Complete production deployment checklist script:\ncomposer install --no-dev --optimize-autoloader\nphp artisan migrate --force\nphp artisan optimize'
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

export default function Module27DetailScreen() { 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { return () => { Speech.stop(); }; }, []);

  const handleReadAloud = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak("Module 27: Deployment. Learn production server setup, Nginx configuration, database migrations, queue supervisors, and SSL security in Laravel.", { rate: 0.9 });
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
              <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">Module 27</Text>
              <View className="w-10 h-10" />
            </View>
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">Deployment</Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">Learn production provisioning, Nginx web servers, queue workers, SSL certificates, and zero-downtime workflows.</Text>
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="server" size={14} color="#DBEAFE" />
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