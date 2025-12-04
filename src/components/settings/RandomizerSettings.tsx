import { useListStore } from "@/store/listStore";
import {
  useWidgetStore,
  type RandomizerData,
  type WidgetState,
} from "@/store/widgetStore";
import { Link } from "@tanstack/react-router";
import { RotateCcw, Settings2 } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface RandomizerSettingsProps {
  widget: WidgetState;
}

export function RandomizerSettings({ widget }: RandomizerSettingsProps) {
  const { updateWidget } = useWidgetStore();
  const { lists } = useListStore();
  const data = widget.data as RandomizerData;

  const updateData = (updates: Partial<RandomizerData>) => {
    updateWidget(widget.id, {
      data: { ...data, ...updates },
    });
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-medium text-sm text-muted-foreground">
        Randomizer Settings
      </h3>

      <div className="space-y-2">
        <Label>Source</Label>
        <div className="flex gap-2">
          <Button
            variant={data.source !== "list" ? "default" : "outline"}
            size="sm"
            onClick={() => updateData({ source: "manual" })}
            className="flex-1"
          >
            Manual
          </Button>
          <Button
            variant={data.source === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => updateData({ source: "list" })}
            className="flex-1"
          >
            My Lists
          </Button>
        </div>
      </div>

      {data.source === "list" ? (
        <div className="space-y-2">
          <Label>Select List</Label>
          <div className="flex gap-2">
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={data.listId || ""}
              onChange={(e) => {
                const list = lists.find((l) => l.id === e.target.value);
                if (list) {
                  updateData({
                    listId: list.id,
                    items: list.items,
                    pickedItems: [],
                    lastPicked: undefined,
                  });
                }
              }}
            >
              <option value="" disabled>
                Select a list...
              </option>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name} ({list.items.length} items)
                </option>
              ))}
            </select>
            <Link to="/lists">
              <Button variant="outline" size="icon" title="Manage Lists">
                <Settings2 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {lists.length === 0 && (
            <div className="text-xs text-muted-foreground">
              No lists found.{" "}
              <Link to="/lists" className="underline">
                Create one?
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="items">Items (one per line)</Label>
          <Textarea
            id="items"
            placeholder="Enter items..."
            className="h-32"
            value={data.items?.join("\n") || ""}
            onChange={(e) => updateData({ items: e.target.value.split("\n") })}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="allowRepeats"
          checked={data.allowRepeats || false}
          onCheckedChange={(checked: boolean) =>
            updateData({ allowRepeats: checked })
          }
        />
        <Label htmlFor="allowRepeats">Allow Repeats</Label>
      </div>

      {!data.allowRepeats && (
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <Label>History ({data.pickedItems?.length || 0})</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateData({ pickedItems: [], lastPicked: undefined })
              }
              disabled={!data.pickedItems?.length}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
          {data.pickedItems?.length > 0 && (
            <div className="bg-muted p-2 rounded-md text-sm max-h-32 overflow-y-auto">
              <ul className="list-disc list-inside">
                {data.pickedItems.map((item, i) => (
                  <li key={i} className="truncate">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
