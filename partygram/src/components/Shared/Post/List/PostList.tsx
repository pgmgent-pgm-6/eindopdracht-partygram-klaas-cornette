import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Variables } from "@style";
import { getPosts } from "@core/modules/posts/api";
import { CreatePostBody } from "@core/modules/posts/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import LikeComponent from "@shared/likes/likes";
import CommentComponent from "@shared/comment/CommentComponent";
import FavorietenComponent from "@shared/favorites/FavorietenComponent";
import DescriptionComponent from "../description/DescriptionComponent";
import { getPublicUsers } from "@core/modules/auth/api";

const PostList = ({ userBool }: { userBool: boolean }) => {
  const router = useRouter();
  const [posts, setPosts] = useState<CreatePostBody[]>([]);
  const data = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const [postsLenghtBool, setPostsLenghtBool] = useState(false);
  const [activePosts, setActivePosts] = useState<CreatePostBody[]>([]);
  const [publicUsers, setpublicUsers] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      const users = await getPublicUsers();
      if (!users) {
        console.log("Error fetching users");
        return;
      }
      setpublicUsers(users);
      const fetchedPosts = await getPosts();
      if (!fetchedPosts) {
        console.log("Error fetching posts");
        return;
      }
      if (userBool) {
        const filteredPosts = fetchedPosts.filter(
          (post) => post.user_id === data?.user?.id
        );
        setPosts(filteredPosts);
        return;
      }
      setPosts(fetchedPosts);
      const activePosts: CreatePostBody[] = fetchedPosts.slice(0, 10);
      setActivePosts(activePosts);
      reload();
    };
    setPostsLenghtBool(false);
    fetch();
  }, [refreshing]);

  const changeLengthPosts = () => {
    if (postsLenghtBool) {
      const postsFiltered = posts.slice(0, 10);
      setActivePosts(postsFiltered);
    } else {
      const postsFiltered = posts.slice(0, 20);
      setActivePosts(postsFiltered);
    }
  };

  const reload = () => {
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const onRefresh = () => {
    setRefreshing(true);
    reload();
  };

  if (!data?.user?.id) {
    return <Text>Log in om de posts te zien</Text>;
  }

  const handelComment = (id: number | undefined) => {
    router.push(`/post/comment/${id}/create`);
  };

  const handelLinkProfiel = (id: string | undefined, username: string) => {
    if (!id) {
      alert("Er is iets mis gelopen");
    } else {
      router.push(`/(app)/(pages)/profiel/${username}/${id}`);
    }
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activePosts.map((post) => (
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
            <CommentComponent id={post.id} />
          </View>
        ))}
        <View style={styles.container}>
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              { backgroundColor: postsLenghtBool ? "#3498db" : "#2ecc71" },
            ]}
            onPress={() => {
              setPostsLenghtBool(!postsLenghtBool);
              changeLengthPosts();
            }}
          >
            <Text style={styles.buttonText}>
              {postsLenghtBool ? "Minder posts" : "Meer posts"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginTop: Variables.spacing.base,
    margin: Variables.spacing.big,
    marginBottom: Variables.spacing.big,
  },
  postImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    marginTop: Variables.spacing.base,
  },
  postDescription: {
    color: "gray",
    marginTop: Variables.spacing.small,
  },
  commentContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    justifyContent: "flex-start",
  },
  userText: {
    color: "#888888",
    fontSize: Variables.spacing.base,
    marginRight: Variables.spacing.small,
  },
  commentText: {
    fontSize: Variables.spacing.base,
    color: "#aaaaaa",
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
    marginBottom: Variables.spacing.base,
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#fff",
  },
});

export default PostList;
