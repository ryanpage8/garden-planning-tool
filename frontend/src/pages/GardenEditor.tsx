import { useState, useRef, useEffect } from 'react';
import Grid from '../components/Grid'; 


interface Plot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  plants: number[];
}

interface BackendData {
  message: string;
}

function GardenEditor() {
  const [message, setMessage] = useState<string>("Loading...");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [plots, setPlots] = useState<Plot[]>([
    { id: 'plot1', x: 80,  y: 150, width: 70,  height: 70,  plants: [1] },
    { id: 'plot2', x: 170, y: 150, width: 250, height: 70,  plants: [1, 2, 3] },
    { id: 'plot3', x: 550, y: 280, width: 80,  height: 200, plants: [1, 2] },
  ]);

  const trRef = useRef<any>(null);
  const plotRefs = useRef<Record<string, any>>({});

  const addPlot = () => {
    const id = `plot${Date.now()}`;
    setPlots(prev => [...prev, {
      id,
      x: 80,
      y: 150,
      width: 100,
      height: 100,
      plants: [1],
    }]);
  };

  const handleResize = (id: string, newWidth: number, newHeight: number) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, width: newWidth, height: newHeight } : p));
  };

  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json() as Promise<BackendData>)
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend Offline"))
  }, []);

  useEffect(() => {
    if (selectedId && trRef.current && plotRefs.current[selectedId]) {
      trRef.current.nodes([plotRefs.current[selectedId]]);
      trRef.current.getLayer().batchDraw();
    } else if (!selectedId && trRef.current) {
      trRef.current.nodes([]);
      const layer = trRef.current.getLayer();
      if (layer) layer.batchDraw();
    }
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-bg-main p-8 text-text-main">
      <h1 className="text-3xl font-bold text-text-header mb-6">Garden Planning Tool</h1>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-code-bg border border-border-main rounded-lg p-4 shadow-sm">
          <p className="text-sm text-text-main">
            System Status: <strong className="text-emerald-600">{message}</strong>
          </p>
        </div>
        <button 
          onClick={addPlot} 
          className="font-sans text-[14px] font-medium px-4 py-2 rounded-lg border border-border-main bg-accent text-white cursor-pointer transition-colors hover:opacity-90"
        >
          + Add Plot
        </button>
      </div>

      <div className="bg-code-bg rounded-xl shadow-lg border border-border-main overflow-hidden">
        <Grid 
          plots={plots}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          plotRefs={plotRefs}
          trRef={trRef}
          onResize={handleResize}
        />
      </div>
    </div>
  );
}

export default GardenEditor;
