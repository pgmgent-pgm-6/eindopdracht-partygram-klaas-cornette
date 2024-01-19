import { useRouter, useLocalSearchParams } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useState } from "react";
import { getPosts } from "@core/modules/posts/api";
import { CreatePostBody } from "@core/modules/posts/types";
import { RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { Variables } from "@style";
import useTitle from "@core/hooks/useTitle";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { getChats, createChat } from "@core/modules/chat/api";

const ProfielScreen = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<CreatePostBody[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { username } = useLocalSearchParams<{ username: string }>();
  const user = useAuthContext();
  useTitle("Profiel van " + username + "");
  useEffect(() => {
    const fetch = async () => {
      if (username == user.user?.username) {
        router.push(`/(app)/(tabs)/profiel`);
      }
      try {
        const fetchedPosts = await getPosts();
        if (!fetchedPosts) {
          console.log("Error fetching posts");
          return;
        }
        const filteredPosts = fetchedPosts.filter((post) => post.user_id == id);
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      reload();
    };
    fetch();
  }, [refreshing]);

  const reload = () => {
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  if (!posts) {
    return <Text>Loading...</Text>;
  }

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

  const handelChat = async (id: string) => {
    let chatId: number = -1;
    const data = await getChats();
    if (!user?.user?.id) {
      console.log("no user");
      return (
        <>
          <Text>User ophalen mislukt</Text>
        </>
      );
    }
    if (!data) {
      console.log("no data");
      return (
        <>
          <Text>Error bij ophalen van data</Text>
        </>
      );
    }
    if (data?.length == 0) {
      console.log("no data");
    } else {
      data.forEach((chat: any) => {
        if (
          (chat.chater1 === id && chat.chater2 === user?.user?.id) ||
          (chat.chater1 === user?.user?.id && chat.chater2 === id)
        ) {
          console.log("chat bestaat al");
          chatId = chat.id;
        }
      });
    }
    const newChat = {
      chater1: user.user.id,
      chater2: id,
    };
    if (chatId == -1) {
      console.log("chat bestaat nog niet");
      chatId = await createChat(newChat);
    }
    router.push(`/(app)/(pages)/chat/${chatId}/detail`);
  };

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TouchableOpacity
          onPress={() => handelChat(posts[0].user_id)}
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="chat" type="material" size={30} color="#00aaff" />
            <Text style={{ color: "#00aaff", marginLeft: 5, fontSize: 30 }}>
              Chat met {username}
            </Text>
          </View>
        </TouchableOpacity>
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
    marginTop: Variables.spacing.base,
    margin: Variables.spacing.big,
    marginBottom: Variables.spacing.big,
  },
  postImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
});

export default ProfielScreen;
