import React, { useEffect, useState } from "react";
import { Text, Image, ActivityIndicator, View } from "react-native";
import useTitle from "@core/hooks/useTitle";
import { getStories } from "@core/modules/stories/api";
import { CreateStoriesBody } from "@core/modules/stories/types";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const storyList = () => {
  useTitle("Verhalen");
  const [stories, setStories] = useState<CreateStoriesBody[]>([]);
  const [story, setStory] = useState<CreateStoriesBody>();
  const [storyBool, setStoryBool] = useState<boolean>(true);

  useEffect(() => {
    app();
  }, []);

  const fetchStories = async () => {
    const stories = await getStories();
    if (!stories) {
      console.log("Error fetching stories");
      return <Text>"Error bij het ophalen van de verhalen"</Text>;
    }

    let userIds: string[] = [];
    let filteredStories: CreateStoriesBody[] = [];

    stories.forEach((story) => {
      if (!userIds.includes(story.user_id)) {
        userIds.push(story.user_id);
        filteredStories.push(story);
      }
    });
    setStories(filteredStories);
    return filteredStories;
  };

  const app = async () => {
    setStory(undefined);
    setStoryBool(true);
    const data: any = await fetchStories().finally(() => {
      let index = 0;
      const updateStories = (stories: CreateStoriesBody[]) => {
        if (index < stories.length) {
          setStory(stories[index]);
          index++;
        } else {
          clearInterval(intervalId);
          setStoryBool(false);
        }
      };
      const intervalId = setInterval(() => updateStories(data), 5000);
    });
  };

  if (!stories) {
    return <Text>Geen verhalen gevonden</Text>;
  }
  if (!story) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      {storyBool ? (
        <Image style={styles.image} source={{ uri: story.picture }} />
      ) : (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => app()} style={styles.button}>
            <Text style={styles.color}>Verhaal opnieuw afspelen</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default storyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
  },
  color: {
    color: "white",
  },
});
