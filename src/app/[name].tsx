import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Link, useLocalSearchParams, Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const ImageDetails = () => {
  const { name } = useLocalSearchParams<{ name: string }>();

  const fullUri = (FileSystem.documentDirectory || "") + (name || "");

  const onDelete = async () => {
    await FileSystem.deleteAsync(fullUri);
    router.back();
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
                onPress={() => {}}
                name="save"
                size={26}
                color="dimgray"
              />
            </View>
          ),
        }}
      />

      <Image
        source={{ uri: fullUri }}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
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
