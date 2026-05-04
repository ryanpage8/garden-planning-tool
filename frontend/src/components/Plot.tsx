import { Rect, Text, Group } from 'react-konva';

const GRID_CONFIG = {
  x: 50,
  y: 100,
  width: 700,
  height: 500
};

interface PlotProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  plants: number[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  plotRefs: React.MutableRefObject<Record<string, any>>;
  onResize: (id: string, width: number, height: number) => void;
}

function Plot({ 
  id, 
  x, 
  y, 
  width, 
  height, 
  plants, 
  selectedId, 
  setSelectedId, 
  plotRefs, 
  onResize 
}: PlotProps) {
  return (
    <Group
      ref={(node) => { if (node) plotRefs.current[id] = node; }}
      x={x}
      y={y}
      draggable
      onClick={() => setSelectedId(id)}
      dragBoundFunc={(pos) => ({
        x: Math.max(GRID_CONFIG.x, Math.min(pos.x, GRID_CONFIG.x + GRID_CONFIG.width - width)),
        y: Math.max(GRID_CONFIG.y, Math.min(pos.y, GRID_CONFIG.y + GRID_CONFIG.height - height)),
      })}
      onTransformEnd={() => {
        const node = plotRefs.current[id];
        if (node) {
          const newWidth = Math.round(node.width() * node.scaleX());
          const newHeight = Math.round(node.height() * node.scaleY());
          
          node.scaleX(1);
          node.scaleY(1);
          
          onResize(id, newWidth, newHeight);
        }
      }}
    >
      <Rect
        width={width}
        height={height}
        cornerRadius={10}
        fill="transparent"
        stroke={selectedId === id ? "#00ff88" : "white"}
        strokeWidth={selectedId === id ? 2 : 1}
      />
      {plants.map((_, i) => (
        <Text 
          key={i} 
          text="🌱"
          fontSize={20} 
          fill="white" 
          x={20 + i * 50} 
          y={height / 2 - 10} 
        />
      ))}
    </Group>
  );
}

export default Plot;
