import PostForm from "@shared/Post/PostForm";
import { createPost } from "@core/modules/posts/api";
import DefaultView from "@design/View/DefaultView";
import { Post } from "@core/modules/posts/types";
import useTitle from "@core/hooks/useTitle";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { Text } from "react-native";
const PostCreateScreen = () => {
  useTitle("Maak post");
  const router = useRouter();
  const queryClient = useQueryClient();
  const data = useAuthContext();
  if (!data?.user) {
    return (
      <>
        <Text>U moet inloggen</Text>
      </>
    );
  }

  const handleSuccess = (data: Post) => {
    queryClient.invalidateQueries();
    console.log("data", data);
    router.back();
  };

  return (
    <DefaultView>
      <PostForm
        updateMethod={createPost}
        onSuccess={handleSuccess}
        initialValues={{
          description: "",
          picture: "",
          locatie: "",
          user_id: data.user.id,
        }}
        label="Create"
      />
    </DefaultView>
  );
};

export default PostCreateScreen;
