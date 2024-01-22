import * as Location from "expo-location";

const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
    return Promise.reject("Geen toegang tot locatie");
    }
    let location = await Location.getCurrentPositionAsync({});
    const locationString = `${location.coords.latitude}, ${location.coords.longitude}`;
    console.log(locationString);
    return Promise.resolve(locationString);
  };

  export default getLocation;