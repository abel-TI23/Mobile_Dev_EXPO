import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Todo,
    addTodo,
    deleteTodo,
    getTodos,
    initDB,
    updateTodo,
} from "../services/todoService";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");

  useEffect(() => {
    (async () => {
      try {
        await initDB();
        await reload();
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  async function reload() {
    const data = await getTodos();
    setTodos(data);
  }

  async function handleAddOrUpdate() {
    if (!text.trim()) return;
    try {
      if (editingId) {
        await updateTodo(editingId, { text: text.trim() });
        setEditingId(null);
      } else {
        await addTodo(text.trim());
      }
      setText("");
      await reload();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleToggle(item: Todo) {
    try {
      await updateTodo(item.id!, { done: item.done ? 0 : 1 });
      await reload();
    } catch (e) {
      console.error(e);
    }
  }

  function startEdit(item: Todo) {
    setEditingId(item.id ?? null);
    setText(item.text);
  }

  function confirmDelete(item: Todo) {
    Alert.alert("Hapus Todo", "Yakin ingin menghapus?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo(item.id!);
            await reload();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  }

  // Filter todos based on selected filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === "done") return todo.done === 1;
    if (filter === "undone") return todo.done === 0;
    return true;
  });

  function renderItem({ item }: { item: Todo }) {
    return (
      <View style={styles.itemRow}>
        <TouchableOpacity onPress={() => handleToggle(item)} style={{ flex: 1 }}>
          <Text style={[styles.itemText, item.done ? styles.doneText : null]}>{item.text}</Text>
          {item.finished_at && (
            <Text style={styles.finishedAtText}>
              Selesai: {new Date(item.finished_at).toLocaleString('id-ID')}
            </Text>
          )}
        </TouchableOpacity>
        <Button title="Edit" onPress={() => startEdit(item)} />
        <View style={{ width: 8 }} />
        <Button color="#d9534f" title="Del" onPress={() => confirmDelete(item)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo (SQLite)</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Tulis todo..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Button title={editingId ? "Simpan" : "Tambah"} onPress={handleAddOrUpdate} />
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === "all" && styles.filterBtnActive]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>Semua</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === "done" && styles.filterBtnActive]}
          onPress={() => setFilter("done")}
        >
          <Text style={[styles.filterText, filter === "done" && styles.filterTextActive]}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === "undone" && styles.filterBtnActive]}
          onPress={() => setFilter("undone")}
        >
          <Text style={[styles.filterText, filter === "undone" && styles.filterTextActive]}>Undone</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text style={{ textAlign: "center" }}>Belum ada todo.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", padding: 8, marginRight: 8, borderRadius: 6 },
  filterRow: { flexDirection: "row", marginBottom: 12, gap: 8 },
  filterBtn: { flex: 1, padding: 10, borderRadius: 6, borderWidth: 1, borderColor: "#ddd", alignItems: "center" },
  filterBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  filterText: { fontSize: 14, color: "#666" },
  filterTextActive: { color: "#fff", fontWeight: "600" },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  itemText: { fontSize: 16 },
  doneText: { textDecorationLine: "line-through", color: "#999" },
  finishedAtText: { fontSize: 12, color: "#666", marginTop: 4 },
});
