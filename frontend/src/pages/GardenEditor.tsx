import { useState, useRef, useEffect } from 'react';
import EditorLayout from '../components/layout/EditorLayout';
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

export default function GardenEditor() {
  const [message, setMessage] = useState<string>("Loading...");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [plots, setPlots] = useState<Plot[]>([
    { id: 'plot1', x: 80,  y: 150, width: 70,  height: 70,  plants: [1] },
    { id: 'plot2', x: 170, y: 150, width: 250, height: 70,  plants: [1, 2, 3] },
    { id: 'plot3', x: 550, y: 280, width: 80,  height: 200, plants: [1, 2] },
  ]);
  const [scale, setScale] = useState(1);
  const [position, _setPosition] = useState({ x: 0, y: 0 });
  const [panelWidth, setPanelWidth] = useState(300);
  const isResizing = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const startResizing = (e: React.PointerEvent) => {
    const target = e.target as HTMLDivElement;
    target.setPointerCapture(e.pointerId);
    
    isResizing.current = true;
    setIsDragging(true); // Trigger cursor/selection styles
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", (event) => stopResizing(event, target), { once: true });
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX - 32; 
    if (newWidth > 150 && newWidth < 600) {
      setPanelWidth(newWidth);
    }
  };
  const stopResizing = (e: PointerEvent, target: HTMLDivElement) => {
    isResizing.current = false;
    setIsDragging(false);
    target.releasePointerCapture(e.pointerId);
    document.removeEventListener("pointermove", handlePointerMove);
  };


  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });


  useEffect(() => {
  if (!containerRef.current) return;

  const rect = containerRef.current.getBoundingClientRect();
  setStageSize({ width: rect.width, height: rect.height });

  const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      if (width > 0 && height > 0) {
        setStageSize({ width, height });
      }
    }
  });

  observer.observe(containerRef.current);
  return () => observer.disconnect();
}, []);

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

  const handleMove = (id: string, newX: number, newY: number) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, x: newX, y: newY } : p));
  };

  const handleViewportWheel = (e: React.WheelEvent) => {
  e.preventDefault();
  const scaleBy = 1.1;
  const newScale = e.deltaY < 0 ? scale * scaleBy : scale / scaleBy;
  
  setScale(Math.min(Math.max(newScale, 0.1), 5));
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

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
  }, [isDragging]);


  return (
    <EditorLayout
      panelWidth={panelWidth}
      onResizeStart={startResizing}
      header={
        <div className="flex justify-between items-center w-full px-2">
          <h1 className="text-xl font-bold text-text-header m-0">Garden Planning Tool</h1>
          <code className="text-xs">Status: {message}</code>
        </div>
      }
      sidebar={
        <div className="p-4 flex flex-col gap-4">
          
          <div className="h-px bg-border-main w-full" />
          
        </div>
      }
      panel={
        <div className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-text-header">Feature</h2>
        
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-text-main italic">This is the feature panel for search and AI Chatbot.</p>
            </div>
       
        </div>
      }
      canvas={
        <div className="w-full h-full bg-code-bg"> 
          <div 
            ref={containerRef}
            className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
            onWheel={handleViewportWheel}
          >
            <Grid 
              width={stageSize.width} 
              height={stageSize.height}
              scale={scale}
              position={position}
              plots={plots}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              plotRefs={plotRefs}
              trRef={trRef}
              onResize={handleResize}
              onMove={handleMove}
            />
          </div>
        </div>
      }
      footer={
        <div className="flex justify-between items-center w-full text-[10px] uppercase tracking-widest text-text-main/60 px-2 h-full">
          <span>800 x 600 Workspace • Canvas Mode</span>
          
          <button 
            onClick={addPlot} 
            className="text-white px-2 py-1 rounded hover:opacity-90 active:scale-95 transition-all uppercase font-bold text-[9px]"
          >
            + Add Plot
          </button>

          <span>{plots.length} Total Plots</span>
        </div>
      }
    />
  );
}
