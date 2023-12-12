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

export default function App() {
  const [objects, setObjects] = useState([]);
  const [towers, setTowers] = useState([
    { x: 250, y: 250, id: Math.random(), ref: createRef() },
    { x: 250, y: 400, id: Math.random(), ref: createRef() },
    { x: 125, y: 500, id: Math.random(), ref: createRef() },
  ]);

  const path = [
    { x: 175, y: 450, timeMs: 0 },
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
    setObjects((prevState) => [...prevState, { id, path, ref }]);
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
        <PathComponent
          key={e.id.toString()}
          onDestroy={onDestroy}
          {...e}
        />
      ))}
      {towers.map((e) => (
        <Tower key={e.id.toString()} ref={e.ref} {...e} objects={objects} />
      ))}
    </View>
  );
}
