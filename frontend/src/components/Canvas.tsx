import { useState, useRef, useEffect, type ReactNode } from 'react';

interface CanvasSize {
    width: number;
    height: number;
}

interface CanvasProps {
    children: (size: CanvasSize, scale: number) => ReactNode;
}

export default function Canvas({ children }: CanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState<CanvasSize>({
        width: 0,
        height: 0,
    });

    const [scale] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setStageSize({ width, height });
                }
            }
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full h-full bg-code-bg">
            <div
                ref={containerRef}
                className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
            >
                {stageSize.width > 0 && children(stageSize, scale)}
            </div>
        </div>
    );
}
