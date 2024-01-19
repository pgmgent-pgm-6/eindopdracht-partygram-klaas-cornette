import * as yup from "yup";
import { View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import AppTextField from "@shared/Formik/AppTextField";
import AppForm from "@shared/Formik/AppForm";
import AppSubmitButton from "@shared/Formik/AppSubmitButton";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { CreateMessagesBody } from "@core/modules/messages/types";

const schema = yup.object().shape({
  message: yup.string().min(1).required(),
});

type Options = {
  showClient: boolean;
};

type Props<T, U> = {
  initialValues: T;
  onSuccess: (data: U) => void;
  updateMethod: (values: T) => Promise<U>;
  label: string;
  options?: Partial<Options>;
};

const messageForm = <T extends CreateMessagesBody, U>({
  initialValues,
  onSuccess,
  updateMethod,
}: Props<T, U>) => {
  const data = useAuthContext();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateMethod,
    onSuccess: onSuccess,
  });

  const handleSubmit = async (values: T) => {
    const message = {
      ...values,
      senders: data?.user?.id,
    };
    mutate(message);
  };

  return (
    <>
      <AppForm
        initialValues={{ ...initialValues }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        <View>
          <AppTextField
            name="message"
            label="Jouw bericht"
            disabled={isPending}
          />

          <AppSubmitButton disabled={isPending}>Stuur bericht</AppSubmitButton>
        </View>
      </AppForm>
    </>
  );
};

export default messageForm;
