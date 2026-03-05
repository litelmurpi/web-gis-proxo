import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import { LayerProvider } from "./context/LayerContext";

import DesignSystem from "./pages/DesignSystem";
import Landing from "./pages/Landing";
import MapExplorer from "./pages/MapExplorer";
import Analytics from "./pages/Analytics";
import Simulation from "./pages/Simulation";
import About from "./pages/About";

/* Main Layout (Navbar + Footer) */
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/* App Layout (Navbar + Sidebar + No Footer) */
function AppLayout() {
  return (
    <LayerProvider>
      <div className="flex flex-col h-[100dvh] overflow-hidden">
        <Navbar />
        <div className="flex flex-1 pt-16 overflow-hidden">
          {/* Hide Sidebar on mobile/tablet, show on desktop */}
          <Sidebar className="hidden lg:flex w-72 border-r border-white/5 bg-base-950 shrink-0" />
          <main className="flex-1 relative bg-base-900 border-l border-white/5">
            <Outlet />
          </main>
        </div>
      </div>
    </LayerProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages with standard footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Dashboard/App pages with sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/simulation" element={<Simulation />} />
        </Route>

        {/* Standalone pages */}
        <Route path="/design-system" element={<DesignSystem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
