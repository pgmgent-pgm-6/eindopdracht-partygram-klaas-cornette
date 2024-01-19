import { Tabs, useRouter } from "expo-router";
import { DefaultNavigatorOptions, Variables } from "@style";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";

const getTabIcon = (name: string, focused: boolean) => {
  let icon = "";
  switch (name) {
    case "index":
      icon = "home";
      break;
    case "search":
      icon = "magnify";
      break;
    case "favorieten":
      icon = "star";
      break;
    case "profiel":
      icon = "account";
      break;
  }
  if (focused ? icon : "magify") {
    return icon;
  } else {
    return focused ? icon : `${icon}-outline`;
  }
};

const TabLayout = () => {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Icons
            name={getTabIcon(route.name, focused)}
            size={size}
            color={color}
          />
        ),
        tabBarInactiveTintColor: Variables.colors.gray,
        ...DefaultNavigatorOptions.screenOptions,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Zoeken",
        }}
      />
      <Tabs.Screen
        name="favorieten"
        options={{
          title: "Favorieten",
        }}
      />
      <Tabs.Screen
        name="profiel"
        options={{
          title: "Profiel",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
