import { Button } from "../ui/button";
import {
  useWidgetStore,
  type RandomizerData,
  type WidgetState,
} from "@/store/widgetStore";

interface RandomizerWidgetProps {
  widget: WidgetState;
}

export function RandomizerWidget({ widget }: RandomizerWidgetProps) {
  const { updateWidget } = useWidgetStore();
  const data = widget.data as RandomizerData;
  const items = data.items || [];
  const pickedItems = data.pickedItems || [];
  const allowRepeats = data.allowRepeats || false;

  const handlePick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (items.length === 0) return;

    let pool = items;
    if (!allowRepeats) {
      pool = items.filter((item) => !pickedItems.includes(item));
    }

    if (pool.length === 0) return;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const picked = pool[randomIndex];

    updateWidget(widget.id, {
      data: {
        ...data,
        lastPicked: picked,
        pickedItems: allowRepeats ? pickedItems : [...pickedItems, picked],
      },
    });
  };

  const allPicked =
    !allowRepeats && items.length > 0 && items.length === pickedItems.length;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
      <div className="text-4xl font-bold break-all text-center px-2">
        {data.lastPicked || "?"}
      </div>
      <div className="flex gap-2">
        {!allPicked && (
          <Button onClick={handlePick} disabled={items.length === 0}>
            Pick Random
          </Button>
        )}
        {!allowRepeats && allPicked && (
          <Button
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              updateWidget(widget.id, {
                data: { ...data, pickedItems: [], lastPicked: undefined },
              });
            }}
          >
            Reset
          </Button>
        )}
      </div>
      {!allowRepeats && (
        <div className="text-xs text-muted-foreground">
          {pickedItems.length} / {items.length} picked
        </div>
      )}
    </div>
  );
}
