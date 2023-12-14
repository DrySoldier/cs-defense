import { Text, Animated } from "react-native";
import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";

const Tower = forwardRef(
  ({ x: towerX, y: towerY, objects, towers, id }, ref) => {
    const [targetRef, setTargetRef] = useState(undefined);
    const angle = useRef(new Animated.Value(0)).current;

    const updateAngle = ({ x: targetX, y: targetY }) => {
      const length = targetX - towerX;
      const height = targetY - towerY;

      const hypno = Math.sqrt(length ** 2 + height ** 2);
      const radiansToDegrees = Math.acos(length / hypno) * (180 / Math.PI);
      const moreRadiansToDegrees = Math.asin(length / hypno) * (180 / Math.PI);

      if (height >= 0) {
        angle.setValue(radiansToDegrees); // tracking between 0, 180
      } else {
        angle.setValue(moreRadiansToDegrees); // tracking between 180, 360
      }
    };

    const degInter = angle?.interpolate({
      inputRange: [0, 360],
      outputRange: ["0deg", "360deg"],
    });

    const recursivelyShoot = () => {
      if (targetRef?.ref?.current?.getXy !== undefined) {
        updateAngle(targetRef?.ref?.current?.getXy());

        setTimeout(recursivelyShoot, 5);
      }
    };

    useEffect(() => {
      const obj = objects?.find((e) => !!e.ref.current.getXy()?.y);
      setTargetRef(obj);
    }, [objects]);

    useEffect(() => {
      recursivelyShoot(targetRef);
    }, [targetRef]);

    return (
      <Animated.View
        style={{
          position: "absolute",
          height: 50,
          width: 50,
          left: towerX,
          top: towerY,
          backgroundColor: "blue",
          transform: [{ rotateZ: degInter }],
        }}
      >
        <Text>CT'S WIN</Text>
      </Animated.View>
    );
  }
);

export default Tower;
