import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'What is a Database?', 
    icon: 'server', 
    color: '#6366F1', 
    content: 'A database is an organized collection of structured information, or data, typically stored electronically in a computer system. It allows data to be easily accessed, managed, and updated.',
    code: '-- A database stores your application\'s state\nCREATE DATABASE laravel_app;'
  },
  { 
    id: '2', 
    title: 'SQL Basics', 
    icon: 'terminal', 
    color: '#3B82F6', 
    content: 'SQL (Structured Query Language) is the standard language for dealing with Relational Databases. It is used to insert, search, update, and delete database records.',
    code: '-- SQL statements communicate with the database\nSELECT version();'
  },
  { 
    id: '3', 
    title: 'Tables & Columns', 
    icon: 'grid', 
    color: '#10B981', 
    content: 'In a relational database, data is organized into tables (like spreadsheets). Each table has columns (attributes like "name" or "email") and rows (the actual records).',
    code: 'CREATE TABLE users (\n  id INT,\n  name VARCHAR(255),\n  email VARCHAR(255)\n);'
  },
  { 
    id: '4', 
    title: 'Primary Keys', 
    icon: 'key', 
    color: '#F59E0B', 
    content: 'A Primary Key is a specific column (or set of columns) that uniquely identifies each row in a table. In Laravel, this is almost always an auto-incrementing integer named "id".',
    code: 'CREATE TABLE users (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  email VARCHAR(255)\n);'
  },
  { 
    id: '5', 
    title: 'Foreign Keys', 
    icon: 'link', 
    color: '#EC4899', 
    content: 'A Foreign Key is a column that creates a link between two tables. It references the Primary Key of another table, establishing a relationship (e.g., a post belongs to a user).',
    code: 'CREATE TABLE posts (\n  id INT PRIMARY KEY,\n  user_id INT,\n  title VARCHAR(255),\n  FOREIGN KEY (user_id) REFERENCES users(id)\n);'
  },
  { 
    id: '6', 
    title: 'Database Configuration', 
    icon: 'settings', 
    color: '#06B6D4', 
    content: 'Laravel makes connecting to databases simple. You configure your database credentials in your `.env` file, and Laravel handles the connection via the `config/database.php` file.',
    code: '// Inside your .env file\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=laravel_app\nDB_USERNAME=root\nDB_PASSWORD=secret'
  },
  { 
    id: '7', 
    title: 'MySQL', 
    icon: 'logo-buffer', 
    color: '#F97316', 
    content: 'MySQL is the most popular open-source relational database management system. It is the default database driver for most Laravel applications and works seamlessly with it.',
    code: '# Connecting to MySQL via terminal\nmysql -u root -p'
  },
  { 
    id: '8', 
    title: 'PostgreSQL', 
    icon: 'layers', 
    color: '#8B5CF6', 
    content: 'PostgreSQL is an advanced, enterprise-class open-source relational database. It is highly extensible and strictly compliant with SQL standards. Laravel supports it out of the box.',
    code: '# Connecting to PostgreSQL via terminal\npsql -U postgres -d laravel_app'
  },
  { 
    id: '9', 
    title: 'SELECT', 
    icon: 'search', 
    color: '#14B8A6', 
    content: 'The SELECT statement is used to fetch data from a database. The data returned is stored in a result table, sometimes called the result-set.',
    code: '-- Select all columns\nSELECT * FROM users;\n\n-- Select specific columns\nSELECT name, email FROM users;'
  },
  { 
    id: '10', 
    title: 'INSERT', 
    icon: 'add-circle', 
    color: '#10B981', 
    content: 'The INSERT INTO statement is used to add new rows of data to a table in the database.',
    code: 'INSERT INTO users (name, email)\nVALUES ("John Doe", "john@example.com");'
  },
  { 
    id: '11', 
    title: 'UPDATE', 
    icon: 'sync', 
    color: '#3B82F6', 
    content: 'The UPDATE statement is used to modify the existing records in a table. Be careful—if you omit the WHERE clause, ALL records will be updated!',
    code: 'UPDATE users\nSET name = "Jane Doe", status = "active"\nWHERE id = 1;'
  },
  { 
    id: '12', 
    title: 'DELETE', 
    icon: 'trash', 
    color: '#FF3B30', 
    content: 'The DELETE statement is used to remove existing records from a table. Like UPDATE, always use a WHERE clause to avoid deleting everything.',
    code: 'DELETE FROM users\nWHERE id = 5;'
  },
  { 
    id: '13', 
    title: 'WHERE', 
    icon: 'funnel', 
    color: '#F59E0B', 
    content: 'The WHERE clause is used to filter records. It is used to extract only those records that fulfill a specified condition.',
    code: 'SELECT * FROM users\nWHERE status = "active" AND age > 18;'
  },
  { 
    id: '14', 
    title: 'ORDER BY', 
    icon: 'list-circle', 
    color: '#8B5CF6', 
    content: 'The ORDER BY keyword is used to sort the result-set in ascending (ASC) or descending (DESC) order. It sorts records in ascending order by default.',
    code: 'SELECT * FROM posts\nORDER BY created_at DESC;'
  },
  { 
    id: '15', 
    title: 'LIMIT', 
    icon: 'remove-circle', 
    color: '#EC4899', 
    content: 'The LIMIT clause is used to specify the number of records to return. It is highly useful on large tables returning thousands of records, often used for pagination.',
    code: 'SELECT * FROM users\nORDER BY id DESC\nLIMIT 10;'
  },
  { 
    id: '16', 
    title: 'JOINs', 
    icon: 'git-merge', 
    color: '#06B6D4', 
    content: 'A JOIN clause is used to combine rows from two or more tables, based on a related column between them (like foreign keys).',
    code: 'SELECT users.name, posts.title\nFROM users\nJOIN posts ON users.id = posts.user_id;'
  },
];

// Helper function to syntax highlight the PHP and SQL code blocks
const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;

  // Added SQL keywords and SQL comments (--) to the regex
  const regex = /(?:\/\/.*|--.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null|SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|ORDER|BY|LIMIT|JOIN|ON|CREATE|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|INT|VARCHAR|DESC|ASC|AND|OR)\b)/g;

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

    if (token.startsWith('//') || token.startsWith('--')) {
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

export default function Module8DetailScreen() { 
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

      const introText = "Module 8: Database. Learn the fundamentals of relational databases and Structured Query Language. We will cover tables, keys, connections, and basic SQL operations like SELECT, INSERT, UPDATE, and JOINs.";
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
                Module 8
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Database & SQL
              </Text>
              <Text className="text-indigo-100 text-sm leading-relaxed mb-4">
                Learn the fundamentals of relational databases and SQL. We will cover tables, foreign keys, database configurations, and essential operations like SELECT, INSERT, UPDATE, and JOINs.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="server" size={14} color="#E0E7FF" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#FF3B30" : "#E0E7FF"} 
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