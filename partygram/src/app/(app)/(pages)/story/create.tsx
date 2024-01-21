import { createStory } from "@core/modules/stories/api";
import DefaultView from "@design/View/DefaultView";
import useTitle from "@core/hooks/useTitle";
import { useRouter } from "expo-router";
import StoryForm from "@shared/story/StorieForm";

const StoryCreateScreen = () => {
  useTitle("Maak Story");
  const router = useRouter();

  const handleSuccess = () => {
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
