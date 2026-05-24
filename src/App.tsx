import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import PoliticianProfile from './pages/PoliticianProfile';
import Compare from './pages/Compare';
import Map from './pages/Map';
import Rankings from './pages/Rankings';
import Search from './pages/Search';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="politician/:id" element={<PoliticianProfile />} />
          <Route path="compare" element={<Compare />} />
          <Route path="map" element={<Map />} />
          <Route path="rankings" element={<Rankings />} />
          <Route path="search" element={<Search />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
