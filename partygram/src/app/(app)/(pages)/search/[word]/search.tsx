import { View } from "react-native";
import SearchComponent from "@shared/search/SearchComponent";
import { useLocalSearchParams } from "expo-router";

const SearchScreenWord = () => {
  const { word } = useLocalSearchParams<{ word: string }>();
  const newWord: string = "#" + word;
  return (
    <View>
      <SearchComponent word={newWord} />
    </View>
  );
};

export default SearchScreenWord;
