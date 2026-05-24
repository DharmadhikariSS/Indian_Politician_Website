import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Lazy load page components for optimized bundle splitting
const Home = lazy(() => import('./pages/Home'));
const Browse = lazy(() => import('./pages/Browse'));
const PoliticianProfile = lazy(() => import('./pages/PoliticianProfile'));
const Compare = lazy(() => import('./pages/Compare'));
const Map = lazy(() => import('./pages/Map'));
const Rankings = lazy(() => import('./pages/Rankings'));
const Search = lazy(() => import('./pages/Search'));
const About = lazy(() => import('./pages/About'));
const Sources = lazy(() => import('./pages/Sources'));
const DemocracyMatch = lazy(() => import('./pages/DemocracyMatch'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div className="w-10 h-10 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin"></div>
    <span className="text-text-secondary font-mono text-xs tracking-widest uppercase animate-pulse">Loading Platform...</span>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<LoadingFallback />}>
              <Home />
            </Suspense>
          } />
          <Route path="browse" element={
            <Suspense fallback={<LoadingFallback />}>
              <Browse />
            </Suspense>
          } />
          <Route path="politician/:id" element={
            <Suspense fallback={<LoadingFallback />}>
              <PoliticianProfile />
            </Suspense>
          } />
          <Route path="compare" element={
            <Suspense fallback={<LoadingFallback />}>
              <Compare />
            </Suspense>
          } />
          <Route path="map" element={
            <Suspense fallback={<LoadingFallback />}>
              <Map />
            </Suspense>
          } />
          <Route path="rankings" element={
            <Suspense fallback={<LoadingFallback />}>
              <Rankings />
            </Suspense>
          } />
          <Route path="search" element={
            <Suspense fallback={<LoadingFallback />}>
              <Search />
            </Suspense>
          } />
          <Route path="about" element={
            <Suspense fallback={<LoadingFallback />}>
              <About />
            </Suspense>
          } />
          <Route path="sources" element={
            <Suspense fallback={<LoadingFallback />}>
              <Sources />
            </Suspense>
          } />
          <Route path="democracy-match" element={
            <Suspense fallback={<LoadingFallback />}>
              <DemocracyMatch />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
