import { Pressable, StyleSheet, FlatList, View, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { getMediaType, MediaType } from "../utils/media";
import { ResizeMode, Video } from "expo-av";

type Media = {
  name: string;
  uri: string;
  type: MediaType;
};
const HomeScreen = () => {
  const [images, setImages] = useState<Media[]>([]);
  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );

  const loadFiles = async () => {
    if (!FileSystem.documentDirectory) {
      return;
    }
    const res = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );
    setImages(
      res.map((file) => ({
        name: file,
        uri: FileSystem.documentDirectory + file,
        type: getMediaType(file),
      }))
    );
  };

  console.log(JSON.stringify(images));

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={images}
        numColumns={3}
        contentContainerStyle={{ gap: 5 }}
        columnWrapperStyle={{ gap: 5 }}
        renderItem={({ item }) => (
          <Link href={`/${item.name}`} asChild>
            <Pressable style={{ flex: 1, maxWidth: "33.33%" }}>
              {item.type === "image" && (
                <Image
                  source={{ uri: item.uri }}
                  style={{ aspectRatio: 3 / 4, borderRadius: 5 }}
                />
              )}
              {item.type === "video" && (
                <>
                  <Video
                    source={{ uri: item.uri }}
                    style={{ aspectRatio: 3 / 4, borderRadius: 5 }}
                    resizeMode={ResizeMode.COVER}
                    positionMillis={100}
                    // shouldPlay
                    // isLooping
                  />
                  <MaterialIcons
                    name="play-circle-outline"
                    style={{ position: "absolute" }}
                    size={30}
                    color={"white"}
                  />
                </>
              )}
            </Pressable>
          </Link>
        )}
      />

      <Link href="/camera" asChild>
        <Pressable style={styles.button}>
          <MaterialIcons name="photo-camera" size={30} color="red" />
        </Pressable>
      </Link>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "yellow",
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
