import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/todos";

function ToDoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const responce = await axios.post(API_URL, {
        title: newTodo,
        completed: false,
      });
      setTodos([...todos, responce.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const updateTodo = { ...todo, completed: !todo.completed };
      await axios.put(`${API_URL}/${todo.id}`, updateTodo);

      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? updateTodo : t))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Your To-Do List:</h2>

      <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Enter new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="text-gray-500">No todos yet.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`p-3 rounded border ${
                todo.completed ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <lable className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                />
                <span
                  className={todo.completed ? "line-through text-gray-600" : ""}
                >
                  {todo.title}
                </span>
              </lable>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ToDoList;
