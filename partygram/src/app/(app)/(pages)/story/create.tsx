import { createStory } from "@core/modules/stories/api";
import DefaultView from "@design/View/DefaultView";
import { Story } from "@core/modules/stories/types";
import useTitle from "@core/hooks/useTitle";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import StoryForm from "@shared/story/StorieForm";

const StoryCreateScreen = () => {
  useTitle("Maak Story");
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSuccess = (data: Story) => {
    queryClient.invalidateQueries();
    console.log("data", data);
    router.back();
  };

  return (
    <DefaultView>
      <StoryForm
        initialValues={{ user_id: "", picture: "" }}
        updateMethod={createStory}
        onSuccess={handleSuccess}
      />
    </DefaultView>
  );
};

export default StoryCreateScreen;
