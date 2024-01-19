import useTitle from "@core/hooks/useTitle";
import { updateUser } from "@core/modules/auth/api";
import DefaultView from "@design/View/DefaultView";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import UserForm from "@shared/User/UserForm";
import { useRouter } from "expo-router";

const UserEditScreen = () => {
  useTitle("Bewerk profiel");
  const router = useRouter();
  const { user } = useAuthContext();

  const handleSuccess = () => {
    router.back();
  };

  return (
    <DefaultView>
      <UserForm
        updateMethod={updateUser}
        onSuccess={handleSuccess}
        initialValues={{ ...user }}
        options={{ showPassword: false }}
        label="Update"
      />
    </DefaultView>
  );
};

export default UserEditScreen;
