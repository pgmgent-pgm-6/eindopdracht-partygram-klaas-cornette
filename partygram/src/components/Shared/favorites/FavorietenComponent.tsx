import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { Variables } from "@style";
import { useQueryClient } from "@tanstack/react-query";
import { favorites } from "@core/modules/favorites/types";
import {
  createFavorite,
  deleteFavorite,
  getFavorites,
} from "@core/modules/favorites/api";
import { useFocusEffect } from "expo-router";

const FavorietenComponent: React.FC<{ id: number | undefined }> = ({ id }) => {
  const data = useAuthContext();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [isFavoriet, setIsFavoriet] = useState(false);

  useFocusEffect(() => {
    fetchFavorites();
  });

  const fetchFavorites = async () => {
    const favorietData: favorites[] | null = await getFavorites();
    if (favorietData !== null) {
      const userPostLike = favorietData.filter(
        (favorite) =>
          favorite.post_id === id && favorite.user_id === data?.user?.id
      );
      if (userPostLike.length > 0) {
        setIsFavoriet(true);
      } else {
        setIsFavoriet(false);
      }
    }
  };

  const handelFavorite = async (update: string) => {
    try {
      const userId = data?.user?.id;
      setLoading(true);
      if (update === "create") {
        await createFavorite(id, userId);
        console.log("create favorite");
      }
      if (update === "delete") {
        await deleteFavorite(id, userId);
        console.log("delete favorite");
      }
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } catch (error) {
      console.error("Error occurred: ", error);
    } finally {
      await fetchFavorites();
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <View style={styles.iconContainer}>
          <ActivityIndicator color="#0000ff" />
        </View>
      ) : (
        <View style={styles.row}>
          {isFavoriet ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handelFavorite("delete")}
            >
              <Ionicons name="star" size={24} color="yellow" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handelFavorite("create")}
            >
              <Ionicons name="star" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default FavorietenComponent;

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
});
