import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages will be added in subsequent phases
const Home = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6">
    <h1 className="text-display-lg text-gradient mb-6">LUXE</h1>
    <p className="text-neutral-400 text-lg max-w-md text-center">
      Premium e-commerce platform. Design system loaded.
    </p>
  </div>
);

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
