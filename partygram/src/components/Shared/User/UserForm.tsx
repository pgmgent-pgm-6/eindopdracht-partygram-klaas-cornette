import * as yup from "yup";
import { View, Switch, Text } from "react-native";
import { useMutation } from "@tanstack/react-query";
import AppTextField from "../Formik/AppTextField";
import ErrorMessage from "@design/Text/ErrorMessage";
import AppForm from "../Formik/AppForm";
import AppSubmitButton from "../Formik/AppSubmitButton";
import { CreateUserBody, UpdateUserBody } from "@core/modules/auth/types";
import React, { useState } from "react";

const getSchema = (options: Options) => {
  return yup.object().shape({
    email: yup.string().email().required(),
    ...(options.showPassword
      ? { password: yup.string().min(8).required() }
      : {}),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    username: yup.string().required(),
  });
};

type Options = {
  showPassword: boolean;
};

const defaultOptions = {
  showPassword: true,
};

type Props<T> = {
  initialValues: T;
  onSuccess: () => void;
  updateMethod: (values: T) => Promise<any>;
  label: string;
  options?: Partial<Options>;
};

const UserForm = <T extends CreateUserBody | UpdateUserBody>({
  initialValues,
  onSuccess,
  updateMethod,
  label,
  options = {},
}: Props<T>) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateMethod,
    onSuccess: onSuccess,
  });

  const handleSubmit = async (values: T) => {
    const valuesWithSwitch = { ...values, agreeToTerms };
    mutate(valuesWithSwitch);
  };

  const formOptions = { ...defaultOptions, ...options };

    return (
      <AppForm
        initialValues={{ ...initialValues }}
        validationSchema={getSchema(formOptions)}
        onSubmit={handleSubmit}
      >
        <View>
          {isError && <ErrorMessage error={error} />}
          <AppTextField
            name="email"
            label="Email"
            autoComplete="email"
            keyboardType="email-address"
            disabled={isPending}
          />
          {formOptions.showPassword && (
            <AppTextField
              name="password"
              label="Password"
              secureTextEntry={true}
              disabled={isPending}
            />
          )}
          <AppTextField
            name="username"
            label="gebruikersnaam"
            disabled={isPending}
          />
          <AppTextField
            name="first_name"
            label="voornaam"
            disabled={isPending}
          />
          <AppTextField
            name="last_name"
            label="achternaam"
            disabled={isPending}
          />

          <Text>Ik ga akkoord met de voorwaarden</Text>
          <Switch 
          value={agreeToTerms}
          onValueChange={(value) => setAgreeToTerms(value)}
          />
          <AppSubmitButton disabled={isPending}>{label}</AppSubmitButton>
        </View>
      </AppForm>
    );
};

export default UserForm;
