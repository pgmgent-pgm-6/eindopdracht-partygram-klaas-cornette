import * as yup from "yup";
import { View, Image, Button } from "react-native";
import { useMutation } from "@tanstack/react-query";
import AppTextField from "@shared/Formik/AppTextField";
import ErrorMessage from "@design/Text/ErrorMessage";
import AppForm from "@shared/Formik/AppForm";
import AppSubmitButton from "@shared/Formik/AppSubmitButton";
import { useState, useEffect } from "react";
import { CreatePostBody, UpdatePostBody } from "@core/modules/posts/types";
import { supabase } from "@core/api/supabase";
import * as Location from "expo-location";
import { router } from "expo-router";
import isVoid from "@core/utils/isVoid";
import ImagePickerDialog from "@design/ImagePicker/ImagePickerDialog";
import { decode } from "base64-arraybuffer";

const schema = yup.object().shape({
  description: yup.string().min(2).required(),
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

type Location = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

const PostForm = <T extends CreatePostBody | UpdatePostBody, U>({
  initialValues,
  onSuccess,
  updateMethod,
  label,
}: Props<T, U>) => {
  const [location, setLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Geen toegang tot locatie");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const locationString = `${location.coords.latitude}, ${location.coords.longitude}`;
      setLocation(locationString);
    })();
  }, []);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateMethod,
    onSuccess: onSuccess,
  });

  const [image, setImage] = useState<string>("");

  const handleSubmit = async (values: T) => {
    if (image) {
      const post = {
        ...values,
        picture: image,
        locatie: location,
      };
      console.log("post", post);
      mutate(post);
    } else {
      alert("Kies foto");
    }
  };

  const handlePress = () => {
    setShowPicker(true);
  };

  const handleImage = async (image: string) => {
    setShowPicker(false);
    if (!isVoid(image)) {
      const fileName = `${Date.now()}.jpg`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("post")
        .upload(`${fileName}`, decode(image), {
          contentType: "image/png",
        });
      if (storageError) {
        console.error("Supabase Storage Error:", storageError.message);
      } else {
        console.log("Image uploaded successfully:", storageData);
      }
      const { data } = supabase.storage.from("post").getPublicUrl(fileName);
      const url = data?.publicUrl;
      setImage(url);
    }
  };

  if (errorMsg) {
    alert(errorMsg);
    router.push("/");
  }

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
            name="description"
            label="Beschrijving"
            disabled={isPending}
          />

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Button title="Kies foto" onPress={handlePress}/>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, marginTop: 10 }}
              />
            )}
          </View>
          {showPicker && (
          <ImagePickerDialog
            onDismiss={() => setShowPicker(false)}
            onImage={handleImage}
          />
        )}
          <AppSubmitButton disabled={isPending}>{label}</AppSubmitButton>
        </View>
      </AppForm>
    </>
  );
};

export default PostForm;
