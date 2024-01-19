import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { getComments } from "@core/modules/comments/api";
import { Comment } from "@core/modules/comments/types";
import { Variables } from "@style";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getPublicUsers } from "@core/modules/auth/api";
import { useCallback } from "react";

const CommentComponent: React.FC<{ id: number | undefined }> = ({ id }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [counter, setCounter] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [publicUsers, setpublicUsers] = useState<any[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        fetchComments();
      };
      fetchData();
      const intervalId = setInterval(fetchData, 10000);
      return () => clearInterval(intervalId);
    }, [])
  );

  const fetchComments = async () => {
    console.log("fetch comments");
    const users = await getPublicUsers();
    if (!users) {
      console.log("Error fetching users");
      return;
    }
    setpublicUsers(users);
    const commentsData: Comment[] | null = await getComments();
    if (commentsData !== null) {
      const data = commentsData.filter((comment) => comment.post_id === id);
      const counter = data.length;
      setComments(data);
      setCounter(counter);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    fetchComments();
  };

  const handelUserProfile = (username: string, id: string | null) => {
    router.push(`/(app)/(pages)/profiel/${username}/${id}`);
  };

  return (
    <View>
      <Text style={styles.userText} onPress={toggleComments}>
        {counter} Comments
      </Text>
      {showComments &&
        comments.map((comment) => (
          <View key={comment.id} style={styles.commentContainer}>
            {publicUsers.map((user: any) => {
              if (user.user_id == comment.user_id) {
                return (
                  <TouchableOpacity
                    key={user.id}
                    onPress={() =>
                      handelUserProfile(user.username, comment.user_id)
                    }
                  >
                    <Text style={styles.userText}>{user.username}:</Text>
                  </TouchableOpacity>
                );
              }
            })}

            <Text style={styles.commentText}>{comment.coment}</Text>
          </View>
        ))}
    </View>
  );
};

export default CommentComponent;

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    justifyContent: "flex-start",
  },
  userText: {
    color: "#555",
    fontSize: Variables.spacing.base,
    marginRight: Variables.spacing.small,
  },
  commentText: {
    fontSize: Variables.spacing.base,
    color: "#aaaaaa",
  },
});
