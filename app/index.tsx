import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {

  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => router.push("/home")} >
        <Text>Tap this to go to home page</Text>
      </TouchableOpacity>
      <Text >Edit app/index.tsx to editen.    </Text>
    </View>
  );
}
