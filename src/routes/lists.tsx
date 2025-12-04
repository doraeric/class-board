import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useListStore } from "../store/listStore";

export const Route = createFileRoute("/lists")({
  component: ListManager,
});

function ListManager() {
  const { lists, addList, updateList, removeList } = useListStore();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");

  const selectedList = lists.find((l) => l.id === selectedListId);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName("");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col bg-muted/30">
        <div className="p-4 border-b flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-semibold text-lg">My Lists</h1>
        </div>

        <div className="p-4 border-b">
          <form onSubmit={handleAddList} className="flex gap-2">
            <Input
              placeholder="New List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="h-8"
            />
            <Button type="submit" size="icon" className="h-8 w-8 shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {lists.map((list) => (
            <div
              key={list.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent group",
                selectedListId === list.id && "bg-accent"
              )}
              onClick={() => setSelectedListId(list.id)}
            >
              <span className="truncate text-sm font-medium">{list.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete this list?")) {
                    removeList(list.id);
                    if (selectedListId === list.id) setSelectedListId(null);
                  }
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {lists.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-4">
              No lists yet. Create one above!
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedList ? (
          <div className="flex-1 flex flex-col p-8 max-w-2xl mx-auto w-full">
            <div className="mb-6 space-y-4">
              <div className="space-y-2">
                <Label>List Name</Label>
                <Input
                  value={selectedList.name}
                  onChange={(e) =>
                    updateList(selectedList.id, { name: e.target.value })
                  }
                  className="text-lg font-medium"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2 flex flex-col">
              <Label>Items (one per line)</Label>
              <Textarea
                value={selectedList.items.join("\n")}
                onChange={(e) =>
                  updateList(selectedList.id, {
                    items: e.target.value.split("\n"),
                  })
                }
                className="flex-1 resize-none font-mono text-sm"
                placeholder="Item 1&#10;Item 2&#10;Item 3"
              />
              <div className="text-xs text-muted-foreground text-right">
                {selectedList.items.filter((i) => i.trim()).length} items
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a list to edit
          </div>
        )}
      </div>
    </div>
  );
}
