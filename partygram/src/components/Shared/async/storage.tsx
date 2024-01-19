import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveBooleanValue = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value.toString());
  } catch (error) {
    console.error(`Error saving boolean value for key ${key}:`, error);
  }
};

export const getBooleanValue = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      return value === "true";
    }
  } catch (error) {
    console.error(`Error getting boolean value for key ${key}:`, error);
  }
};

