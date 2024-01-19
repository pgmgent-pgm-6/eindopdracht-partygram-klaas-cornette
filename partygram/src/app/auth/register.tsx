import useTitle from "@core/hooks/useTitle";
import { createUser } from "@core/modules/auth/api";
import DefaultView from "@design/View/DefaultView";
import UserForm from "@shared/User/UserForm";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const RegisterScreen = () => {
  const router = useRouter();
  useTitle("Create account");

  return (
    <>
      <DefaultView>
        <UserForm
          updateMethod={createUser}
          onSuccess={() => router.push("/(app)/(tabs)")}
          initialValues={{
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            username: "",
            agreeToTerms: false,
          }}
          label="Create account"
        />
      </DefaultView>
      <StatusBar style="light" />
    </>
  );
};

export default RegisterScreen;
