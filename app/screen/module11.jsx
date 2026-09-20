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
    title: 'Understanding Relationships', 
    icon: 'git-network', 
    color: '#3B82F6', 
    content: 'Databases tables are often related to one another. For example, a blog post may have many comments, or an order could belong to a user. Laravel Eloquent makes managing and querying these relationships intuitive using relationship methods defined as functions on your models.',
    code: '// Relationships are defined as methods on your Eloquent model classes\npublic function comments()\n{\n  return $this->hasMany(Comment::class);\n}'
  },
  { 
    id: '2', 
    title: 'One-to-One', 
    icon: 'git-commit', 
    color: '#10B981', 
    content: 'A one-to-one relationship is a basic type of database relation. For example, a User model might be associated with one Phone model. To define this, use the `hasOne` method on the parent and `belongsTo` on the child.',
    code: '// In User model:\npublic function phone()\n{\n  return $this->hasOne(Phone::class);\n}\n\n// Retrieve the phone of a user:\n$phone = User::find(1)->phone;'
  },
  { 
    id: '3', 
    title: 'One-to-Many', 
    icon: 'git-分支', // fallback icon string or use standard ionicon
    color: '#8B5CF6', 
    content: 'A one-to-many relationship is used to define relationships where a single model owns any amount of other models. For instance, a post can have many comments.',
    code: '// In Post model:\npublic function comments()\n{\n  return $this->hasMany(Comment::class);\n}\n\n// Retrieve all comments for a post:\n$comments = Post::find(1)->comments;'
  },
  { 
    id: '4', 
    title: 'Many-to-Many', 
    icon: 'grid', 
    color: '#F59E0B', 
    content: 'Many-to-many relations are slightly more complicated than one-to-one and one-to-many relationships. An example is a user having multiple roles, where a role is also shared by multiple users. This requires an intermediary pivot table.',
    code: '// In User model:\npublic function roles()\n{\n  return $this->belongsToMany(Role::class);\n}\n\n// Accessing roles:\n$roles = User::find(1)->roles;'
  },
  { 
    id: '5', 
    title: 'Has One Through', 
    icon: 'arrow-forward-circle', 
    color: '#06B6D4', 
    content: 'The "has-one-through" relationship links distant relations via an intermediate relation. For example, if each supplier has one user, and each user has one profile, the supplier might access the user\'s profile through the user.',
    code: '// In Supplier model:\npublic function userProfile()\n{\n  return $this->hasOneThrough(UserProfile::class, User::class);\n}'
  },
  { 
    id: '6', 
    title: 'Has Many Through', 
    icon: 'git-merge', 
    color: '#F97316', 
    content: 'The "has-many-through" relation provides a convenient shortcut for accessing distant relations via an intermediate table. For example, a Country model might have many Posts through intermediate User models.',
    code: '// In Country model:\npublic function posts()\n{\n  return $this->hasManyThrough(Post::class, User::class);\n}'
  },
  { 
    id: '7', 
    title: 'Polymorphic Relationships', 
    icon: 'shapes', 
    color: '#EF4444', 
    content: 'A polymorphic relationship allows a model to belong to more than one other model on a single association. For example, a comment might belong to both a Post and a Video model.',
    code: '// In Comment model:\npublic function commentable()\n{\n  return $this->morphTo();\n}\n\n// In Post model:\npublic function comments()\n{\n  return$this->morphMany(Comment::class, \'commentable\');\n}'
  },
  { 
    id: '8', 
    title: 'Defining Relationships', 
    icon: 'code-slash', 
    color: '#EC4899', 
    content: 'Eloquent relationships are defined as methods on your Eloquent model classes. Because relationships also serve as query builders, defining them as methods provides powerful method chaining capabilities.',
    code: '$user = User::find(1);\n\n// Fetching relationship as a dynamic property\n$posts =$user->posts;\n\n// Fetching relationship with query constraints applied\n$recentPosts =$user->posts()->where(\'status\', \'published\')->get();'
  },
  { 
    id: '9', 
    title: 'Loading Relationships', 
    icon: 'download', 
    color: '#14B8A6', 
    content: 'When Eloquent models are retrieved, the relationship properties are "lazy loaded". This means the relationship data isn\'t loaded until you actually access the property for the first time.',
    code: '$book = Book::find(1);\n\n// The author property is lazy loaded on access\necho$book->author->name;'
  },
  { 
    id: '10', 
    title: 'Eager Loading', 
    icon: 'flash', 
    color: '#6366F1', 
    content: 'When accessing relationships, lazy loading can suffer from the "N+1" query problem. Eager loading alleviates this problem by loading your relationships right away with the initial query using the `with` method.',
    code: '// Fixes N+1 query problem by loading authors upfront\n$books = Book::with(\'author\')->get();\n\nforeach ($books as $book) {\n  echo$book->author->name;\n}'
  },
  { 
    id: '11', 
    title: 'Lazy Loading', 
    icon: 'time', 
    color: '#3B82F6', 
    content: 'Sometimes you may forget to eager load a relationship upfront. Eloquent allows you to lazy eager load specific relationships on already existing collection models using the `load` method.',
    code: '$books = Book::all();\n\nif ($someCondition) {\n  // Lazy eager load the author relationship later\n$books->load(\'author\');\n}'
  },
  { 
    id: '12', 
    title: 'Relationship Queries', 
    icon: 'search', 
    color: '#10B981', 
    content: 'When querying your models, you may wish to filter your model results based on the existence of a relationship. You can use methods like `has` and `whereHas` to query relationship counts and constraints.',
    code: '// Retrieve all posts that have at least one comment\n$posts = Post::has(\'comments\')->get();\n\n// Retrieve posts with comments containing specific text\n$posts = Post::whereHas(\'comments\', function ($query) {\n$query->where(\'content\', \'like\', \'%laravel%\');\n})->get();'
  },
  { 
    id: '13', 
    title: 'Pivot Tables', 
    icon: 'layers', 
    color: '#F59E0B', 
    content: 'Many-to-many relationships require the presence of an intermediate pivot table. Eloquent provides various ways to interact with this table, such as attaching, detaching, syncing, or reading extra pivot columns using `withPivot`.',
    code: '// Attach a role to a user with extra pivot data\n$user->roles()->attach($roleId, [\'expires\' => true]);\n\n// Sync roles (replaces existing records with given array)\n$user->roles()->sync([1, 2, 3]);'
  }
];

// Helper function to syntax highlight the PHP code blocks
const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;

  const regex = /(?:\/\/.*|--.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null|Attribute|fn)\b)/g;

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

    if (token.startsWith('//') || token.startsWith('--') || token.startsWith('#')) {
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

export default function Module11DetailScreen() { 
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

      const introText = "Module 11: Relationships. Learn how to define and interact with database relationships in Laravel Eloquent, including one-to-one, one-to-many, many-to-many, polymorphic relations, and eager loading.";
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
                Module 11
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Relationships
              </Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">
                Learn how to define and interact with database table relationships in Laravel Eloquent, from basic one-to-many links to complex polymorphic associations.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="git-network" size={14} color="#DBEAFE" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#FF3B30" : "#DBEAFE"} 
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