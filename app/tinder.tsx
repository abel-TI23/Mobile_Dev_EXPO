import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SwipeCard from "./components/SwipeCard";

type CardData = {
  id: number;
  name: string;
  age: number;
  image: string;
  bio: string;
};

// Sample data
const INITIAL_CARDS: CardData[] = [
  {
    id: 1,
    name: "Sarah",
    age: 24,
    image: "👩‍💼",
    bio: "Adventure seeker, coffee lover ☕",
  },
  {
    id: 2,
    name: "Michael",
    age: 28,
    image: "👨‍💻",
    bio: "Software developer, gym enthusiast 💪",
  },
  {
    id: 3,
    name: "Emma",
    age: 26,
    image: "👩‍🎨",
    bio: "Artist & designer, love cats 🐱",
  },
  {
    id: 4,
    name: "David",
    age: 30,
    image: "👨‍🍳",
    bio: "Chef, foodie, travel addict ✈️",
  },
  {
    id: 5,
    name: "Lisa",
    age: 25,
    image: "👩‍🔬",
    bio: "Scientist, bookworm, nature lover 🌿",
  },
];

export default function TinderSwipe() {
  const [cards, setCards] = useState<CardData[]>(INITIAL_CARDS);
  const [swipedCards, setSwipedCards] = useState<{
    liked: CardData[];
    passed: CardData[];
  }>({
    liked: [],
    passed: [],
  });

  const handleSwipeRight = (card: CardData) => {
    console.log("Liked:", card.name);
    setSwipedCards((prev) => ({
      ...prev,
      liked: [...prev.liked, card],
    }));
    
    // Remove card from stack after a delay
    setTimeout(() => {
      setCards((prev) => prev.filter((c) => c.id !== card.id));
    }, 300);
  };

  const handleSwipeLeft = (card: CardData) => {
    console.log("Passed:", card.name);
    setSwipedCards((prev) => ({
      ...prev,
      passed: [...prev.passed, card],
    }));
    
    // Remove card from stack after a delay
    setTimeout(() => {
      setCards((prev) => prev.filter((c) => c.id !== card.id));
    }, 300);
  };

  const handleReset = () => {
    setCards(INITIAL_CARDS);
    setSwipedCards({ liked: [], passed: [] });
  };

  const showStats = () => {
    Alert.alert(
      "Statistics",
      `Liked: ${swipedCards.liked.length}\nPassed: ${swipedCards.passed.length}`,
      [{ text: "OK" }]
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💕 Tinder Clone</Text>
          <TouchableOpacity onPress={showStats} style={styles.statsButton}>
            <Text style={styles.statsButtonText}>📊 Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Cards Stack */}
        <View style={styles.cardsContainer}>
          {cards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No more cards! 🎉</Text>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Reset Cards</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Render cards in reverse order so first card is on top
            cards
              .slice(0, 3)
              .reverse()
              .map((card, idx) => {
                const actualIndex = 2 - idx; // Reverse index for stacking
                return (
                  <SwipeCard
                    key={card.id}
                    data={card}
                    index={actualIndex}
                    totalCards={Math.min(cards.length, 3)}
                    onSwipeLeft={actualIndex === 0 ? handleSwipeLeft : undefined}
                    onSwipeRight={actualIndex === 0 ? handleSwipeRight : undefined}
                  />
                );
              })
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionIcon}>👈</Text>
            <Text style={styles.instructionText}>Swipe Left = Pass</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionIcon}>👉</Text>
            <Text style={styles.instructionText}>Swipe Right = Like</Text>
          </View>
        </View>

        {/* Stats Footer */}
        <View style={styles.footer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{swipedCards.passed.length}</Text>
            <Text style={styles.statLabel}>Passed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{cards.length}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{swipedCards.liked.length}</Text>
            <Text style={styles.statLabel}>Liked</Text>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statsButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statsButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyState: {
    alignItems: "center",
  },
  emptyText: {
    fontSize: 24,
    marginBottom: 20,
    color: "#666",
  },
  resetButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  instructions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  instructionIcon: {
    fontSize: 24,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b6b",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
