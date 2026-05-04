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
  plots: PlotData[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  plotRefs: React.MutableRefObject<Record<string, any>>;
  trRef: React.RefObject<any>;
  onResize: (id: string, width: number, height: number) => void;
}

function Grid({ 
  plots, 
  selectedId, 
  setSelectedId, 
  plotRefs, 
  trRef, 
  onResize 
}: GridProps) {
  return (
    <Stage
      width={800}
      height={600}
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) setSelectedId(null);
      }}
    >
      <Layer>
        <Rect x={50} y={100} width={700} height={500} stroke="white" strokeWidth={1} />
        <Text x={50} y={64} text="Garden Grid" fontSize={22} fill="#FFFFFF" />

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

        <Transformer ref={trRef} />
      </Layer>
    </Stage>
  );
}

export default Grid;