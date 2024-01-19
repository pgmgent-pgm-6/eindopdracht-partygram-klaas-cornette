import React, { useEffect, useState } from "react";
import { CreateChatsBody } from "@core/modules/chat/types";
import { getChats } from "@core/modules/chat/api";
import { Text, View, TouchableOpacity } from "react-native";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import useTitle from "@core/hooks/useTitle";
import { useRouter } from "expo-router";
import { getPublicUsers } from "@core/modules/auth/api";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";

const chatUserPage = () => {
  const [chats, setChats] = useState<any>([]);
  const [publicUsers, setpublicUsers] = useState<any[]>([]);
  const user = useAuthContext();
  const router = useRouter();
  useTitle("Berichten");

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const users = await getPublicUsers();
    if (!users) {
      console.log("Error fetching users");
      return;
    }
    setpublicUsers(users);
    const data = await getChats();
    if (!data) {
      console.log("no data");
      return (
        <>
          <Text>Geen berichten</Text>
        </>
      );
    }
    const filteredData = data.filter((chat: any) => {
      if (chat.chater1 == user?.user?.id || chat.chater2 == user?.user?.id) {
        return chat;
      } else {
        return null;
      }
    });
    console.log("filteredData", filteredData);
    setChats(filteredData);
  };

  const handelDetaiChat = (id: number | undefined) => {
    router.push(`/(app)/(pages)/chat/${id}/detail`);
  };

  if (chats.length == 0) {
    return (
      <>
        <View style={styles.container}>
          <ActivityIndicator size={"large"} color="#0000ff" />
        </View>
      </>
    );
  }

  return (
    <>
      {chats.map((chat: CreateChatsBody) => (
        <View key={chat.id} style={styles.card}>
          <TouchableOpacity
            onPress={() => handelDetaiChat(chat.id)}
            style={styles.row}
          >
            <Text style={styles.title}>Chat met:</Text>
            {publicUsers.map((user: any) => {
              if (
                user.user_id === chat.chater1 ||
                user.user_id === chat.chater2
              ) {
                return (
                  <Text key={user.id} style={styles.username}>
                    {user.username}
                  </Text>
                );
              }
            })}
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  username: {
    fontSize: 18,
    marginRight: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default chatUserPage;
