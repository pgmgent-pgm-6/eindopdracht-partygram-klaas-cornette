import DefaultView from "@design/View/DefaultView";
import useTitle from "@core/hooks/useTitle";
import { router, useLocalSearchParams } from "expo-router";
import { createComment } from "@core/modules/comments/api";
import CommentForm from "@shared/comment/CommentForm";
import { useQueryClient } from "@tanstack/react-query";

const PostCommentCreateScreen = () => {
  useTitle("Voeg comment toe");
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["comments"] });
    router.back();
  };

  return (
    <DefaultView>
      <CommentForm
        updateMethod={createComment}
        onSuccess={handleSuccess}
        initialValues={{ coment: "", post_id: id ? parseInt(id) : 0, user: "" }}
        label="Create"
      />
    </DefaultView>
  );
};

export default PostCommentCreateScreen;
