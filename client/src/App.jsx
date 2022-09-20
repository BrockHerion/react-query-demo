import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { useState } from "react";
import "./App.css";

// Initialize the client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToDoList />
    </QueryClientProvider>
  );
}

function ToDoList() {
  const [title, setTitle] = useState("");

  const queryClient = useQueryClient();

  // Query to fetch all to-dos
  const { data: todos } = useQuery(["getTodos"], () =>
    fetch("http://localhost:3001/todos")
      .then((res) => res.json())
      .then((json) => json)
  );

  // Add to-do mutation
  const addTodoMutation = useMutation(
    (formData) => {
      return fetch("http://localhost:3001/todos", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((json) => json);
    },
    {
      onMutate(data) {
        queryClient.setQueryData(["getTodos"], (todos) => {
          todos.push(data);
          return todos;
        });
      },
    }
  );

  const addTodo = (e) => {
    e.preventDefault();
    setTitle("");
    addTodoMutation.mutate({ title });
  };

  if (!todos) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="App">
      <h1>React Query To-Do List</h1>
      <div className="card">
        <h2>To-Do's</h2>
        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li key={`todo-${index}`}>
              <div className="todo">
                <span>{todo.title}</span>
                <input type="checkbox" />
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={addTodo}>
          <input
            className="add-todo-input"
            type="text"
            placeholder="My new to-do"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
}

export default App;
