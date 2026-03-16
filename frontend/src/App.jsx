import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import { LayerProvider } from "./context/LayerContext";
import PageSkeleton from "./components/common/PageSkeleton";

const DesignSystem = lazy(() => import("./pages/DesignSystem"));
const Landing = lazy(() => import("./pages/Landing"));
const MapExplorer = lazy(() => import("./pages/MapExplorer"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Simulation = lazy(() => import("./pages/Simulation"));
const About = lazy(() => import("./pages/About"));

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function AppLayout() {
  return (
    <LayerProvider>
      <div className="flex flex-col h-dvh overflow-hidden">
        <Navbar />
        <div className="flex flex-1 pt-16 overflow-hidden">
          
          <Sidebar className="hidden lg:flex w-72 border-r border-white/5 bg-base-950 shrink-0" />
          <main className="flex-1 relative bg-base-900 border-l border-white/5">
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </LayerProvider>
  );
}

function FocusLayout() {
  return (
    <LayerProvider>
      <div className="flex flex-col h-dvh overflow-hidden">
        <Navbar />
        <main className="flex-1 pt-16 relative bg-base-950">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </LayerProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
        </Route>

        
        <Route element={<AppLayout />}>
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/simulation" element={<Simulation />} />
        </Route>

        
        <Route element={<FocusLayout />}>
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        
        <Route path="/design-system" element={<DesignSystem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
