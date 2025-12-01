import { Settings, Trash2 } from "lucide-react";
import { Rnd } from "react-rnd";
import { useWidgetStore, type WidgetState } from "../store/widgetStore";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { RandomizerWidget } from "./widgets/RandomizerWidget";

interface WidgetProps {
  widget: WidgetState;
}

export function Widget({ widget }: WidgetProps) {
  const {
    updateWidget,
    selectWidget,
    selectedWidgetId,
    removeWidget,
    setSettingsPanelOpen,
  } = useWidgetStore();
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
      onMouseDown={(e) => {
        e.stopPropagation(); // Prevent deselecting when clicking widget
        selectWidget(widget.id);
      }}
      style={{ zIndex: widget.zIndex }}
      bounds="parent"
    >
      <div className="relative w-full h-full group">
        {isSelected && (
          <div className="absolute -top-12 right-0 flex gap-2 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm border z-50">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                setSettingsPanelOpen(true);
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                removeWidget(widget.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Card
          className={cn(
            "w-full h-full flex flex-col justify-center items-center select-none transition-colors",
            isSelected
              ? "border-2 border-primary"
              : "border hover:border-primary/50"
          )}
        >
          <CardContent className="p-4 text-center w-full h-full flex flex-col">
            <div className="text-sm font-medium text-muted-foreground mb-2 capitalize self-start">
              {widget.type}
            </div>

            {widget.type === "randomizer" ? (
              <RandomizerWidget widget={widget} />
            ) : (
              <>
                <div className="text-2xl font-bold mb-2 capitalize">
                  {widget.type}
                </div>
                <div className="text-muted-foreground text-sm">
                  {widget.width} x {widget.height}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Rnd>
  );
}
