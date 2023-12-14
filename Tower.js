import { Text, Animated, View } from "react-native";
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
    const [bulletVisible, setBulletVisible] = useState();

    const angle = useRef(new Animated.Value(0)).current;

    const degInter = angle?.interpolate({
      inputRange: [0, 360],
      outputRange: ["0deg", "360deg"],
    });

    const bulletTranslateXY = useRef(
      new Animated.ValueXY({ x: 0, y: 0 })
    ).current;

    const updateAngle = ({ x: targetX, y: targetY }) => {
      const length = targetX - towerX;
      const height = targetY - towerY;

      const hypno = Math.sqrt(length ** 2 + height ** 2);
      const radiansToDegrees = Math.acos(length / hypno) * (180 / Math.PI);
      const moreRadiansToDegrees = Math.asin(length / hypno) * (180 / Math.PI);

      if (height >= 0) {
        if (towers[0].id === id) console.log(radiansToDegrees);
        Animated.timing(angle, {
          duration: 250,
          toValue: radiansToDegrees,
          useNativeDriver: true,
        }).start(() => shootBullet());
      } else {
        if (towers[0].id === id) console.log(moreRadiansToDegrees);
        Animated.timing(angle, {
          duration: 250,
          toValue: moreRadiansToDegrees,
          useNativeDriver: true,
        }).start(() => shootBullet());
      }
    };

    const recursivelyShoot = () => {
      if (targetRef?.ref?.current?.getXy !== undefined) {
        updateAngle(targetRef?.ref?.current?.getXy());

        setTimeout(recursivelyShoot, 250);
      }
    };

    useEffect(() => {
      const obj = objects[0];
      setTargetRef(obj);
    }, [objects]);

    useEffect(() => {
      recursivelyShoot(targetRef);
    }, [targetRef]);

    const shootBullet = () => {
      if (targetRef?.ref?.current?.getXy) {
        bulletTranslateXY.setValue({ x: 0, y: 0 });
        setBulletVisible(true);

        Animated.timing(bulletTranslateXY, {
          toValue: {
            x: targetRef?.ref?.current?.getXy().x - towerX,
            y: targetRef?.ref?.current?.getXy().y - towerY,
          },
          duration: 250,
          useNativeDriver: true,
        }).start(() => setBulletVisible(false));
      }
    };

    return (
      <>
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
          <View
            style={{
              height: 10,
              width: 5,
              position: "absolute",
              left: -10,
              backgroundColor: "red",
            }}
          />
        </Animated.View>
        {bulletVisible && (
          <Animated.View
            style={{
              height: 5,
              width: 5,
              position: "absolute",
              left: towerX,
              top: towerY,
              borderRadius: 5,
              overflow: "hidden",
              backgroundColor: "red",
              transform: [
                { translateX: bulletTranslateXY.x },
                { translateY: bulletTranslateXY.y },
              ],
            }}
          >
            <Text>*pew*</Text>
          </Animated.View>
        )}
      </>
    );
  }
);

export default Tower;
