import { useState, useCallback, useEffect, createRef, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import PathComponent from "./PathComponent";
import Tower from "./Tower";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function App() {
  const [objects, setObjects] = useState([]);
  const [towers, setTowers] = useState([
    { x: 250, y: 250, id: Math.random(), ref: createRef() },
    { x: 250, y: 400, id: Math.random(), ref: createRef() },
    { x: 125, y: 500, id: Math.random(), ref: createRef() },
  ]);

  const path = [
    { x: getRandomInt(0, 100), y: getRandomInt(350, 550), timeMs: 0 },
    { x: getRandomInt(200, 400), y: getRandomInt(600, 800), timeMs: 2500 },
    { x: getRandomInt(200, 400), y: getRandomInt(0, 100), timeMs: 2500 },
    { x: getRandomInt(0, 200), y: getRandomInt(400, 600), timeMs: 2500 },
    { x: getRandomInt(0, 200), y: getRandomInt(200, 400), timeMs: 2500 },
    { x: getRandomInt(200, 400), y: getRandomInt(0, 200), timeMs: 2500 },
    { x: getRandomInt(200, 400), y: getRandomInt(200, 400), timeMs: 2500 },
  ];

  const onDestroy = useCallback((id) => {
    console.log("DESTROYED :: ", id);
    setObjects((prevState) => prevState.filter((e) => e.id !== id));
  });

  const start = () => {
    const id = Math.random();
    const ref = createRef();
    setObjects((prevState) => [...prevState, { id, path, ref }]);
  };

  return (
    <View>
      <TouchableOpacity
        style={{ position: "absolute", left: 100, top: 100 }}
        onPress={start}
      >
        <Text style={{ fontSize: 20 }}>Press Me!</Text>
      </TouchableOpacity>
      {objects.map((e) => (
        <PathComponent key={e.id.toString()} onDestroy={onDestroy} {...e} />
      ))}
      {towers.map((e) => (
        <Tower key={e.id.toString()} objects={objects} {...e} />
      ))}
    </View>
  );
}
