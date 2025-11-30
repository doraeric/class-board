import { Rnd } from "react-rnd";
import { useWidgetStore, type WidgetState } from "../store/widgetStore";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface WidgetProps {
  widget: WidgetState;
}

export function Widget({ widget }: WidgetProps) {
  const { updateWidget, selectWidget, selectedWidgetId } = useWidgetStore();
  const isSelected = selectedWidgetId === widget.id;

  return (
    <Rnd
      size={{ width: widget.width, height: widget.height }}
      position={{ x: widget.x, y: widget.y }}
      onDragStop={(_e, d) => {
        updateWidget(widget.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        updateWidget(widget.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        });
      }}
      onMouseDown={() => selectWidget(widget.id)}
      style={{ zIndex: widget.zIndex }}
      bounds="parent"
    >
      <Card
        className={cn(
          "w-full h-full flex flex-col justify-center items-center select-none",
          isSelected ? "border-2 border-blue-500" : "border-0"
        )}
      >
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold mb-2 capitalize">
            {widget.type}
          </div>
          <div className="text-muted-foreground text-sm">
            {widget.width} x {widget.height}
          </div>
        </CardContent>
      </Card>
    </Rnd>
  );
}
