import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import HeaderButton from "@design/Button/HeaderButton";
import PostList from "@shared/Post/List/PostList";
import { Variables } from "@style";
import { useFocusEffect } from "@react-navigation/native";
import { getBooleanValue } from "@shared/async/storage";

const Homescreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [switchOnStories, setSwitchOnStories] = useState<any>(false);

  const handleAddProject = () => {
    router.push("/(app)/(pages)/post/create");
  };

  const handleAddStory = () => {
    router.push("/(app)/(pages)/story/create");
  };

  const handelWatchStories = () => {
    router.push("/(app)/(pages)/story/story");
  };

  const handelMessages = () => {
    router.push("/(app)/(pages)/chat/chats");
  };

  useFocusEffect(() => {
    getBooleanValue("key2").then((value) => {
      setSwitchOnStories(value);
    });
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.row}>
          <Text style={styles.headerText}>Post</Text>
          <HeaderButton
            onPress={handleAddProject}
            title="Add posts"
            icon="plus"
            style={styles.headerButton}
          />
          <View style={styles.spacing}></View>
          <HeaderButton
            onPress={handelMessages}
            title="Go to massages"
            icon="message"
            style={styles.headerButton}
          />
          <View style={styles.spacing}></View>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <>
      {switchOnStories ? (
        <View style={styles.rowVerhaal}>
          <TouchableOpacity onPress={handleAddStory}>
            <Image
              style={styles.image}
              source={require("@assets/images/img/add-instagram-reel.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handelWatchStories}>
            <Image
              style={styles.image}
              source={require("@assets/images/img/instagram.png")}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Text></Text>
      )}
      <PostList userBool={false} />
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  rowVerhaal: {
    flexDirection: "row",
    alignItems: "center",
    gap: Variables.spacing.big,
    justifyContent: "center",
  },
  headerText: {
    color: "white",
    fontSize: Variables.sizes.medium,
    marginRight: Variables.spacing.small,
  },
  headerButton: {
    height: 30,
  },
  spacing: {
    width: Variables.spacing.base,
  },
  image: {
    width: 50,
    height: 50,
    margin: Variables.spacing.base,
  },
});

export default Homescreen;
