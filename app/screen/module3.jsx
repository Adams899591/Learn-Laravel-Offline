import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

const lessonContent = [
  { 
    id: '1', 
    title: 'Laravel Architecture', 
    icon: 'business', 
    color: '#EF4444', 
    content: 'Laravel\'s request lifecycle is the heart of its architecture. Requests enter through public/index.php, are sent to the HTTP/Console Kernel, pass through a stack of Middleware, and are then routed to your Controllers. Service Providers bootstrap all core framework components.',
    code: '// 1. Entry Point (public/index.php)\n$app = require_once __DIR__."/../bootstrap/app.php";\n$kernel =$app->make(Kernel::class);\n\n// 2. Request Handling\n$response =$kernel->handle(\n  $request = Request::capture()\n)->send();\n\n// 3. Termination\n$kernel->terminate($request,$response);'
  },
  { 
    id: '2', 
    title: 'MVC Pattern', 
    icon: 'git-merge', 
    color: '#3B82F6', 
    content: 'Models interact with the database (Eloquent ORM). Controllers handle the HTTP request, process business logic, and fetch Data from Models. Views render the final HTML (Blade templates). They work together to separate concerns.',
    code: '// MODEL (User.php)\nclass User extends Model {\n  protected $fillable = ["name", "email"];\n}\n\n// CONTROLLER (UserController.php)\nclass UserController extends Controller {\n  public function index() {\n    $users = User::active()->get();\n    return view("users.index", ["users" => $users]);\n  }\n}\n\n// VIEW (users/index.blade.php)\n// @foreach($users as $user)\n//   <p>{{$user->name }}</p>\n// @endforeach'
  },
  { 
    id: '3', 
    title: 'Directory Structure', 
    icon: 'folder', 
    color: '#F59E0B', 
    content: 'Laravel has a highly structured file system. /app contains core logic (Models, Controllers). /bootstrap handles framework startup. /database contains migrations and seeders. /routes defines your URLs. /storage holds logs, compiled templates, and user uploads.',
    code: '// Key Paths & Helpers\n$appPath = app_path("Http/Controllers");\n$basePath = base_path(".env");\n$configPath = config_path("database.php");\n$databasePath = database_path("migrations");\n$publicPath = public_path("css/app.css");\n$resourcePath = resource_path("views");\n$storagePath = storage_path("logs/laravel.log");'
  },
  { 
    id: '4', 
    title: 'Configuration', 
    icon: 'settings', 
    color: '#8B5CF6', 
    content: 'The /config directory holds all global settings. You interact with them using the config() helper. Values can be deeply nested arrays. In production, you run php artisan config:cache to combine all config files into a single fast-loading file.',
    code: '// Retrieving Config Values\n$timezone = config("app.timezone");\n$dbDriver = config("database.default");\n\n// Getting nested values with dot notation\n$mailHost = config("mail.mailers.smtp.host");\n\n// Providing a default fallback value\n$cacheDriver = config("cache.default", "file");\n\n// Setting config values at runtime (not permanent)\nconfig(["app.locale" => "fr"]);'
  },
  { 
    id: '5', 
    title: 'Environment Variables', 
    icon: 'leaf', 
    color: '#10B981', 
    content: 'Environment variables dictate how your app behaves on different servers (local, staging, prod). The env() function reads these values. Warning: NEVER use env() outside of /config files! If you run config:cache, env() calls in your controllers will return null.',
    code: '// Correct Usage (Inside a /config file)\n"debug" => env("APP_DEBUG", false),\n"url" => env("APP_URL", "http://localhost"),\n\n// INCORRECT Usage (Inside a Controller)\n// $key = env("API_KEY"); // Will fail if config is cached\n\n// CORRECT Usage (Inside a Controller)\n$key = config("services.api.key");'
  },
  { 
    id: '6', 
    title: '.env File (Deep Dive)', 
    icon: 'lock-closed', 
    color: '#6366F1', 
    content: 'The .env file defines all sensitive and server-specific credentials. It is never committed to Git. A typical Laravel application has extensive .env configurations for databases, caching, mailing, and third-party services like AWS or Stripe.',
    code: 'APP_NAME="My Awesome App"\nAPP_ENV=production\nAPP_KEY=base64:xYZ...=\nAPP_DEBUG=false\nAPP_URL=https://myapp.com\n\nLOG_CHANNEL=daily\nLOG_DEPRECATIONS_CHANNEL=null\nLOG_LEVEL=error\n\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=forge_prod\nDB_USERNAME=forge_user\nDB_PASSWORD=secret_password\n\nBROADCAST_DRIVER=pusher\nCACHE_DRIVER=redis\nFILESYSTEM_DISK=s3\nQUEUE_CONNECTION=database\nSESSION_DRIVER=redis\nSESSION_LIFETIME=120\n\nMEMCACHED_HOST=127.0.0.1\nREDIS_HOST=127.0.0.1\nREDIS_PASSWORD=null\nREDIS_PORT=6379\n\nMAIL_MAILER=smtp\nMAIL_HOST=smtp.mailgun.org\nMAIL_PORT=587\nMAIL_USERNAME=postmaster@myapp.com\nMAIL_PASSWORD=mailgun_secret\nMAIL_ENCRYPTION=tls\nMAIL_FROM_ADDRESS="hello@myapp.com"\n\nAWS_ACCESS_KEY_ID=AKIA...\nAWS_SECRET_ACCESS_KEY=secret...\nAWS_DEFAULT_REGION=us-east-1\nAWS_BUCKET=my-app-uploads'
  },
  { 
    id: '7', 
    title: 'Config Files', 
    icon: 'document-text', 
    color: '#06B6D4', 
    content: 'A config file simply returns a PHP array. It maps the raw environment variables from your .env file into a structured, application-wide format. This allows you to group related settings logically.',
    code: '// Example: config/database.php\nreturn [\n  "default" => env("DB_CONNECTION", "mysql"),\n  "connections" => [\n    "mysql" => [\n      "driver" => "mysql",\n      "url" => env("DATABASE_URL"),\n      "host" => env("DB_HOST", "127.0.0.1"),\n      "port" => env("DB_PORT", "3306"),\n      "database" => env("DB_DATABASE", "forge"),\n      "username" => env("DB_USERNAME", "forge"),\n      "password" => env("DB_PASSWORD", ""),\n      "unix_socket" => env("DB_SOCKET", ""),\n      "charset" => "utf8mb4",\n      "collation" => "utf8mb4_unicode_ci",\n      "prefix" => "",\n      "strict" => true,\n      "engine" => null,\n    ],\n  ],\n];'
  },
  { 
    id: '8', 
    title: 'Artisan Commands (Deep Dive)', 
    icon: 'terminal', 
    color: '#14B8A6', 
    content: 'Artisan is Laravel\'s powerful CLI. Here is an extensive list of the commands you will use daily to generate files, manage databases, map routes, handle background jobs, and optimize your app.',
    code: '// 1. Basic & Environment\nphp artisan serve\nphp artisan list\nphp artisan tinker\nphp artisan key:generate\nphp artisan down\nphp artisan up\n\n// 2. Generators (make:)\nphp artisan make:controller UserController\nphp artisan make:model User -mcr\nphp artisan make:middleware CheckAdmin\nphp artisan make:request StoreUserRequest\nphp artisan make:seeder UserSeeder\nphp artisan make:mail WelcomeEmail\nphp artisan make:event UserRegistered\nphp artisan make:job ProcessPodcast\nphp artisan make:component Alert\nphp artisan make:command SendEmails\n\n// 3. Database & Migrations\nphp artisan migrate\nphp artisan migrate:rollback\nphp artisan migrate:fresh --seed\nphp artisan migrate:status\nphp artisan db:seed\nphp artisan model:prune\n\n// 4. Routing\nphp artisan route:list\nphp artisan route:clear\nphp artisan route:cache\n\n// 5. Caching & Optimization\nphp artisan optimize\nphp artisan optimize:clear\nphp artisan config:cache\nphp artisan config:clear\nphp artisan view:cache\nphp artisan view:clear\nphp artisan event:cache\n\n// 6. Queues & Jobs\nphp artisan queue:work\nphp artisan queue:listen\nphp artisan queue:retry all\nphp artisan queue:failed\nphp artisan queue:clear\n\n// 7. Storage\nphp artisan storage:link'
  },
  { 
    id: '9', 
    title: 'Laravel Helpers (Deep Dive)', 
    icon: 'flash', 
    color: '#EC4899', 
    content: 'Helpers provide convenient shortcuts for common PHP operations. They cover Arrays, Strings, URLs, Paths, and generic app functions. Many modern apps use the facade equivalents (like Str:: or Arr::), but global helpers are still widely used.',
    code: '// Array Helpers\n$first = Arr::first($array);\n$dot = Arr::get($array, "user.details.name");\n$filtered = Arr::where($array, function($v) { return $v > 5; });\n\n// String Helpers\n$slug = Str::slug("Hello World!"); // hello-world\n$uuid = Str::uuid();\n$plural = Str::plural("car"); // cars\n$masked = Str::mask("secret@email.com", "*", 3);\n\n// App & Path Helpers\n$app = app(); // Gets service container\n$user = auth()->user(); // Gets logged in user\n$req = request()->all(); // Gets all request data\n$route = route("profile", ["id" => 1]); // URL generation\n\n// Utility Helpers\n$collection = collect([1, 2, 3]); // Creates Laravel Collection\ntap($user, function($user) { $user->name = "Bob"; })->save();\n$isNull = blank(""); // true\n$hasValue = filled("text"); // true\nabort_if(! $isAdmin, 403);'
  },
  { 
    id: '10', 
    title: 'Service Container (Deep Dive)', 
    icon: 'cube', 
    color: '#F97316', 
    content: 'The Service Container is an advanced registry for managing class dependencies. It allows you to "bind" interfaces to implementations, and automatically injects dependencies (Dependency Injection) into controllers, jobs, and middleware without you manually instantiating them.',
    code: '// 1. Basic Binding (Returns new instance every time)\napp()->bind(PaymentGateway::class, StripeGateway::class);\n\n// 2. Singleton Binding (Returns the same instance)\napp()->singleton(CacheManager::class, function ($app) {\n  return new CacheManager(config("cache.driver"));\n});\n\n// 3. Resolving explicitly\n$gateway = app()->make(PaymentGateway::class);\n// Or using the helper\n$gateway = app(PaymentGateway::class);\n\n// 4. Automatic Dependency Injection (The Magic!)\n// Laravel sees the type-hint and injects StripeGateway automatically.\nclass OrderController extends Controller {\n  public function store(PaymentGateway $payment) {\n$payment->charge(100);\n  }\n}'
  },
];

// Helper function to syntax highlight the PHP code blocks
const renderHighlightedCode = (codeText) => {
  if (!codeText) return null;

  // Added extra keywords like protected, private, static, null for better OOP highlighting
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

export default function Module3DetailScreen() { 
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

      const introText = "Module 3: Laravel Fundamentals. Understand the core structure of a Laravel application. Explore the MVC architecture, directory layout, environment configuration, and powerful tools like Artisan.";
      Speech.speak(introText, { rate: 0.9 });

      lessonContent.forEach((lesson, index) => {
        let topicSpeech = `Topic ${index + 1}: ${lesson.title}. ${lesson.content}`;
        
        // This has been updated to append the actual code string instead of "Code snippet provided in text."
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
                Module 3
              </Text>
              <View className="w-10 h-10" /> 
            </View>

            <View>
              <Text className="text-white text-3xl font-extrabold tracking-wide mb-2">
                Laravel Fundamentals
              </Text>
              <Text className="text-red-100 text-sm leading-relaxed mb-4">
                Understand the core structure of a Laravel application. Explore the MVC architecture, directory layout, environment configuration, and powerful tools like Artisan.
              </Text>
              
              <View className="flex-row items-center space-x-3">
                <View className="flex-row items-center bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Ionicons name="document-text" size={14} color="#FECDD3" />
                  <Text className="text-white text-xs font-semibold ml-1.5">{lessonContent.length} Topics</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReadAloud}
                  className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSpeaking ? 'bg-white border-white' : 'bg-black/10 border-white/10'}`}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={14} 
                    color={isSpeaking ? "#FF3B30" : "#FECDD3"} 
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