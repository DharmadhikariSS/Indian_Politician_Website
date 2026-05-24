// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Map as MapIcon, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Scale, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  Activity,
  Locate,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { usePoliticians } from '../hooks/usePoliticians';
import type { DetailedPoliticianData } from '../data/politicians';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';

// Geolocation coordinate mapping for representative constituencies
const politicianCoordinates: Record<string, [number, number]> = {
  '1': [25.5876, 83.5783], // Ghazipur Sadar, UP
  '2': [12.9716, 77.5946], // Bangalore Central, KA
  '3': [18.5204, 73.8567], // Pune, MH
  '4': [21.1702, 72.8311], // Surat, GJ
  '5': [9.9252, 78.1198],  // Madurai, TN
  '6': [25.1193, 85.3853], // Nalanda, BR
  '7': [28.5823, 77.0500], // Dwarka, DL
  '8': [22.5350, 88.3470], // Bhabanipur, WB
  '9': [11.6854, 76.1320], // Wayanad, KL
  '10': [19.0760, 72.8777], // Mumbai, MH
  'scraped-1': [25.3176, 82.9739], // Varanasi, UP (Narendra Modi)
  'scraped-2': [21.1458, 79.0882], // Nagpur, MH (Devendra Fadnavis)
  'scraped-3': [12.5218, 77.4222], // Kanakapura, KA (D.K. Shivakumar)
  'scraped-4': [28.6129, 77.2295], // New Delhi, DL (Arvind Kejriwal)
  'scraped-5': [13.1146, 80.2185]  // Kolathur, TN (M.K. Stalin)
};

// Regional state center coordinates for panning
const stateCenters: Record<string, { coords: [number, number]; zoom: number }> = {
  'India': { coords: [20.5937, 78.9629], zoom: 5 },
  'Uttar Pradesh': { coords: [26.8467, 80.9462], zoom: 7 },
  'Karnataka': { coords: [15.3173, 75.7139], zoom: 7 },
  'Maharashtra': { coords: [19.7515, 75.7139], zoom: 7 },
  'Gujarat': { coords: [22.2587, 71.1924], zoom: 7 },
  'Tamil Nadu': { coords: [11.1271, 78.6569], zoom: 7 },
  'Bihar': { coords: [25.0961, 85.3131], zoom: 8 },
  'Delhi': { coords: [28.6139, 77.2090], zoom: 10 },
  'West Bengal': { coords: [22.9868, 87.8550], zoom: 7 },
  'Kerala': { coords: [10.8505, 76.2711], zoom: 8 }
};

// Custom component to dynamically pan Leaflet viewport
interface ChangeViewProps {
  center: [number, number];
  zoom: number;
}

const ChangeView = ({ center, zoom }: ChangeViewProps) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

const Map = () => {
  const { data: politicians = [], isLoading } = usePoliticians();
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [selectedState, setSelectedState] = useState('India');
  const [activePinId, setActivePinId] = useState<string | null>(null);

  // Group politicians that have coordinates defined (supporting both mock and scraped ID patterns)
  const mappedPoliticians = useMemo(() => {
    return politicians.filter(p => {
      const coordKey = p.id.replace('scraped-', '');
      return politicianCoordinates[coordKey] || politicianCoordinates[p.id];
    });
  }, [politicians]);

  // Breakdown metrics for the sidebar
  const stateAggregates = useMemo(() => {
    const states = Array.from(new Set(mappedPoliticians.map(p => p.state)));
    return states.map(state => {
      const statePeople = mappedPoliticians.filter(p => p.state === state);
      const avgScore = statePeople.length > 0
        ? Math.round(statePeople.reduce((sum, p) => sum + p.aiScore, 0) / statePeople.length)
        : 0;
      const riskyCount = statePeople.filter(p => p.aiScore <= 40).length;
      
      return {
        stateName: state,
        avgScore,
        riskyCount,
        totalPins: statePeople.length
      };
    }).sort((a, b) => b.riskyCount - a.riskyCount);
  }, [mappedPoliticians]);

  const kpis = useMemo(() => {
    const risky = mappedPoliticians.filter(p => p.aiScore <= 40).length;
    const caution = mappedPoliticians.filter(p => p.aiScore > 40 && p.aiScore <= 70).length;
    const clean = mappedPoliticians.filter(p => p.aiScore > 70).length;
    return { risky, caution, clean };
  }, [mappedPoliticians]);

  // Handle clicking a state in the sidebar to pan the map
  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    const target = stateCenters[stateName];
    if (target) {
      setMapCenter(target.coords);
      setMapZoom(target.zoom);
    }
  };

  // Custom divIcon marker creator representing glows and colors based on AI Integrity
  const createCustomIcon = (score: number, isActive: boolean) => {
    const color = score <= 40 ? '#E53E3E' : score <= 70 ? '#ED8936' : '#38A169';
    const shadowColor = score <= 40 ? 'rgba(229, 62, 62, 0.4)' : score <= 70 ? 'rgba(237, 137, 54, 0.4)' : 'rgba(56, 161, 105, 0.4)';
    const border = isActive ? '3px solid #D4A017' : '2px solid #E6EDF3';
    const scale = isActive ? 'scale(1.2)' : 'scale(1)';
    const zIndex = isActive ? '1000' : '1';

    return L.divIcon({
      className: 'custom-leaflet-marker-wrapper',
      html: `<div style="
        width: 26px; 
        height: 26px; 
        background-color: ${color}; 
        border: ${border}; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        color: #0D1117;
        font-size: 10px;
        font-family: 'Space Mono', monospace;
        font-weight: bold;
        box-shadow: 0 0 12px ${shadowColor};
        transform: ${scale};
        z-index: ${zIndex};
        transition: all 0.2s ease-in-out;
      ">${score}</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-bg-primary">
        {/* Telemetry Header */}
        <div className="bg-bg-secondary border-b border-border-subtle p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-text-primary flex items-center gap-2">
              <MapIcon size={22} className="text-accent-gold" />
              ELECTORAL GEOGRAPHIC ACCOUNTABILITY VIEW
            </h1>
            <p className="text-xs text-text-secondary">
              Interactive constituency mapping displaying telemetry integrity alerts and regional transparency heat levels.
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold mx-auto"></div>
          <h3 className="font-heading text-lg font-bold text-text-secondary uppercase">RETRIEVING GEOGRAPHICAL ALIGNMENTS...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Telemetry Header */}
      <div className="bg-bg-secondary border-b border-border-subtle p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-text-primary flex items-center gap-2">
            <MapIcon size={22} className="text-accent-gold" />
            ELECTORAL GEOGRAPHIC ACCOUNTABILITY VIEW
          </h1>
          <p className="text-xs text-text-secondary">
            Interactive constituency mapping displaying telemetry integrity alerts and regional transparency heat levels.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 bg-bg-card border border-border-subtle px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-danger-red"></span>
            <span className="text-text-secondary uppercase">RISK (0-40):</span>
            <strong className="text-text-primary">{kpis.risky}</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-bg-card border border-border-subtle px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-warning-amber"></span>
            <span className="text-text-secondary uppercase">CAUTION (41-70):</span>
            <strong className="text-text-primary">{kpis.caution}</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-bg-card border border-border-subtle px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-success-green"></span>
            <span className="text-text-secondary uppercase">CLEAN (71-100):</span>
            <strong className="text-text-primary">{kpis.clean}</strong>
          </div>
        </div>
      </div>

      {/* Main Map workspace split */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar (Telemetry aggregates & controls) */}
        <aside className="w-80 bg-bg-secondary border-r border-border-subtle overflow-y-auto hidden lg:block p-5 space-y-6 shrink-0">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-xs uppercase tracking-wider text-text-secondary font-bold flex items-center gap-2 font-mono">
              <Activity size={14} className="text-accent-gold animate-pulse" /> REGIONAL HEAT RADAR
            </h2>
            <button 
              onClick={() => handleStateClick('India')}
              className="text-[10px] text-accent-gold hover:text-text-primary flex items-center gap-1 font-mono font-bold"
            >
              <Locate size={10} /> RESET MAP
            </button>
          </div>

          {/* Regional summaries list */}
          <div className="space-y-3">
            <h3 className="text-xs text-text-secondary font-bold uppercase tracking-wider font-sans">State-wise Indexes</h3>
            <div className="space-y-2">
              {stateAggregates.map(agg => (
                <div
                  key={agg.stateName}
                  onClick={() => handleStateClick(agg.stateName)}
                  className={`border rounded-xl p-3.5 cursor-pointer transition-all hover:bg-bg-card/90 ${
                    selectedState === agg.stateName 
                      ? 'border-accent-gold bg-bg-card' 
                      : 'border-border-subtle bg-bg-card/45 hover:border-text-secondary'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-heading text-sm font-bold text-text-primary">{agg.stateName}</h4>
                    <span className="font-mono text-[10px] bg-bg-secondary border border-border-subtle px-1.5 py-0.5 rounded text-text-primary">
                      {agg.totalPins} Indexed
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 border-t border-border-subtle/50 pt-2 font-mono text-[10px] text-text-secondary">
                    <div>
                      AVG AI SCORE: <strong className="text-text-primary">{agg.avgScore}</strong>
                    </div>
                    <div className="text-right">
                      CRIT RISK: <strong className={agg.riskyCount > 0 ? 'text-danger-red font-bold' : 'text-success-green'}>{agg.riskyCount}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Map Container Panel */}
        <main className="flex-1 bg-bg-primary relative h-full">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ width: '100%', height: '100%', background: '#0D1117' }}
            zoomControl={false}
          >
            {/* Tile Layer styling (Highly stylized Dark-themed Map from CartoDB) */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
            />

            {/* Custom change view dynamic updates */}
            <ChangeView center={mapCenter} zoom={mapZoom} />

            {/* Place Markers pins for each mapped politician */}
            {mappedPoliticians.map(p => {
              const coordKey = p.id.replace('scraped-', '');
              const coords = politicianCoordinates[coordKey] || politicianCoordinates[p.id];
              const isActive = activePinId === p.id;
              
              return (
                <Marker 
                  key={p.id}
                  position={coords}
                  icon={createCustomIcon(p.aiScore, isActive)}
                  eventHandlers={{
                    click: () => setActivePinId(p.id)
                  }}
                >
                  {/* Detailed Interactive Popup Info Panel */}
                  <Popup 
                    closeButton={false}
                    className="custom-leaflet-popup"
                  >
                    <div className="bg-bg-card border border-border-subtle rounded-xl p-3.5 shadow-2xl w-60 text-text-primary flex flex-col gap-2.5 font-sans relative">
                      <div className="flex gap-2.5 items-center">
                        <div className="w-11 h-11 rounded bg-bg-secondary border border-border-subtle overflow-hidden shrink-0">
                          <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8px] bg-info-blue/15 text-info-blue border border-info-blue/30 px-1.5 py-0.5 rounded font-bold font-mono">
                            {p.party}
                          </span>
                          <h4 className="font-heading text-sm font-bold text-text-primary truncate mt-1">{p.name}</h4>
                          <p className="text-[10px] text-text-secondary truncate">{p.role} • {p.state}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-border-subtle/50 pt-2 font-mono text-[9px] text-text-secondary">
                        <div>
                          NET WORTH: <strong className="text-text-primary">₹{p.netWorth}</strong>
                        </div>
                        <div>
                          CRIM CASES: <strong className={p.criminalCases > 0 ? 'text-danger-red font-bold' : 'text-success-green'}>{p.criminalCases}</strong>
                        </div>
                      </div>

                      <Link 
                        to={`/politician/${p.id}`}
                        className="block mt-1 border-t border-border-subtle/50 pt-2.5"
                      >
                        <button className="w-full bg-accent-gold text-bg-primary hover:bg-accent-gold/80 font-bold font-mono text-[10px] py-1.5 rounded transition-colors flex items-center justify-center gap-1 shadow-sm">
                          INSPECT FULL PROFILE <ExternalLink size={10} />
                        </button>
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </main>

      </div>
    </div>
  );
};

export default Map;
