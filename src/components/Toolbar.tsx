import { useWidgetStore, type WidgetType } from "../store/widgetStore";
import {
  Shuffle,
  Timer,
  BarChartHorizontal,
  Image as ImageIcon,
  Type,
} from "lucide-react";

export function Toolbar() {
  const addWidget = useWidgetStore((state) => state.addWidget);

  const tools: { type: WidgetType; icon: React.ElementType; label: string }[] =
    [
      { type: "randomizer", icon: Shuffle, label: "Randomizer" },
      { type: "timer", icon: Timer, label: "Timer" },
      { type: "poll", icon: BarChartHorizontal, label: "Poll" },
      { type: "image", icon: ImageIcon, label: "Image" },
      { type: "text", icon: Type, label: "Text" },
    ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border rounded-full shadow-lg px-6 py-3 flex gap-4 items-center z-50">
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => addWidget(tool.type)}
          className="flex flex-col items-center gap-1 group hover:-translate-y-1 transition-transform"
          title={tool.label}
        >
          <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-blue-100 transition-colors">
            <tool.icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
          </div>
          <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600">
            {tool.label}
          </span>
        </button>
      ))}
    </div>
  );
}
