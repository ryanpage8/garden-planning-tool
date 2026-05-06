import { useState } from 'react';
import EditorLayout from '../components/layout/EditorLayout';
import Canvas from '../components/Canvas';
import Garden from '../components/Garden';
import { useGardenData } from '../hooks/useGardenData';

export default function GardenEditor() {
    const { gardens, plots, addGarden, addPlot, handleMove, handleResize } =
        useGardenData();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <EditorLayout
            header={
                <div className="flex justify-between items-center w-full px-2">
                    <h1 className="text-xl font-bold text-text-header m-0">
                        Garden Planning Tool
                    </h1>
                </div>
            }
            sidebar={
                <div className="p-4 flex flex-col gap-4">
                    <div className="h-px bg-border-main w-full" />
                </div>
            }
            panel={
                <div className="p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-text-header">
                        Feature
                    </h2>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm text-text-main italic">
                            Search and AI Chatbot panel.
                        </p>
                    </div>
                </div>
            }
            canvas={
                <Canvas onAddGarden={addGarden}>
                    {(_size, scale) => (
                        <>
                            {gardens.map((garden) => (
                                <Garden
                                    key={garden.id}
                                    x={garden.x}
                                    y={garden.y}
                                    width={garden.dimensions.width}
                                    height={garden.dimensions.height}
                                    scale={scale}
                                    plots={plots}
                                    selectedId={selectedId}
                                    onSelect={setSelectedId}
                                    onMove={handleMove}
                                    onResize={handleResize}
                                />
                            ))}
                        </>
                    )}
                </Canvas>
            }
            footer={
                <div className="flex justify-between items-center w-full text-[10px] uppercase tracking-widest text-text-main/60 px-2 h-full">
                    <span>Workspace • Canvas Mode</span>
                    <button
                        onClick={addPlot}
                        className="bg-accent text-white px-3 py-1 rounded hover:opacity-90 active:scale-95 transition-all font-bold"
                    >
                        + Add Plot
                    </button>
                    <span>{plots.length} Total Plots</span>
                </div>
            }
        />
    );
}
