import { useRef, useEffect } from 'react';
import Konva from 'konva';
import { Layer, Rect, Text, Transformer } from 'react-konva';
import Plot from './Plot';
import { type Plot as PlotData, type Garden } from '../types/garden.ts';

interface GardenProps {
    width: number;
    height: number;
    scale: number;
    plots: PlotData[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onMove: (id: string, x: number, y: number) => void;
    onResize: (id: string, width: number, height: number) => void;
}

export default function Garden({
    scale,
    plots,
    selectedId,
    onSelect,
    onMove,
    onResize,
}: GardenProps) {
    const trRef = useRef<Konva.Transformer>(null);
    const plotRefs = useRef<Record<string, Konva.Node>>({});

    const handleAttach = (id: string, node: Konva.Node | null) => {
        if (node) {
            plotRefs.current[id] = node;
        } else {
            delete plotRefs.current[id];
        }
    };

    useEffect(() => {
        const transformer = trRef.current;
        if (!transformer) return;

        const selectedNode = selectedId ? plotRefs.current[selectedId] : null;

        if (selectedNode) {
            transformer.nodes([selectedNode]);
            transformer.getLayer()?.batchDraw();
        } else {
            transformer.nodes([]);
            transformer.getLayer()?.batchDraw();
        }
    }, [selectedId]);

    return (
        <Layer>
            <Rect
                x={50}
                y={100}
                width={700}
                height={600}
                stroke="#333"
                strokeWidth={1 / scale}
                dash={[5, 5]}
            />

            <Text
                x={50}
                y={64}
                text="Garden Area"
                fontSize={14}
                fill="#888"
                fontStyle="bold"
                listening={false}
            />

            {plots.map((plot) => (
                <Plot
                    key={plot.id}
                    {...plot}
                    onAttach={handleAttach}
                    isSelected={selectedId === plot.id}
                    onSelect={() => onSelect(plot.id)}
                    onDragEnd={(e) =>
                        onMove(plot.id, e.target.x(), e.target.y())
                    }
                    onTransformEnd={(e) => {
                        const node = e.target;
                        onResize(
                            plot.id,
                            node.width() * node.scaleX(),
                            node.height() * node.scaleY()
                        );
                        node.setAttrs({ scaleX: 1, scaleY: 1 });
                    }}
                />
            ))}

            <Transformer
                ref={trRef}
                rotateEnabled={false}
                keepRatio={false}
                boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 20 || newBox.height < 20) return oldBox;
                    return newBox;
                }}
            />
        </Layer>
    );
}
