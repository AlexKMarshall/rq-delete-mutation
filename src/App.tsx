import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
  { id: 4, name: "Item 4" },
  { id: 5, name: "Item 5" },
];

async function fetchItems() {
  await wait(2000);
  return items;
}

async function removeItem(id: number) {
  await wait(1000);
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    return id;
  }
  throw new Error("id not found");
}

function App() {
  const { data: items, isRefetching } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
    useErrorBoundary: true,
  });

  return (
    <div>
      <h1>Test delete mutation</h1>
      {isRefetching ? <div>Refetching...</div> : null}
      {items ? (
        <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map((item) => (
            <Item key={item.id} {...item} />
          ))}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

function Item({ id, name }: { id: number; name: string }) {
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: () => removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return (
    <li>
      {name}{" "}
      <button
        onClick={() => {
          if (remove.isLoading) return;
          remove.mutate();
        }}
      >
        {remove.isLoading ? "deleting..." : "delete"}
      </button>
    </li>
  );
}

export default App;
