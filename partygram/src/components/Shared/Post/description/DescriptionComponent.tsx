import { Variables } from "@style";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
const DescriptionComponent = ({
  text,
}: {
  text: string | null | undefined;
}) => {
  if (!text) {
    return null;
  }
  const words = text.split(" ");
  const detectHashtags = (word: string) => {
    if (word.startsWith("#")) {
      return true;
    }
    return false;
  };

  const handelLink = (word: string) => {
    const newWord = word.replace("#", "");
    router.push(`/(app)/(pages)/search/${newWord}/search`);
  };

  return (
    <View style={styles.container}>
      {words.map((word, index) => (
        <View style={styles.space} key={index}>
          {detectHashtags(word) ? (
            <TouchableOpacity onPress={() => handelLink(word)}>
              <Text style={styles.hashtag}>{word}</Text>
            </TouchableOpacity>
          ) : (
            <Text>{word}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default DescriptionComponent;

const styles = StyleSheet.create({
  space: {
    marginRight: 4,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Variables.spacing.small,
    marginBottom: Variables.spacing.small,
  },
  hashtag: {
    color: "blue",
  },
});
