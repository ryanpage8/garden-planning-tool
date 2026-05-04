import { Stage, Layer, Rect, Text, Transformer } from 'react-konva';
import Plot from './Plot';

interface PlotData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  plants: number[];
}

interface GridProps {
  width: number;
  height: number;
  scale: number;
  position: { x: number; y: number };
  plots: PlotData[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  plotRefs: React.MutableRefObject<Record<string, any>>;
  trRef: React.RefObject<any>;
  onResize: (id: string, width: number, height: number) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export default function Grid({ 
  width,
  height,
  scale,
  position,
  plots, 
  selectedId, 
  setSelectedId, 
  plotRefs, 
  trRef, 
  onResize
}: GridProps) {
  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) setSelectedId(null);
      }}
    >
      <Layer
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
      >
        <Rect 
          x={50} 
          y={100} 
          width={700} 
          height={600} 
          stroke="#555" 
          strokeWidth={1 / scale}
        />
        
        <Text 
          x={50} 
          y={64} 
          text="Garden Workspace" 
          fontSize={18} 
          fill="#666" 
          fontStyle="bold"
        />

        {plots.map((plot) => (
          <Plot
            key={plot.id}
            {...plot}
            plotRefs={plotRefs}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onResize={onResize}
          />
        ))}

        <Transformer 
          ref={trRef}
          rotateEnabled={false}
          keepRatio={false}
        />
      </Layer>
    </Stage>
  );
}