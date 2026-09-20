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
    title: 'What are Migrations?', 
    icon: 'git-network', 
    color: '#FF3B30', 
    content: 'Migrations are like version control for your database, allowing your team to define and share the application\'s database schema definition. If you have ever had to tell a teammate to manually add a column to their local database schema, you\'ve faced the problem that database migrations solve.',
    code: '// Migrations are typically stored in database/migrations\n// They contain an up() method to add tables/columns,\n// and a down() method to reverse the operation.'
  },
  { 
    id: '2', 
    title: 'Creating Migrations', 
    icon: 'add-circle', 
    color: '#3B82F6', 
    content: 'You can generate a new migration using the `make:migration` Artisan command. The name of the migration will dictate the name of the file, and Laravel will automatically prefix it with a timestamp.',
    code: '// Create a basic migration\nphp artisan make:migration create_flights_table\n\n// Add a column to an existing table\nphp artisan make:migration add_votes_to_users_table'
  },
  { 
    id: '3', 
    title: 'Creating Tables', 
    icon: 'grid', 
    color: '#10B981', 
    content: 'To create a new database table, use the `Schema::create` method within the `up` method of your migration. It accepts the table name and a Closure which receives a Blueprint object to define the table.',
    code: 'use Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\nSchema::create("users", function (Blueprint $table) {\n$table->id();\n  $table->string("name");\n  $table->timestamps();\n});'
  },
  { 
    id: '4', 
    title: 'Columns', 
    icon: 'reorder-four', 
    color: '#8B5CF6', 
    content: 'The Schema Builder blueprint offers a variety of methods that correspond to the different types of columns you can add to your database tables, such as strings, texts, integers, and booleans.',
    code: '$table->string("title", 100); // VARCHAR with length\n$table->text("description"); // TEXT\n$table->integer("votes"); // INT\n$table->boolean("is_active"); // TINYINT(1)\n$table->date("created_on"); // DATE'
  },
  { 
    id: '5', 
    title: 'Column Modifiers', 
    icon: 'construct', 
    color: '#EF4444', 
    content: 'In addition to the column types listed above, there are several column "modifiers" you may use while adding a column to a database table. For example, to make a column nullable or set a default value.',
    code: '$table->string("email")->nullable();\n$table->integer("votes")->default(0);\n$table->integer("age")->unsigned();\n$table->string("note")->comment("Internal notes");'
  },
  { 
    id: '6', 
    title: 'Primary Keys', 
    icon: 'key', 
    color: '#F59E0B', 
    content: 'The `id` method creates an auto-incrementing, unsigned big integer primary key column. You can also specify custom primary keys or composite primary keys using the `primary` method.',
    code: '// Standard auto-incrementing primary key\n$table->id();\n\n// Custom primary key definition\n$table->string("uuid")->primary();\n\n// Composite primary key\n$table->primary(["user_id", "role_id"]);'
  },
  { 
    id: '7', 
    title: 'Foreign Keys', 
    icon: 'link', 
    color: '#EC4899', 
    content: 'Laravel provides support for creating foreign key constraints, which are used to force referential integrity at the database level. The `foreignId` method creates a column and constraint in a single fluent line.',
    code: '// Creates a user_id column and links it to users.id\n$table->foreignId("user_id")\n      ->constrained()\n      ->cascadeOnDelete();\n\n// Or the longer syntax:\n$table->unsignedBigInteger("user_id");\n$table->foreign("user_id")->references("id")->on("users");'
  },
  { 
    id: '8', 
    title: 'Indexes', 
    icon: 'search', 
    color: '#06B6D4', 
    content: 'Database indexes improve the speed of data retrieval operations on a table. You can add indexes by calling the `index` method, or `unique` for unique constraints.',
    code: '$table->string("email")->unique();\n\n// Adding a standard index\n$table->index("state");\n\n// Composite index across multiple columns\n$table->index(["account_id", "created_at"]);'
  },
  { 
    id: '9', 
    title: 'Updating Tables', 
    icon: 'sync', 
    color: '#F97316', 
    content: 'To update an existing table, use the `Schema::table` method. Within the closure, you can add new columns, modify existing ones, or add indexes.',
    code: 'Schema::table("users", function (Blueprint $table) {\n$table->string("phone")->nullable()->after("email");\n  // ->after() orders the column in MySQL\n});'
  },
  { 
    id: '10', 
    title: 'Removing Columns', 
    icon: 'trash', 
    color: '#EF4444', 
    content: 'To drop a column, you may use the `dropColumn` method on the Schema builder. You can pass a string or an array of strings to drop multiple columns at once.',
    code: 'Schema::table("users", function (Blueprint $table) {\n$table->dropColumn("phone");\n  // Or drop multiple:\n  // $table->dropColumn(["phone", "avatar", "status"]);\n});'
  },
  { 
    id: '11', 
    title: 'Rolling Back Migrations', 
    icon: 'return-up-back', 
    color: '#3B82F6', 
    content: 'To rollback the latest migration operation, you may use the `migrate:rollback` command. This rolls back the last "batch" of migrations, which may include multiple files.',
    code: '// Roll back the very last batch\nphp artisan migrate:rollback\n\n// Roll back a specific number of steps/batches\nphp artisan migrate:rollback --step=1\n\n// Roll back all migrations entirely\nphp artisan migrate:reset'
  },
  { 
    id: '12', 
    title: 'Migration Status', 
    icon: 'information-circle', 
    color: '#10B981', 
    content: 'You can check which migrations have already been run against your database and which ones are pending by using the `migrate:status` Artisan command.',
    code: '// Outputs a table of all migrations and their status\nphp artisan migrate:status'
  },
  { 
    id: '13', 
    title: 'Fresh & Refresh', 
    icon: 'refresh-circle', 
    color: '#8B5CF6', 
    content: 'When developing locally, you often need to reset your database. `migrate:fresh` drops all tables and runs all migrations. `migrate:refresh` rolls back all migrations then runs them again.',
    code: '// Drop ALL tables and re-migrate (Fastest)\nphp artisan migrate:fresh\n\n// Rollback all migrations and re-migrate\nphp artisan migrate:refresh\n\n// Run seeders after freshing the database\nphp artisan migrate:fresh --seed'
  }
];

// Helper function to syntax highlight the PHP code blocks
const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;

  const regex = /(?:\/\/.*|--.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null|Schema|Blueprint)\b)/g;

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

export default function Module9DetailScreen() { 
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

      const introText = "Module 9: Migrations. Learn how to version control your database schema. We will cover creating tables, defining columns and constraints, modifying existing tables, and managing migration rollbacks.";
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
                Module 9
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Migrations
              </Text>
              <Text className="text-teal-100 text-sm leading-relaxed mb-4">
                Learn how to version control your database schema. We will cover creating tables, defining columns and constraints, modifying existing tables, and managing migration rollbacks.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="git-network" size={14} color="#CCFBF1" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#FF3B30" : "#CCFBF1"} 
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