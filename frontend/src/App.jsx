import { BrowserRouter, Routes, Route } from "react-router-dom";
import DesignSystem from "./pages/DesignSystem";
import Landing from "./pages/Landing";
import MapExplorer from "./pages/MapExplorer";
import Analytics from "./pages/Analytics";
import Simulation from "./pages/Simulation";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<MapExplorer />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/about" element={<About />} />
        <Route path="/design-system" element={<DesignSystem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
