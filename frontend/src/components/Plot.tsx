import Konva from 'konva';
import { Rect, Text, Group } from 'react-konva';

interface PlotProps {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    gardenWidth: number;
    gardenHeight: number;
    plants: string[] | number[];
    isSelected: boolean;
    onSelect: () => void;
    onAttach: (id: string, node: Konva.Node | null) => void;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
}

function Plot({
    id,
    x,
    y,
    width,
    height,
    plants,
    isSelected,
    onSelect,
    onAttach,
    onDragEnd,
    onTransformEnd,
}: PlotProps) {
    return (
        <Group
            ref={(node) => onAttach(id, node)}
            x={x}
            y={y}
            draggable
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={onDragEnd}
            onTransformEnd={onTransformEnd}
        >
            <Rect
                width={width}
                height={height}
                cornerRadius={10}
                fill="rgba(255, 255, 255, 0.02)"
                stroke={isSelected ? '#00ff88' : 'white'}
                strokeWidth={isSelected ? 2 : 1}
            />
            {plants.map((_, i) => (
                <Text
                    key={i}
                    text="🌱"
                    fontSize={20}
                    x={10 + ((i * 35) % (width - 20))}
                    y={10 + Math.floor(i / (width / 35)) * 35}
                />
            ))}
        </Group>
    );
}

export default Plot;
