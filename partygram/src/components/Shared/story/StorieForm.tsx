import { View, Image, Button, Touchable } from "react-native";
import { useMutation } from "@tanstack/react-query";
import AppForm from "@shared/Formik/AppForm";
import AppSubmitButton from "@shared/Formik/AppSubmitButton";
import { useState, useEffect } from "react";
import { CreateStoriesBody } from "@core/modules/stories/types";
import { supabase } from "@core/api/supabase";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { StyleSheet } from "react-native";
import { Variables } from "@style";
import * as Location from "expo-location";
import { router } from "expo-router";
import isVoid from "@core/utils/isVoid";
import ImagePickerDialog from "@design/ImagePicker/ImagePickerDialog";
import { decode } from "base64-arraybuffer";

type Options = {
  showClient: boolean;
};

type Props<T, U> = {
  initialValues: T;
  onSuccess: (data: U) => void;
  updateMethod: (values: T) => Promise<U>;
  options?: Partial<Options>;
};

const StoryForm = <T extends CreateStoriesBody, U>({
  initialValues,
  onSuccess,
  updateMethod,
}: Props<T, U>) => {
  const [location, setLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    (async () => {
      await getLocation();
    })();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status);
    if (status !== "granted") {
      setErrorMsg("Geen toegang tot locatie");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const locationString = `${location.coords.latitude}, ${location.coords.longitude}`;
    setLocation(locationString);
  };

  const { mutate } = useMutation({
    mutationFn: updateMethod,
    onSuccess: onSuccess,
  });

  const [image, setImage] = useState<string>("");
  const data = useAuthContext();

  const handleSubmit = async (values: T) => {
    await getLocation();
    if (image) {
      if (data?.user?.id === undefined) {
        alert("Log in");
      } else {
        const story: any = {
          ...values,
          picture: image,
          user_id: data?.user?.id,
          locatie: location,
        };
        mutate(story);
      }
    } else {
      alert("Kies foto");
    }
  };

  if (errorMsg) {
    alert(errorMsg);
    router.push("/");
  }

  const handlePress = () => {
    setShowPicker(true);
  };

  const handleImage = async (image: string) => {
    setShowPicker(false);
    if (!isVoid(image)) {
      const fileName = `${Date.now()}.jpg`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("stories")
        .upload(`${fileName}`, decode(image), {
          contentType: "image/png",
        });
      if (storageError) {
        console.error("Supabase Storage Error:", storageError.message);
      } else {
        console.log("Image uploaded successfully:", storageData);
      }
      const { data } = supabase.storage.from("stories").getPublicUrl(fileName);
      const url = data?.publicUrl;
      setImage(url);
    }
  };

  return (
    <>
      <AppForm initialValues={{ ...initialValues }} onSubmit={handleSubmit}>
        <View style={styles.container}>
          <Button title="Kies foto" onPress={handlePress} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <AppSubmitButton>Voeg verhaal toe</AppSubmitButton>
        </View>
        {showPicker && (
          <ImagePickerDialog
            onDismiss={() => setShowPicker(false)}
            onImage={handleImage}
          />
        )}
      </AppForm>
    </>
  );
};

export default StoryForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 400,
    margin: Variables.spacing.base,
  },
});
