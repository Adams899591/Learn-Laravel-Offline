import { Stack } from "expo-router";
import "../global.css"; // Note:    This should always be on your layout
import { useEffect, useState } from "react";
import { SafeAreaProvider} from "react-native-safe-area-context";

export default function RootLayout() {


  return (
  
       <SafeAreaProvider> 
           <Stack screenOptions={{headerShown: false}} />
        </SafeAreaProvider> 
  
  );
}
