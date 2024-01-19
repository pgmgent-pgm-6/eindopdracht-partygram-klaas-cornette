import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import useTitle from "@core/hooks/useTitle";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getMessages } from "@core/modules/messages/api";
import { StyleSheet } from "react-native";
import MessageForm from "@shared/messages/MessageForm";
import { createMassage } from "@core/modules/messages/api";
import { ScrollView } from "react-native-gesture-handler";
import DefaultView from "@design/View/DefaultView";

const chatUserPage = () => {
  const [messages, setMessages] = useState<any>([]);
  const { id } = useLocalSearchParams<{ id: string }>();

  const chatId = parseInt(id);
  const user = useAuthContext();
  useTitle("Berichten");

  useFocusEffect(() => {
    fetchMessages();
  });

  const fetchMessages = async () => {
    const data = await getMessages();
    if (!data) {
      console.log("no data");
      return (
        <>
          <Text>Geen berichten</Text>
        </>
      );
    }
    const filteredData = data.filter((message: any) => {
      if (message.chat_id == id) {
        return message;
      } else {
        return null;
      }
    });
    setMessages(filteredData);
  };

  const handleSuccess = () => {
    fetchMessages();
  };

  return (
    <>
    {/* <DefaultView> */}
      <ScrollView style={{marginBottom: 150}}>
        {messages.map((massage: any) => (
          <View key={massage.id}>
            {massage.senders == user?.user?.id ? (
              <Text style={styles.sender}>{massage.message}</Text>
            ) : (
              <Text style={styles.resever}>{massage.message}</Text>
            )}
          </View>
        ))}
        
      </ScrollView>
      {/* </DefaultView> */}
      <View style={{ position: "absolute", bottom: 0, width:"100%" }}>
      <MessageForm
          
          updateMethod={createMassage}
          onSuccess={handleSuccess}
          initialValues={{ message: "", senders: "", chat_id: chatId }}
          label="Create"
        />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  sender: {
    backgroundColor: "blue",
    color: "white",
    alignSelf: "flex-end",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  resever: {
    backgroundColor: "gray",
    color: "white",
    alignSelf: "flex-start",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
});

export default chatUserPage;
