import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  interpolate,
  runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

type CardData = {
  id: number;
  name: string;
  age: number;
  image: string;
  bio: string;
};

type SwipeCardProps = {
  data: CardData;
  index: number;
  totalCards: number;
  onSwipeLeft?: (card: CardData) => void;
  onSwipeRight?: (card: CardData) => void;
};

export default function SwipeCard({
  data,
  index,
  totalCards,
  onSwipeLeft,
  onSwipeRight,
}: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const direction = Math.sign(event.translationX);
      const isSwipe = Math.abs(event.translationX) > SWIPE_THRESHOLD;

      if (isSwipe) {
        // Swipe completed
        const toX = direction * SCREEN_WIDTH * 1.5;
        translateX.value = withSequence(
          withSpring(toX, { velocity: event.velocityX }),
          withSpring(0, {}, () => {
            // Reset position after animation
            translateY.value = withSpring(0);
          })
        );

        // Trigger callbacks
        if (direction > 0 && onSwipeRight) {
          runOnJS(onSwipeRight)(data);
        } else if (direction < 0 && onSwipeLeft) {
          runOnJS(onSwipeLeft)(data);
        }
      } else {
        // Return to original position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15]
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  // Style for stacked cards effect
  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(index, [0, 1, 2], [1, 0.95, 0.9]);
    const translateYOffset = interpolate(index, [0, 1, 2], [0, -10, -20]);

    return {
      transform: [{ scale }, { translateY: translateYOffset }],
    };
  });

  // Show swipe indicators
  const likeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1]
    );
    return { opacity };
  });

  const nopeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0]
    );
    return { opacity };
  });

  return (
    <View style={[styles.cardContainer, { zIndex: totalCards - index }]}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedStyle, cardStyle]}>
          {/* Image Placeholder */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>{data.image}</Text>
          </View>

          {/* Card Info */}
          <View style={styles.cardInfo}>
            <Text style={styles.name}>
              {data.name}, {data.age}
            </Text>
            <Text style={styles.bio}>{data.bio}</Text>
          </View>

          {/* LIKE Indicator */}
          <Animated.View style={[styles.likeIndicator, likeStyle]}>
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>

          {/* NOPE Indicator */}
          <Animated.View style={[styles.nopeIndicator, nopeStyle]}>
            <Text style={styles.nopeText}>NOPE</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: "center",
    overflow: "hidden",
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    fontSize: 48,
  },
  cardInfo: {
    padding: 20,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: "#666",
  },
  likeIndicator: {
    position: "absolute",
    top: 50,
    left: 40,
    borderWidth: 4,
    borderColor: "#4caf50",
    borderRadius: 8,
    padding: 12,
    transform: [{ rotate: "-20deg" }],
  },
  likeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4caf50",
  },
  nopeIndicator: {
    position: "absolute",
    top: 50,
    right: 40,
    borderWidth: 4,
    borderColor: "#f44336",
    borderRadius: 8,
    padding: 12,
    transform: [{ rotate: "20deg" }],
  },
  nopeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f44336",
  },
});
