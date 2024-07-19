import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Image,
  View,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link, router, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  CameraCapturedPicture,
} from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import path from "path";
import * as FileSystem from "expo-file-system";
const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>();
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const toggleCamFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };
  const takePicture = async () => {
    const res = await cameraRef.current?.takePictureAsync();
    setPicture(res);
    console.log(res);
  };

  const saveFile = async (uri: string) => {
    const fileName = path.parse(uri).base;

    await FileSystem.copyAsync({
      from: uri,
      to: FileSystem.documentDirectory + fileName,
    });
    setPicture(undefined);
    router.back();
  };

  if (!permission?.granted) {
    return <ActivityIndicator />;
  }

  if (picture) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: picture.uri }}
          style={{ width: "100%", flex: 1 }}
        />
        <View style={{ padding: 10 }}>
          <SafeAreaView edges={["bottom"]}>
            <Button title="Save" onPress={() => saveFile(picture.uri)} />
          </SafeAreaView>
        </View>
        <Pressable style={styles.button} onPress={() => setPicture(undefined)}>
          <MaterialIcons name="close" size={30} color="white" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.footer}>
          <View />
          <Pressable
            style={styles.recordButton}
            onPress={takePicture}></Pressable>
          <MaterialIcons
            name="flip-camera-ios"
            size={30}
            color="white"
            onPress={toggleCamFacing}
          />
        </View>
      </CameraView>

      <Pressable style={styles.button} onPress={router.back}>
        <MaterialIcons name="close" size={30} color="white" />
      </Pressable>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    top: 35,
    left: 10,
  },
  camera: { width: "100%", height: "100%" },
  footer: {
    marginTop: "auto",
    padding: 20,
    paddingBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
