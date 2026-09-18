import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'What is Eloquent?', 
    icon: 'cube', 
    color: '#3B82F6', 
    content: 'Eloquent is Laravel\'s default Object-Relational Mapper (ORM). It provides a beautiful, simple ActiveRecord implementation for working with your database. Each database table has a corresponding "Model" that is used to interact with that table.',
    code: '// Eloquent lets you interact with databases using PHP syntax\n// instead of writing raw SQL queries.\n$users = User::all();'
  },
  { 
    id: '2', 
    title: 'Creating Models', 
    icon: 'add-circle', 
    color: '#10B981', 
    content: 'You can generate a new Eloquent model using the Artisan CLI. You can also append flags to simultaneously generate database migrations, factories, seeders, and controllers for the model.',
    code: '// Generate just the model\nphp artisan make:model Flight\n\n// Generate Model, Migration, Factory, and Controller (-mfc)\nphp artisan make:model Flight -mfc'
  },
  { 
    id: '3', 
    title: 'Model Conventions', 
    icon: 'settings', 
    color: '#8B5CF6', 
    content: 'Eloquent assumes your table names are the plural, "snake_case" version of the class name (e.g., `Flight` model maps to `flights` table). It also expects `id` as the primary key and timestamp columns (`created_at`, `updated_at`).',
    code: 'class Flight extends Model\n{\n  // Override table name\n  protected $table = "my_flights";\n\n  // Override primary key\n  protected $primaryKey = "flight_id";\n\n  // Disable timestamps\n  public $timestamps = false;\n}'
  },
  { 
    id: '4', 
    title: 'Creating Records', 
    icon: 'pencil', 
    color: '#F59E0B', 
    content: 'To create a new record in the database, instantiate a new model instance, set attributes on the model, and then call the `save` method.',
    code: '$flight = new Flight;\n\n$flight->name = "London to Paris";\n$flight->airline = "Air France";\n\n// Saves the new record to the database\n$flight->save();'
  },
  { 
    id: '5', 
    title: 'Reading Records', 
    icon: 'book', 
    color: '#06B6D4', 
    content: 'Eloquent provides numerous methods for retrieving data. You can fetch all records, find by primary key, or use constraints to fetch specific rows.',
    code: '// Fetch all records\n$flights = Flight::all();\n\n// Find by primary key (id)\n$flight = Flight::find(1);\n\n// Find or throw a 404 error if not found\n$flight = Flight::findOrFail(1);'
  },
  { 
    id: '6', 
    title: 'Updating Records', 
    icon: 'sync', 
    color: '#F97316', 
    content: 'The `save` method is also used to update models that already exist in the database. Retrieve the model, change its attributes, and call `save`.',
    code: '$flight = Flight::find(1);\n\n$flight->name = "New Flight Name";\n\n// Updates the existing record\n$flight->save();'
  },
  { 
    id: '7', 
    title: 'Deleting Records', 
    icon: 'trash', 
    color: '#EF4444', 
    content: 'To delete a model, call the `delete` method on a model instance. You can also delete models by their primary key using the `destroy` method.',
    code: '$flight = Flight::find(1);\n$flight->delete();\n\n// Or destroy by ID without retrieving first\nFlight::destroy(1);\nFlight::destroy([1, 2, 3]); // Delete multiple'
  },
  { 
    id: '8', 
    title: 'Mass Assignment', 
    icon: 'layers', 
    color: '#EC4899', 
    content: 'Mass assignment allows you to create a model and save it in a single line using the `create` method. However, you must first define which attributes are safe to mass assign to prevent vulnerabilities.',
    code: '// This will fail unless "name" is mass-assignable\n$flight = Flight::create([\n  "name" => "Flight 10",\n  "status" => "delayed"\n]);'
  },
  { 
    id: '9', 
    title: '$fillable & $guarded', 
    icon: 'shield-checkmark', 
    color: '#14B8A6', 
    content: 'To allow mass assignment, you must define either `$fillable` (an array of allowed columns) or `$guarded` (an array of protected columns) on your model. Never use both.',
    code: 'class Flight extends Model\n{\n  // ONLY these attributes can be mass-assigned\n  protected $fillable = ["name", "status"];\n\n  // OR: ALL attributes are mass-assignable EXCEPT these\n  // protected $guarded = ["is_admin"];\n}'
  },
  { 
    id: '10', 
    title: 'Querying Models', 
    icon: 'funnel', 
    color: '#6366F1', 
    content: 'Every Eloquent model acts as a query builder. You can chain various constraints to your query and then call `get` to retrieve the results.',
    code: '$flights = Flight::where("active", 1)\n                 ->orderBy("name", "desc")\n                 ->take(10)\n                 ->get();'
  },
  { 
    id: '11', 
    title: 'Query Scopes', 
    icon: 'telescope', 
    color: '#3B82F6', 
    content: 'Local scopes allow you to define common sets of query constraints that you can easily re-use throughout your application.',
    code: '// In Model:\npublic function scopeActive($query)\n{\n  return $query->where("active", 1);\n}\n\n// In Controller:\n$activeFlights = Flight::active()->get();'
  },
  { 
    id: '12', 
    title: 'Accessors', 
    icon: 'log-in', 
    color: '#10B981', 
    content: 'An accessor transforms an Eloquent attribute value when it is accessed. To define one, create a method on your model that returns an `Attribute` instance.',
    code: 'use Illuminate\\Database\\Eloquent\\Casts\\Attribute;\n\nprotected function firstName(): Attribute\n{\n  return Attribute::make(\n    get: fn ($value) => ucfirst($value),\n  );\n}\n\n//$user->first_name will now always be capitalized'
  },
  { 
    id: '13', 
    title: 'Mutators', 
    icon: 'log-out', 
    color: '#F59E0B', 
    content: 'A mutator transforms an Eloquent attribute value when it is set. It intercepts the data before it is saved to the database.',
    code: 'use Illuminate\\Database\\Eloquent\\Casts\\Attribute;\n\nprotected function firstName(): Attribute\n{\n  return Attribute::make(\n    set: fn ($value) => strtolower($value),\n  );\n}\n\n//$user->first_name = "JOHN" is saved as "john"'
  },
  { 
    id: '14', 
    title: 'Attribute Casting', 
    icon: 'construct', 
    color: '#8B5CF6', 
    content: 'Attribute casting provides a convenient way to convert attributes to common data types (like converting a 0/1 database integer into a PHP boolean automatically).',
    code: 'class User extends Model\n{\n  protected $casts = [\n    "is_admin" => "boolean",\n    "options" => "array", // Automatically JSON encodes/decodes\n    "joined_at" => "datetime",\n  ];\n}'
  },
  { 
    id: '15', 
    title: 'Eager Loading', 
    icon: 'flash', 
    color: '#EF4444', 
    content: 'When querying relationships, Eloquent uses "lazy loading" by default, which can cause the N+1 query problem. "Eager loading" (using `with`) solves this by loading relationships upfront.',
    code: '// BAD: Triggers N+1 queries\n$books = Book::all();\nforeach ($books as$book) { echo $book->author->name; }\n\n// GOOD: Uses Eager Loading (Only 2 queries total)\n$books = Book::with("author")->get();'
  },
  { 
    id: '16', 
    title: 'Pagination', 
    icon: 'list-circle', 
    color: '#06B6D4', 
    content: 'Paginating database results is simple. Instead of calling `get`, call `paginate`. Laravel automatically takes care of setting the limit, offset, and total pages.',
    code: '// Fetches 15 records per page\n$users = User::paginate(15);\n\n// In Blade view, render the pagination HTML links:\n// {{$users->links() }}'
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

export default function Module10DetailScreen() { 
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

      const introText = "Module 10: Eloquent O R M. Learn how to interact with your database using Laravel's powerful Object Relational Mapper. We will cover creating models, mass assignment, query scopes, and eager loading.";
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
                Module 10
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Eloquent ORM
              </Text>
              <Text className="text-blue-100 text-sm leading-relaxed mb-4">
                Learn how to interact with your database using Laravel's powerful Object-Relational Mapper. We will cover creating models, mass assignment, query scopes, and eager loading.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="cube" size={14} color="#DBEAFE" />
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