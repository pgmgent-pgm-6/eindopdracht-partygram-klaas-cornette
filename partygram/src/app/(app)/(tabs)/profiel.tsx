import { logout } from "@core/modules/auth/api";
import ListItem from "@design/List/ListItem";
import UserHeader from "@shared/User/UserHeader";
import { FlatList, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { getPosts } from "@core/modules/posts/api";
import { CreatePostBody } from "@core/modules/posts/types";
import { RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { Variables } from "@style";
import { useNavigation, useRouter } from "expo-router";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import { Icon } from "react-native-elements";
import { ActivityIndicator } from "react-native";

enum ListType {
  Profile = "profile",
}

type Item = {
  key: ListType | string;
  title?: string;
  color?: string;
  icon?: string;
  onPress: () => void;
};

const ProfielScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [posts, setPosts] = useState<CreatePostBody[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const data = useAuthContext();
  const items: Item[] = [
    {
      key: ListType.Profile,
      onPress: () => {
        router.push("/settings/edit");
      },
    },
  ];

  const handelSettings = () => {
    router.push("/settings/settings");
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getPosts();
        if (!fetchedPosts) {
          console.log("Error fetching posts");
          return;
        }
        const filteredPosts = fetchedPosts.filter(
          (post) => post.user_id === data?.user?.id
        );
        setPosts(filteredPosts);
        setLoading(false);
        console.log("klaar")
      } catch (error) {
        console.error("Error fetching posts:", error);
      }

      reload();
    };
    fetch();
  }, [refreshing]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 16 }}>
          <TouchableOpacity onPress={handelSettings}>
            <Icons
              name={"cog"}
              size={24}
              color={"#fff"}
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
          <Icon
            name="logout"
            type="material-community"
            color="#fff"
            onPress={logout}
          />
        </View>
      ),
    });
  }, [navigation]);

  const reload = () => {
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const onRefresh = () => {
    setRefreshing(true);
    reload();
  };

  const handelLink = (id: number | undefined) => {
    if (!id) {
      alert("Er is iets mis gelopen");
    } else {
      router.push(`/(app)/(pages)/post/${id}/detail`);
    }
  };

  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={items}
        renderItem={({ item }) =>
          item.key === ListType.Profile ? (
            <UserHeader onPress={item.onPress} />
          ) : (
            <ListItem
              title={item.title ?? ""}
              color={item.color}
              onPress={item.onPress}
              icon={item.icon}
              iconColor={item.color}
            />
          )
        }
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.postContainer}>
          {posts.map((post) => (
            <View style={{ marginTop: Variables.spacing.small }} key={post.id}>
              <TouchableOpacity onPress={() => handelLink(post.id)}>
                <Image
                  style={styles.postImage}
                  source={{ uri: post.picture }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    margin: Variables.spacing.big,
    marginTop: Variables.spacing.small,
    marginBottom: 150,
  },
  postImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
});

export default ProfielScreen;
