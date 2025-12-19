import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📱 Mobile Dev EXPO</Text>
        <Text style={styles.subtitle}>Choose an app to explore</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.todoButton]}
            onPress={() => router.push("/todo")}
          >
            <Text style={styles.buttonIcon}>✓</Text>
            <Text style={styles.buttonText}>Todo App</Text>
            <Text style={styles.buttonDesc}>SQLite CRUD with Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tinderButton]}
            onPress={() => router.push("/tinder")}
          >
            <Text style={styles.buttonIcon}>💕</Text>
            <Text style={styles.buttonText}>Tinder Swipe</Text>
            <Text style={styles.buttonDesc}>Gesture & Animation Demo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonsContainer: {
    gap: 16,
  },
  button: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todoButton: {
    backgroundColor: "#4CAF50",
  },
  tinderButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  buttonDesc: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
});
