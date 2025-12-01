import { X } from "lucide-react";
import { useWidgetStore } from "../store/widgetStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const {
    selectedWidgetId,
    widgets,
    updateWidget,
    isSettingsPanelOpen,
    setSettingsPanelOpen,
  } = useWidgetStore();

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId);

  if (!isSettingsPanelOpen) return null;

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out z-50",
        isSettingsPanelOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Settings</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSettingsPanelOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {selectedWidget ? (
          <>
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="p-2 border rounded-md bg-muted capitalize">
                {selectedWidget.type}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">
                Position & Size
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="x">X</Label>
                  <Input
                    id="x"
                    type="number"
                    value={Math.round(selectedWidget.x)}
                    onChange={(e) =>
                      updateWidget(selectedWidget.id, {
                        x: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="y">Y</Label>
                  <Input
                    id="y"
                    type="number"
                    value={Math.round(selectedWidget.y)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateWidget(selectedWidget.id, {
                        y: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={Math.round(selectedWidget.width)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateWidget(selectedWidget.id, {
                        width: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={Math.round(selectedWidget.height)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateWidget(selectedWidget.id, {
                        height: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No widget selected
          </div>
        )}
      </div>
    </div>
  );
}
