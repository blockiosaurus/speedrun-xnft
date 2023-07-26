import { registerRootComponent } from "expo";
import { View } from "react-native";
import { config } from "./config";
// import { RecoilRoot } from "recoil";
// import { ActivityIndicator, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useFonts, Inter_900Black } from "@expo-google-fonts/dev";

// import { ExamplesScreens } from "./screens/ExamplesScreen";
// import { HomeScreen } from "./screens/HomeScreen";
// import { TokenListNavigator } from "./screens/TokenNavigator";
// import { FarmScreen } from "./screens/FarmScreen";

// const Tab = createBottomTabNavigator();

// function TabNavigator() {
//   return (
//     <Tab.Navigator
//       initialRouteName="Game"
//       screenOptions={{
//         tabBarActiveTintColor: "#e91e63",
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarLabel: "Home",
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="account" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="List"
//         component={TokenListNavigator}
//         options={{
//           headerShown: false,
//           tabBarLabel: "Tokens",
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="bank" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Examples"
//         component={ExamplesScreens}
//         options={{
//           tabBarLabel: "Examples",
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="home" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Game"
//         component={FarmScreen}
//         options={{
//           tabBarLabel: "Game",
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="tractor" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

function App() {
  const game = new Phaser.Game(config);
  // let [fontsLoaded] = useFonts({
  //   Inter_900Black,
  // });

  // if (!fontsLoaded) {
  //   return (
  //     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //       <ActivityIndicator />
  //     </View>
  //   );
  // }

  // return (
  //   <RecoilRoot>
  //     <NavigationContainer>
  //       <TabNavigator />
  //     </NavigationContainer>
  //   </RecoilRoot>
  // );
  return (
    <div style={{
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        backgroundColor: "#000000",
        overflow: "hidden"
      }}>
      <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center"
        }} id="phaser-game"></div>
    </div>
  )
}

export default registerRootComponent(App);
