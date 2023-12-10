import {
  memo,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Animated, TouchableOpacity } from "react-native";

const AnimationComponent = forwardRef(
  ({ x: startX, y: startY, id, path, onDestroy, updateAngle }, ref) => {
    const xyVal = useRef(
      new Animated.ValueXY({ x: startX, y: startY })
    ).current;

    useEffect(() => {
      console.log("CREATED :: ", id);
      const xyListener = xyVal.addListener((val) => updateAngle(val));

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
                // onDestroy(id);
              } else i++;
            });
          });
        }
      };

      startAnim();
    }, []);

    useImperativeHandle(ref, () => ({}), []);

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
  }
);

function areEqual({ id: prevId }, { id }) {
  return id == prevId;
}

export default memo(AnimationComponent, areEqual);
