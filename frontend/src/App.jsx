import { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Text, Group, Transformer } from 'react-konva';
import './App.css'

function Plot({ id, x, y, width, height, plants, label, selectedId, setSelectedId, plotRefs, onResize }) {
  const gridX = 50;
  const gridY = 100;
  const gridW = 700;
  const gridH = 500;

  return (
    <Group
      ref={(node) => { if (node) plotRefs.current[id] = node; }}
      x={x}
      y={y}
      draggable
      onClick={() => setSelectedId(id)}
      dragBoundFunc={(pos) => ({
        x: Math.max(gridX, Math.min(pos.x, gridX + gridW - width)),
        y: Math.max(gridY, Math.min(pos.y, gridY + gridH - height)),
      })}
      onTransformEnd={() => {
        const node = plotRefs.current[id];
        const newWidth = Math.round(node.width() * node.scaleX());
        const newHeight = Math.round(node.height() * node.scaleY());
        node.scaleX(1);
        node.scaleY(1);
        onResize(id, newWidth, newHeight);
      }}
    >
      <Rect
        width={width}
        height={height}
        cornerRadius={10}
        fill="transparent"
        stroke={selectedId === id ? "#00ff88" : "white"}
        strokeWidth={selectedId === id ? 2 : 1}
      />
      {plants.map((plant, i) => (
        <Text key={i} fontSize={20} fill="white" x={20 + i * 50} y={height / 2 - 10} />
      ))}
    </Group>
  )
}

function App() {
  const [message, setMessage] = useState("Loading...")
  const [selectedId, setSelectedId] = useState(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const [plots, setPlots] = useState([
    { id: 'plot1', x: 80,  y: 150, width: 70,  height: 70,  plants: [1] },
    { id: 'plot2', x: 170, y: 150, width: 250, height: 70,  plants: [1, 2, 3] },
    { id: 'plot3', x: 550, y: 280, width: 80,  height: 200, plants: [1, 2] },
  ]);
  const trRef = useRef();
  const plotRefs = useRef({});

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

  const handleResize = (id, newWidth, newHeight) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, width: newWidth, height: newHeight } : p));
  };

  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend Offline"))
  }, []);

  useEffect(() => {
    if (selectedId && trRef.current && plotRefs.current[selectedId]) {
      trRef.current.nodes([plotRefs.current[selectedId]]);
      trRef.current.getLayer().batchDraw();
    } else if (!selectedId && trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  return (
    <div className="App">
      <h1>Garden Planning Tool</h1>
      <div className="card">
        <p>System Status: <strong>{message}</strong></p>
      </div>
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

          <Group
            x={660}
            y={60}
            onClick={addPlot}
            onMouseEnter={e => {
              e.target.getStage().container().style.cursor = 'pointer';
              setBtnHovered(true);
            }}
            onMouseLeave={e => {
              e.target.getStage().container().style.cursor = 'default';
              setBtnHovered(false);
            }}
          >
            <Rect
              width={90}
              height={28}
              cornerRadius={6}
              fill={btnHovered ? "rgba(255,255,255,0.1)" : "transparent"}
              stroke="white"
              strokeWidth={1}
            />
            <Text
              text="+ Add Plot"
              fontSize={14}
              fill="white"
              width={90}
              height={28}
              align="center"
              verticalAlign="middle"
            />
          </Group>

          {plots.map(plot => (
            <Plot key={plot.id} {...plot} plotRefs={plotRefs} selectedId={selectedId} setSelectedId={setSelectedId} onResize={handleResize} />
          ))}

          <Transformer ref={trRef} />
        </Layer>
      </Stage>
    </div>
  )
}

export default App