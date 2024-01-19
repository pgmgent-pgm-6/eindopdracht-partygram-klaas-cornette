import MessageForm from "@shared/messages/MessageForm";
import { createChat, getChats } from "@core/modules/chat/api";
import DefaultView from "@design/View/DefaultView";
import { Post } from "@core/modules/posts/types";
import useTitle from "@core/hooks/useTitle";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { createMassage } from "@core/modules/messages/api";
import { Text } from "react-native";
import { CreateChatsBody } from "@core/modules/chat/types";

const ChatCreateScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { username } = useLocalSearchParams<{ username: string }>();
  const [chatId, setChatId] = useState<number>(-1);
  const [dataChats, setData] = useState<any>([]);
  useTitle("Stuur naar " + username + "");

  useFocusEffect(() => {
    checkChatCreate();
    findChatId();
  });

  const checkChatCreate = async () => {
    const data = await getChats();
    if (!data) {
      console.log("no data");
      return (
        <>
          <Text>Error bij ophalen van data</Text>
        </>
      );
    }
    setData(data);
    if (data?.length == 0) {
      console.log("no data");
      if (!user?.user?.id) {
        console.log("no user");
        return (
          <>
            <Text>User ophalen mislukt</Text>
          </>
        );
      }
      const newChat: CreateChatsBody = {
        chater1: user.user.id,
        chater2: id,
      };
      createChat(newChat);
    } else {
      data.forEach((chat: any) => {
        if (chat.chater1 == id && chat.chater2 == user?.user?.id) {
        } else if (chat.chater1 == user?.user?.id && chat.chater2 == id) {
        } else {
          if (!user?.user?.id) {
            console.log("no user");
            return (
              <>
                <Text>User ophalen mislukt</Text>
              </>
            );
          }
          const newChat = {
            chater1: user?.user?.id,
            chater2: id,
          };
          console.log("chat bestaat nog niet");

          createChat(newChat);
        }
      });
    }
  };

  const findChatId = () => {
    dataChats.forEach((chat: CreateChatsBody) => {
      if (chat.id == undefined) {
        return (
          <>
            <Text>Error bij ophalen van data</Text>
          </>
        );
      }
      if (chat.chater1 == id && chat.chater2 == user?.user?.id) {
        setChatId(chat.id);
      } else if (chat.chater1 == user?.user?.id && chat.chater2 == id) {
        setChatId(chat.id);
      } else {
        console.log("chat bestaat niet");
        return (
          <>
            <Text>Error bij ophalen van data</Text>
          </>
        );
      }
    });
  };

  const handleSuccess = (data: Post) => {
    queryClient.invalidateQueries();
    router.push(`/(app)/(pages)/chat/${chatId}/detail`);
  };

  return (
    <DefaultView>
      {chatId == -1 ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <MessageForm
            updateMethod={createMassage}
            onSuccess={handleSuccess}
            initialValues={{ message: "", senders: "", chat_id: chatId }}
            label="Create"
          />
        </>
      )}
    </DefaultView>
  );
};

export default ChatCreateScreen;
