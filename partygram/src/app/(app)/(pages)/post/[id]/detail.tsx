import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LikeComponent from "@shared/likes/likes";
import CommentComponent from "@shared/comment/CommentComponent";
import FavorietenComponent from "@shared/favorites/FavorietenComponent";
import DescriptionComponent from "@shared/Post/description/DescriptionComponent";
import useTitle from "@core/hooks/useTitle";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Variables } from "@style";
import { getPostsById } from "@core/modules/posts/api";
import { Post } from "@core/modules/posts/types";
import { getPublicUsers } from "@core/modules/auth/api";
import { ActivityIndicator } from "react-native";

const PostCommentCreateScreen = () => {
  useTitle("Post");
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | undefined>();
  const [publicUsers, setpublicUsers] = useState<any[]>([]); // [
  const router = useRouter();

  useEffect(() => {
    fetchPostById(id);
  }, []);

  const fetchPostById = async (id: string) => {
    const users = await getPublicUsers();
    if (!users) {
      console.log("Error fetching users");
      return;
    }
    setpublicUsers(users);
    const fetchPost = await getPostsById(id);
    if (!fetchPost) {
      return <Text>Er is iets mis gegaan</Text>;
    }
    setPost(fetchPost);
  };
  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="#0000ff" />
      </View>
    );
  }

  const handelLinkProfiel = (id: string | undefined, username: string) => {
    if (!id) {
      alert("Er is iets mis gelopen");
    } else {
      router.push(`/(app)/(pages)/profiel/${username}/${id}`);
    }
  };

  const handelComment = (id: number | undefined) => {
    router.push(`/post/comment/${id}/create`);
  };

  return (
    <View style={styles.postContainer}>
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
                onPress={() => handelLinkProfiel(post.user_id, user.username)}
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
  );
};

export default PostCommentCreateScreen;

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginTop: Variables.spacing.big,
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
});
