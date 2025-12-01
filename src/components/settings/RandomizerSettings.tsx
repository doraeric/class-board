import {
  useWidgetStore,
  type RandomizerData,
  type WidgetState,
} from "@/store/widgetStore";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";

interface RandomizerSettingsProps {
  widget: WidgetState;
}

export function RandomizerSettings({ widget }: RandomizerSettingsProps) {
  const { updateWidget } = useWidgetStore();
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
        <Label htmlFor="items">Items (one per line)</Label>
        <Textarea
          id="items"
          placeholder="Enter items..."
          className="h-32"
          value={data.items?.join("\n") || ""}
          onChange={(e) => updateData({ items: e.target.value.split("\n") })}
        />
      </div>
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
