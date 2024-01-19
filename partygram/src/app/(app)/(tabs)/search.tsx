import SearchComponent from "@shared/search/SearchComponent";
import { View } from "react-native";
import React from "react";
const SearchScreen = () => {
  return (
    <View>
      <SearchComponent word={""} />
    </View>
  );
};

export default SearchScreen;
