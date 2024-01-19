import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPosts } from "@core/modules/posts/api";
import { CreatePostBody } from "@core/modules/posts/types";
import { useState } from "react";
import { Variables } from "@style";
import { StyleSheet } from "react-native";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { getFavorites } from "@core/modules/favorites/api";
import { RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LikeComponent from "@shared/likes/likes";
import FavorietenComponent from "@shared/favorites/FavorietenComponent";
import DescriptionComponent from "@shared/Post/description/DescriptionComponent";
import { useRouter } from "expo-router";
import { getPublicUsers } from "@core/modules/auth/api";
import { ActivityIndicator } from "react-native";

const FavorietenScreen = () => {
  const data = useAuthContext();
  const [posts, setPosts] = useState<CreatePostBody[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [publicUsers, setpublicUsers] = useState<any[]>([]);
  const router = useRouter();

  useFocusEffect(() => {
    fetchLikedPosts();
  });

  const reload = () => {
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const onRefresh = () => {
    setRefreshing(true);
    reload();
  };

  const fetchLikedPosts = async () => {
    const users = await getPublicUsers();
    if (!users) {
      console.log("Error fetching users");
      return;
    }
    setpublicUsers(users);
    let filteredPosts: CreatePostBody[] = [];
    const fetchedPosts = await getPosts();
    const favorite = await getFavorites();
    if (!favorite || !fetchedPosts) {
      console.log("Error fetching");
      alert("Error");
      return;
    }
    const filteredFavorite = favorite.filter(
      (favo) => favo.user_id === data?.user?.id
    );
    filteredFavorite.forEach((like) => {
      filteredPosts.push(
        fetchedPosts.filter((post) => post.id === like.post_id)[0]
      );
    });
    if (filteredPosts.length == 0) {
      return (
        <View style={styles.container}>
          <Text>Geen favorieten gevonden</Text>
        </View>
      );
    }
    setPosts(filteredPosts);
  };
  const handelLinkProfiel = (id: string, username: string) => {
    if (!id) {
      alert("Er is iets mis gelopen");
    } else {
      router.push(`/(app)/(pages)/profiel/${username}/${id}`);
    }
  };

  const handelComment = (id: number | undefined) => {
    router.push(`/post/comment/${id}/create`);
  };

  if (posts.length == 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          {posts.map((post) => (
            <View key={post.id} style={styles.postContainer}>
              <Image style={styles.postImage} source={{ uri: post.picture }} />
              <View style={styles.row}>
                <LikeComponent id={post.id} />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => handelComment(post.id)}
                >
                  <Ionicons name="chatbubble-outline" size={24} color="black" />
                </TouchableOpacity>
                <FavorietenComponent id={post.id} />
              </View>

              <View style={styles.inline}>
                {publicUsers.map((user: any) => {
                  if (user.user_id == post.user_id) {
                    return (
                      <TouchableOpacity
                        key={user.id}
                        style={styles.evenout}
                        onPress={() =>
                          handelLinkProfiel(post.user_id, user.username)
                        }
                      >
                        <Text style={styles.bold}>{user.username}:</Text>
                      </TouchableOpacity>
                    );
                  }
                })}
                <DescriptionComponent text={post.description} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FavorietenScreen;

const styles = StyleSheet.create({
  postContainer: {
    marginLeft: Variables.spacing.big,
    marginRight: Variables.spacing.big,
    flexDirection: "column",
    justifyContent: "center",
  },
  postImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginTop: Variables.spacing.big,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    marginTop: Variables.spacing.base,
  },
  inline: {
    flexDirection: "row",
  },
  evenout: {
    marginTop: 6,
    marginRight: Variables.spacing.small,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
