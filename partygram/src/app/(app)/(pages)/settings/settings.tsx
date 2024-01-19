import React, { useState, useEffect } from "react";
import { Switch, View, Text } from "react-native";
import { getBooleanValue, saveBooleanValue } from "@shared/async/storage";
import useTitle from "@core/hooks/useTitle";
import { StyleSheet } from "react-native";

const App = () => {
  const [switchLikes, setSwitchOnLikes] = useState<any>(false);
  const [switchStories, setSwitchStories] = useState<any>(false);
  useTitle("Instellingen");

  useEffect(() => {
    getBooleanValue("key1").then((value) => {
      setSwitchOnLikes(value);
    });

    getBooleanValue("key2").then((value) => {
      setSwitchStories(value);
    });
  }, []);

  const toggleSwitchLikes = async () => {
    const newValue = !switchLikes;
    await saveBooleanValue("key1", newValue);
    setSwitchOnLikes(newValue);
  };

  const toggleSwitchStories = async () => {
    const newValue = !switchStories;
    await saveBooleanValue("key2", newValue);
    setSwitchStories(newValue);
  };

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>Aantal likes</Text>
        <Switch value={switchLikes} onValueChange={toggleSwitchLikes} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Toon verhalen</Text>
        <Switch value={switchStories} onValueChange={toggleSwitchStories} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
  },
});

export default App;
