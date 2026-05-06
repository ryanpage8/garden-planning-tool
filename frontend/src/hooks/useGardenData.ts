import { useState } from 'react';
import type { Plot } from '../types/garden';

export function useGardenData() {
    const [plots, setPlots] = useState<Plot[]>([
        { id: 'plot1', x: 80, y: 150, width: 70, height: 70, plants: [1] },
        {
            id: 'plot2',
            x: 170,
            y: 150,
            width: 250,
            height: 70,
            plants: [1, 2, 3],
        },
        { id: 'plot3', x: 550, y: 280, width: 80, height: 200, plants: [1, 2] },
    ]);

    const addPlot = () => {
        const id = `plot-${Date.now()}`;
        setPlots((prev) => [
            ...prev,
            { id, x: 50, y: 50, width: 100, height: 100, plants: [] },
        ]);
    };

    const handleMove = (id: string, x: number, y: number) => {
        setPlots((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
    };

    const handleResize = (id: string, width: number, height: number) => {
        setPlots((prev) =>
            prev.map((p) => (p.id === id ? { ...p, width, height } : p))
        );
    };

    return { plots, addPlot, handleMove, handleResize };
}
