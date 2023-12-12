import { memo, useRef, useEffect } from "react";
import { Animated } from "react-native";

const PathComponent = ({ id, path, onDestroy, updateAngle }) => {
  const xyVal = useRef(
    new Animated.ValueXY({ x: path[0].x, y: path[0].y })
  ).current;

  useEffect(() => {
    console.log("CREATED :: ", id);
    const xyListener = xyVal.addListener(
      (val) => {} //updateAngle(val, id)
    );

    const startAnim = async () => {
      let i = 1;
      for (const { timeMs, x, y } of path) {
        await new Promise((res) => {
          Animated.timing(xyVal, {
            duration: timeMs,
            toValue: { x, y },
            useNativeDriver: true,
          }).start(() => {
            res();
            if (i === path.length) {
              onDestroy(id);
            } else i++;
          });
        });
      }
    };

    startAnim();
  }, []);

  return (
    <Animated.View
      ref={ref}
      style={{
        height: 50,
        width: 50,
        backgroundColor: "red",
        position: "absolute",
        transform: [{ translateX: xyVal.x }, { translateY: xyVal.y }],
      }}
    />
  );
};

function areEqual({ id: prevId }, { id }) {
  return id == prevId;
}

export default memo(PathComponent, areEqual);
