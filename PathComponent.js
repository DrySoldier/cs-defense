import {
  memo,
  useRef,
  useEffect,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import { Animated } from "react-native";

const PathComponent = forwardRef(({ id, path, onDestroy }, ref) => {
  const xyVal = useRef(
    new Animated.ValueXY({ x: path[0].x, y: path[0].y })
  ).current;
  const [xy, setXy] = useState({ x: path[0].x, y: path[0].y });

  useEffect(() => {
    console.log("CREATED :: ", id);
    const xyListener = xyVal.addListener((val) => setXy(val));

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

  useImperativeHandle(
    ref,
    () => ({
      getXy: () => xy,
    }),
    [xy]
  );

  return (
    <Animated.View
      style={{
        height: 50,
        width: 50,
        backgroundColor: "red",
        position: "absolute",
        transform: [{ translateX: xyVal.x }, { translateY: xyVal.y }],
      }}
    />
  );
});

function areEqual({ id: prevId }, { id }) {
  return id == prevId;
}

export default memo(PathComponent, areEqual);
