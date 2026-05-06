import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

interface CanvasSize {
    width: number;
    height: number;
}

interface CanvasProps {
    children: (size: CanvasSize, scale: number) => ReactNode;
    onAddGarden: (x: number, y: number) => void;
}

export default function Canvas({ children, onAddGarden }: CanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
    const [menu, setMenu] = useState({ x: 0, y: 0, visible: false });

    useEffect(() => {
        if (!containerRef.current) return;
        const observe = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setSize({ width, height });
        });
        observe.observe(containerRef.current);
        return () => observe.disconnect();
    }, []);

    const handleZoom = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const speedFactor = 0.001;
        const newScale = oldScale * (1 - e.evt.deltaY * speedFactor);

        const minScale = 0.1;
        const maxScale = 5;
        const boundedScale = Math.max(minScale, Math.min(maxScale, newScale));

        setView({
            scale: boundedScale,
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
    };

    const handleContextMenu = (e: Konva.KonvaEventObject<PointerEvent>) => {
        e.evt.preventDefault();

        const stage = e.target.getStage();
        if (!stage) return;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const worldPos = {
            x: (pointer.x - stage.x()) / stage.scaleX(),
            y: (pointer.y - stage.y()) / stage.scaleY(),
        };

        setMenu({ x: worldPos.x, y: worldPos.y, visible: true });
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-code-bg overflow-hidden relative"
        >
            <Stage
                width={size.width}
                height={size.height}
                draggable
                x={view.x}
                y={view.y}
                scaleX={view.scale}
                scaleY={view.scale}
                onWheel={handleZoom}
                onContextMenu={handleContextMenu}
                onMouseDown={() => {
                    if (menu.visible) setMenu({ ...menu, visible: false });
                }}
                onDragEnd={(e) => {
                    if (e.target === e.target.getStage()) {
                        setView((prev) => ({
                            ...prev,
                            x: e.target.x(),
                            y: e.target.y(),
                        }));
                    }
                }}
            >
                <Layer>{children(size, view.scale)}</Layer>
            </Stage>
            {menu.visible && (
                <div
                    className="absolute z-50 bg-bg-main border border-border-main shadow-xl rounded py-1 w-32"
                    style={{
                        left: menu.x * view.scale + view.x,
                        top: menu.y * view.scale + view.y,
                    }}
                >
                    <button
                        onClick={() => {
                            onAddGarden(menu.x, menu.y);
                            setMenu({ ...menu, visible: false });
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-white"
                    >
                        + Add Garden
                    </button>
                </div>
            )}
        </div>
    );
}
