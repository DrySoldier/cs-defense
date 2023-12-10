import { StatusBar } from "expo-status-bar";
import { useState, useCallback, useEffect, createRef, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import AnimationComponent from "./AnimationComponent";

function radians_to_degrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}

export default function App() {
  const [objects, setObjects] = useState([]);

  const angle = useRef(new Animated.Value(0)).current;
  const flip = useRef(new Animated.Value(0)).current;
  const degInter = angle.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const startingPosition = { x: -100, y: 700 };
  const path = [
    { x: 300, y: 700, timeMs: 2500 },
    { x: 300, y: 500, timeMs: 2500 },
    { x: 100, y: 500, timeMs: 2500 },
    { x: 100, y: 300, timeMs: 2500 },
    { x: 300, y: 100, timeMs: 2500 },
    { x: 300, y: 300, timeMs: 2500 },
  ];

  const onDestroy = useCallback((id) => {
    console.log("DESTROYED :: ", id);
    setObjects((prevState) => prevState.filter((e) => e.id !== id));
  });

  const start = () => {
    const id = Math.random();
    const ref = createRef();
    setObjects((prevState) => [
      ...prevState,
      { ...startingPosition, id, path, ref },
    ]);
  };

  const updateAngle = ({ x, y }) => {
    const length = x - 250;
    const height = y - 250;

    console.log(JSON.stringify({ height, y }, null, 2));

    const hypno = Math.sqrt(length ** 2 + height ** 2);

    if (y > height) {
      flip.setValue(-1)
    }

    angle.setValue(radians_to_degrees(Math.acos(length / hypno)));
  };

  return (
    <View>
      <TouchableOpacity onPress={start}>
        <Text
          style={{ position: "absolute", left: 100, top: 100, fontSize: 20 }}
        >
          Press Me!
        </Text>
      </TouchableOpacity>
      {objects.map((e) => (
        <AnimationComponent
          ref={e.ref}
          key={e.id.toString()}
          onDestroy={onDestroy}
          updateAngle={updateAngle}
          {...e}
        />
      ))}
      <Animated.View
        style={{
          position: "absolute",
          height: 50,
          width: 50,
          left: 250,
          top: 250,
          backgroundColor: "blue",
          transform: [{ rotateZ: degInter }],
        }}
      >
        <Text>TEST</Text>
      </Animated.View>
      <StatusBar style="auto" />
    </View>
  );
}
