import { useLayoutEffect } from "react";
import { View, TextInput, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { getPosts } from "@core/modules/posts/api";
import { CreatePostBody } from "@core/modules/posts/types";
import { useState } from "react";
import { Variables } from "@style";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import useTitle from "@core/hooks/useTitle";

const SearchComponent = ({ word }: { word: string }) => {
  useTitle("Zoeken");
  const [posts, setPosts] = useState<CreatePostBody[]>([]);
  const [search, setSearch] = useState<string>(word);
  const [borderColor, setBorderColor] = useState<string>(Variables.colors.text);
  const [filteredPosts, setFilteredPosts] = useState<CreatePostBody[]>([]);
  const router = useRouter();

  useLayoutEffect(() => {
    fetchPosts();
    handelChange(search);
  }, [posts]);

  const fetchPosts = async () => {
    const fetchedPosts = await getPosts();
    if (!fetchedPosts) {
      console.log("Error fetching posts");
      return;
    }
    setPosts(fetchedPosts);
    if(word.length > 2){
      handelChange(word);
    }
  };

  const handelChange = (event: string) => {
    const search = event;
    if (search.length > 2) {
      const searchString = search.toLowerCase();

      const filteredPosts = posts.filter((post) => {
        const lowercaseDescription = post.description?.toLowerCase();
        return lowercaseDescription?.includes(searchString);
      });
      setFilteredPosts(filteredPosts);
    } else {
      setFilteredPosts([]);
    }
    setSearch(search);
  };

  const handelFocus = () => {
    setBorderColor(Variables.colors.primary);
  };

  const handelBlur = () => {
    setBorderColor(Variables.colors.text);
  };

  const handelLink = (id: number | undefined) => {
    if (!id) {
      alert("Er is iets mis gelopen");
    } else {
      router.push(`/(app)/(pages)/post/${id}/detail`);
    }
  };

  return (
    <View>
      <ScrollView>
        <TextInput
          placeholder="Zoek naar posts / users ..."
          onChangeText={(event) => handelChange(event)}
          value={search}
          onFocus={handelFocus}
          onBlur={handelBlur}
          style={[styles.textInput, { borderColor }]}
        />
        <View style={styles.postContainer}>
          {filteredPosts.map((post) => (
            <View key={post.id}>
              <TouchableOpacity onPress={() => handelLink(post.id)}>
                <Image
                  style={styles.postImage}
                  source={{ uri: post.picture }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  textInput: {
    marginTop: Variables.spacing.base,
    height: 50,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: Variables.spacing.base,
  },
  postContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginLeft: Variables.spacing.base,
    marginRight: Variables.spacing.base,
  },
  postImage: {
    width: 160,
    height: 160,
    borderRadius: 10,
    marginTop: Variables.spacing.big,
  },
});
