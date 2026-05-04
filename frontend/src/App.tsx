import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GardenEditor from './pages/GardenEditor';

function App() {
  return (
    <Router>
      <div className="w-full max-w-[1126px] mx-auto text-center border-x border-border-main min-h-svh flex flex-col box-border bg-bg-main text-text-main">
        <Routes>
          <Route path="/" element={<GardenEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;