import * as Location from "expo-location";

const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return Promise.reject("Geen toegang tot locatie");
  }
  try {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const locationString = `${location.coords.latitude}, ${location.coords.longitude}`;
    return Promise.resolve(locationString);
  } catch (error) {
    alert(error);
  }
};

export default getLocation;
