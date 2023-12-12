import { Text, Animated } from "react-native";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";

const Tower = forwardRef(({ x, y, objects }, ref) => {
  // const [target, setTarget] = useState();

  const angle = useRef(new Animated.Value(0)).current;

  const updateAngle = ({ x, y }, id) => {
    const length = x;
    const height = y;

    const hypno = Math.sqrt(length ** 2 + height ** 2);
    const radiansToDegrees = Math.acos(length / hypno) * (180 / Math.PI);
    angle.setValue(radiansToDegrees);
  };

  const degInter = angle?.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        height: 50,
        width: 50,
        left: x,
        top: y,
        backgroundColor: "blue",
        transform: [{ rotateZ: degInter }],
      }}
    >
      <Text>CT'S WIN</Text>
    </Animated.View>
  );
});

export default Tower;
