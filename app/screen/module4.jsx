import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'Basic Routes', 
    icon: 'git-commit', 
    color: '#3B82F6', 
    content: 'The most basic Laravel routes accept a URI and a closure, providing a very simple and expressive method of defining routes and behavior without complicated routing configuration files.',
    code: 'use Illuminate\\Support\\Facades\\Route;\n\nRoute::get("/hello", function () {\n  return "Hello World";\n});'
  },
  { 
    id: '2', 
    title: 'GET Routes', 
    icon: 'download', 
    color: '#10B981', 
    content: 'GET routes are used to request data from a specified resource. In a web application, these are typically used to load HTML pages or fetch JSON data from an API.',
    code: '// Pointing to a Controller method\nRoute::get("/users", [UserController::class, "index"]);\n\n// Rendering a view directly\nRoute::view("/about", "pages.about", ["title" => "About Us"]);'
  },
  { 
    id: '3', 
    title: 'POST Routes', 
    icon: 'cloud-upload', 
    color: '#F59E0B', 
    content: 'POST routes are used to send data to a server to create or update a resource. Any HTML form pointing to a POST route must include a CSRF token field for security.',
    code: 'Route::post("/users", [UserController::class, "store"]);\n\n// Inside a Blade form:\n// <form method="POST" action="/users">\n//   @csrf\n//   ...\n// </form>'
  },
  { 
    id: '4', 
    title: 'PUT & PATCH Routes', 
    icon: 'sync', 
    color: '#8B5CF6', 
    content: 'PUT and PATCH are used to update existing resources. PUT is typically used to replace an entire resource, while PATCH is used to apply partial modifications.',
    code: 'Route::put("/users/{id}", [UserController::class, "update"]);\nRoute::patch("/users/{id}/status", [UserController::class, "updateStatus"]);\n\n// HTML forms don\'t support PUT/PATCH natively, use method spoofing:\n// <input type="hidden" name="_method" value="PUT">'
  },
  { 
    id: '5', 
    title: 'DELETE Routes', 
    icon: 'trash', 
    color: '#EF4444', 
    content: 'DELETE routes are specifically designed to handle requests that remove a resource from the server (like deleting a user or a post).',
    code: 'Route::delete("/users/{id}", [UserController::class, "destroy"]);\n\n// Using method spoofing in Blade:\n// @method("DELETE")'
  },
  { 
    id: '6', 
    title: 'Route Parameters', 
    icon: 'code', 
    color: '#06B6D4', 
    content: 'Sometimes you will need to capture segments of the URI within your route. For example, you may need to capture a user\'s ID from the URL.',
    code: 'Route::get("/posts/{post}/comments/{comment}", function ($postId,$commentId) {\n  return "Post: " . $postId . ", Comment: " . $commentId;\n});'
  },
  { 
    id: '7', 
    title: 'Optional Parameters', 
    icon: 'help-circle', 
    color: '#F97316', 
    content: 'You may occasionally need to specify a route parameter, but make the presence of that URI segment optional. You may do so by placing a ? mark after the parameter name.',
    code: 'Route::get("/users/{name?}", function ($name = "Guest") {\n  return "Welcome, " . $name;\n});'
  },
  { 
    id: '8', 
    title: 'Named Routes', 
    icon: 'pricetag', 
    color: '#14B8A6', 
    content: 'Named routes allow the convenient generation of URLs or redirects for specific routes. You can specify a name for a route by chaining the name method onto the route definition.',
    code: 'Route::get("/user/profile", [UserProfileController::class, "show"])->name("profile");\n\n// Generating URLs to named routes\n$url = route("profile");\n\n// Redirecting to named routes\nreturn redirect()->route("profile");'
  },
  { 
    id: '9', 
    title: 'Route Groups', 
    icon: 'folder', 
    color: '#6366F1', 
    content: 'Route groups allow you to share route attributes, such as middleware, across a large number of routes without needing to define those attributes on each individual route.',
    code: 'Route::middleware(["auth", "admin"])->group(function () {\n  Route::get("/dashboard", function () {\n    // Uses Auth & Admin Middleware\n  });\n  Route::get("/settings", function () {\n    // Uses Auth & Admin Middleware\n  });\n});'
  },
  { 
    id: '10', 
    title: 'Route Prefixes', 
    icon: 'link', 
    color: '#EC4899', 
    content: 'The prefix method may be used to prefix each route in the group with a given URI. For example, you may want to prefix all route URIs within the group with "admin".',
    code: 'Route::prefix("admin")->group(function () {\n  Route::get("/users", function () {\n    // Matches The "/admin/users" URL\n  });\n});'
  },
  { 
    id: '11', 
    title: 'Route Constraints', 
    icon: 'lock-closed', 
    color: '#EF4444', 
    content: 'You can constrain the format of your route parameters using the "where" method on a route instance. This is useful for ensuring an ID is always a number.',
    code: 'Route::get("/user/{id}", function ($id) {\n  // Only executed if {id} is numeric\n})->where("id", "[0-9]+");\n\nRoute::get("/user/{name}", function ($name) {\n  // Only executed if {name} contains letters\n})->where("name", "[A-Za-z]+");'
  },
  { 
    id: '12', 
    title: 'Route Model Binding', 
    icon: 'cube', 
    color: '#3B82F6', 
    content: 'When injecting a model ID to a route or controller action, you will often query the database to retrieve the model. Laravel route model binding provides a convenient way to automatically inject the model instances.',
    code: '// Laravel automatically fetches the User model matching the ID\nRoute::get("/users/{user}", function (User $user) {\n  return$user->email;\n});\n\n// Binding by a column other than ID (e.g. slug)\nRoute::get("/posts/{post:slug}", function (Post $post) {\n  return$post;\n});'
  },
  { 
    id: '13', 
    title: 'Resource Routes', 
    icon: 'layers', 
    color: '#10B981', 
    content: 'Laravel resource routing assigns the typical "CRUD" routes to a controller with a single line of code. It automatically creates routes for index, create, store, show, edit, update, and destroy actions.',
    code: 'use App\\Http\\Controllers\\PhotoController;\n\nRoute::resource("photos", PhotoController::class);\n\n// You can also limit the generated routes:\nRoute::resource("photos", PhotoController::class)->only([\n  "index", "show"\n]);'
  },
];

// Helper function to syntax highlight the PHP code blocks
const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;

  const regex = /(?:\/\/.*)|(?:["'].*?["'])|(?:\$[a-zA-Z_]\w*)|(?:\b(?:echo|function|return|class|public|protected|private|static|new|if|else|elseif|switch|foreach|extends|implements|interface|trait|use|namespace|try|catch|throw|true|false|null)\b)/g;

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

    if (token.startsWith('//')) {
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

export default function Module4DetailScreen() { 
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

      const introText = "Module 4: Laravel Routing. Learn how to map URLs to your controllers and closures. We will cover HTTP verbs, route parameters, grouping, model binding, and resourceful routes.";
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
                Module 4
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Laravel Routing
              </Text>
              <Text className="text-emerald-100 text-sm leading-relaxed mb-4">
                Learn how to map URLs to your controllers and closures. We will cover HTTP verbs, route parameters, grouping, model binding, and resourceful routes.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="git-network" size={14} color="#D1FAE5" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#10B981" : "#D1FAE5"} 
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