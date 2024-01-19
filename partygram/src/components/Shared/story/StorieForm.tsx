import { View, Image, Button } from "react-native";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import AppForm from "@shared/Formik/AppForm";
import AppSubmitButton from "@shared/Formik/AppSubmitButton";
import { useState, useEffect } from "react";
import { CreateStoriesBody } from "@core/modules/stories/types";
import { supabase } from "@core/api/supabase";
import { useAuthContext } from "@shared/Auth/AuthProvider";
import { StyleSheet } from "react-native";
import { Variables } from "@style";
import * as Location from "expo-location";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";

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

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 18],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        const filename = result.assets[0].uri
          .replace(/[^a-zA-Z0-9-_]/g, "")
          .substring(105);

        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("post")
            .upload(`posts/${filename}`, result.assets[0].uri, {
              contentType: "image/jpeg",
            });
        if (storageError) {
          console.error("Supabase Storage Error:", storageError.message);
        } else {
          console.log("Image uploaded successfully:", storageData);
        }
      }
    } catch (error: any) {
      console.error("ImagePicker Error:", error.message);
    }
  };

  if (location === "") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="#0000ff" />
      </View>
    );
  }

  if (errorMsg) {
    alert(errorMsg);
    router.push("/");
  }

  return (
    <>
      <AppForm initialValues={{ ...initialValues }} onSubmit={handleSubmit}>
        <View style={styles.container}>
          <Button title="Kies foto" onPress={handleImagePick} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <AppSubmitButton>Voeg verhaal toe</AppSubmitButton>
        </View>
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
