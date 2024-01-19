import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { getLikes, createLike, deleteLike } from "@core/modules/likes/api";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Likes } from "@core/modules/likes/types";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { Variables } from "@style";
import { useQueryClient } from "@tanstack/react-query";
import { getBooleanValue } from "@shared/async/storage";
import { useFocusEffect } from "@react-navigation/native";

const LikeComponent: React.FC<{ id: number | undefined }> = ({ id }) => {
  const data = useAuthContext();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [switchLikes, setSwitchOnLikes] = useState<any>(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const value = await getBooleanValue("key1");
        console.log("value", value);
        setSwitchOnLikes(value);
        fetchLikes();
      };
      fetchData();
      const intervalId = setInterval(fetchData, 100000);
      return () => clearInterval(intervalId);
    }, [])
  );

  const fetchLikes = async () => {
    const likesData: Likes[] | null = await getLikes();
    console.log("get like");
    if (likesData !== null) {
      const counter = likesData.filter((like) => like.post_id === id).length;
      const userPostLike = likesData.filter(
        (like) => like.post_id === id && like.user_id === data?.user?.id
      );
      setLikesCount(counter);
      if (userPostLike.length > 0) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  };
  
  const handelLike = async (update: string) => {
    try {
      const userId = data?.user?.id;
      setLoading(true);
      if (update === "create") {
        await createLike(id, userId);
        console.log("create like");
      }
      if (update === "delete") {
        await deleteLike(id, userId);
        console.log("delete like");
      }
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    } catch (error) {
      console.error("Error occurred: ", error);
    } finally {
      await fetchLikes();
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
          {switchLikes ? (
            <Text style={styles.iconContainer}>{likesCount}</Text>
          ) : (
            <Text style={styles.iconContainer}></Text>
          )}

          {isLiked ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handelLike("delete")}
            >
              <Ionicons name="heart" size={24} color="red" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handelLike("create")}
            >
              <Ionicons name="heart" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default LikeComponent;

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
