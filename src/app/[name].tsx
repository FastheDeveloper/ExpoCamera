import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Link, useLocalSearchParams, Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { getMediaType } from "../utils/media";
import { ResizeMode, Video } from "expo-av";
import { VideoView, useVideoPlayer } from "expo-video";
import * as MediaLibrary from "expo-media-library";
const ImageDetails = () => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const { name } = useLocalSearchParams<{ name: string }>();
  const fullUri = (FileSystem.documentDirectory || "") + (name || "");
  const player = useVideoPlayer(fullUri, (player) => {
    player.loop, player.play();
  });

  const type = getMediaType(fullUri);
  const onDelete = async () => {
    await FileSystem.deleteAsync(fullUri);
    router.back();
  };

  const onSave = async () => {
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }
    const asset = await MediaLibrary.createAssetAsync(fullUri);
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{
          title: "Image: " + name,
          headerRight: () => (
            <View style={{ gap: 10, flexDirection: "row" }}>
              <MaterialIcons
                onPress={onDelete}
                name="delete"
                size={26}
                color="crimson"
              />
              <MaterialIcons
                onPress={onSave}
                name="save"
                size={26}
                color="dimgray"
              />
            </View>
          ),
        }}
      />

      {type === "image" && (
        <Image
          source={{ uri: fullUri }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
      {type === "video" && (
        <>
          {/* <Video
            source={{ uri: fullUri }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            useNativeControls
          /> */}
          <VideoView
            player={player}
            style={{
              width: "100%",
              height: "100%",
            }}
            contentFit="cover"
          />
        </>
      )}
    </View>
  );
};

export default ImageDetails;

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
