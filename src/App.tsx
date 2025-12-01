import { useEffect } from "react";
import { Toolbar } from "./components/Toolbar";
import { Widget } from "./components/Widget";
import { SettingsPanel } from "./components/SettingsPanel";
import { useWidgetStore } from "./store/widgetStore";

function App() {
  const { widgets, removeWidget, selectedWidgetId, selectWidget } =
    useWidgetStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedWidgetId) {
        removeWidget(selectedWidgetId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedWidgetId, removeWidget]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center relative">
      {/* Overlay for better visibility */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Widgets Layer */}
      <div
        className="absolute inset-0"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            selectWidget(null);
          }
        }}
      >
        {widgets.map((widget) => (
          <Widget key={widget.id} widget={widget} />
        ))}
      </div>

      {/* UI Layer */}
      <Toolbar />
      <SettingsPanel />
    </div>
  );
}

export default App;
