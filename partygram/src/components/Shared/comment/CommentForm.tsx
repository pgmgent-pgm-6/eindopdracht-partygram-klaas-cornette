import * as yup from "yup";
import { View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import AppTextField from "@shared/Formik/AppTextField";
import ErrorMessage from "@design/Text/ErrorMessage";
import AppForm from "@shared/Formik/AppForm";
import AppSubmitButton from "@shared/Formik/AppSubmitButton";
import { CreateCommentBody } from "@core/modules/comments/types";
import { useAuthContext } from "@shared/Auth/AuthProvider";

const schema = yup.object().shape({
  coment: yup.string().min(1).required(),
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

const CommentForm = <T extends CreateCommentBody, U>({
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
    const comment = {
      ...values,
      user: data?.user?.username,
      user_id: data?.user?.id,
    };
    mutate(comment);
  };

  return (
    <>
      <AppForm
        initialValues={{ ...initialValues }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        <View>
          {isError && <ErrorMessage error={error} />}
          <AppTextField
            name="coment"
            label="Jouw comment"
            disabled={isPending}
          />

          <AppSubmitButton disabled={isPending}>
            Voeg comment toe
          </AppSubmitButton>
        </View>
      </AppForm>
    </>
  );
};

export default CommentForm;
