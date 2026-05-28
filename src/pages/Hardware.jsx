import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Hardware() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [network4G, setNetwork4G] = useState(true);
  const [networkLora, setNetworkLora] = useState(true);

  return (
    <div className="bg-surface text-on-surface font-body-lg min-h-screen pb-24 md:pb-0">
      {/* TopAppBar Premium */}
      <header className="fixed top-0 w-full z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/15 shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          </div>
          <span className="text-headline-md font-headline-md font-bold text-primary">Aluna IA</span>
          <span className="hidden sm:inline-block bg-primary/10 text-primary text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Gaira Conectada</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg duration-150 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">waves</span> Estación Gaira
          </Link>
          <Link to="/chat" className="text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg duration-150 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">assistant</span> Aluna Chat
          </Link>
          <Link to="/hardware" className="text-primary font-bold hover:bg-surface-container-high/40 transition-colors px-3 py-2 rounded-lg duration-150 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">map</span> Hardware
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-primary">
          <span className="hidden sm:inline-block bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-label-caps font-semibold">
            Firebase: Mock Activo
          </span>
        </div>
      </header>
      
      <main className="pt-24 px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto space-y-stack-lg">
        {/* Header Section */}
        <div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface">Hardware Control Panel</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant mt-2">Station ID: GAIRA-01</p>
        </div>
        
        {/* Environmental Protection */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="px-gutter py-4 border-b border-outline-variant/20 bg-surface-container-low/50">
            <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Environmental Protection</h2>
          </div>
          <div className="divide-y divide-outline-variant/20">
            <div className="flex items-center justify-between p-gutter">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div>
                  <p className="text-body-lg font-body-lg font-semibold text-on-surface">Waterproofing</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">IP68 SEALED</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span className="text-body-sm font-body-sm text-success font-semibold">OK</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-gutter">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">layers</span>
                </div>
                <div>
                  <p className="text-body-lg font-body-lg font-semibold text-on-surface">Conformal Coating</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Active Protection</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span className="text-body-sm font-body-sm text-success font-semibold">ACTIVE</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-gutter">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">air</span>
                </div>
                <div>
                  <p className="text-body-lg font-body-lg font-semibold text-on-surface">Humidity Control</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Silica Gel 15%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span className="text-body-sm font-body-sm text-success font-semibold">OK</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Connectivity */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="px-gutter py-4 border-b border-outline-variant/20 bg-surface-container-low/50">
            <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Connectivity</h2>
          </div>
          <div className="divide-y divide-outline-variant/20">
            <div className="flex items-center justify-between p-gutter">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">cell_tower</span>
                </div>
                <div>
                  <p className="text-body-lg font-body-lg font-semibold text-on-surface">Primary Network</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">4G/LTE Enabled</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="toggle-4g" 
                  checked={network4G}
                  onChange={() => setNetwork4G(!network4G)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-outline outline-none checked:right-0 checked:border-success transition-all duration-300" 
                />
                <label htmlFor="toggle-4g" className="toggle-label block overflow-hidden h-6 rounded-full bg-outline-variant cursor-pointer transition-all duration-300" style={{ backgroundColor: network4G ? '#16a34a' : '' }}></label>
              </div>
            </div>
            <div className="flex items-center justify-between p-gutter">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">wifi_tethering</span>
                </div>
                <div>
                  <p className="text-body-lg font-body-lg font-semibold text-on-surface">Secondary Network</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">LoRaWAN Standby</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="toggle-lora" 
                  checked={networkLora}
                  onChange={() => setNetworkLora(!networkLora)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-outline outline-none checked:right-0 checked:border-success transition-all duration-300" 
                />
                <label htmlFor="toggle-lora" className="toggle-label block overflow-hidden h-6 rounded-full bg-outline-variant cursor-pointer transition-all duration-300" style={{ backgroundColor: networkLora ? '#16a34a' : '' }}></label>
              </div>
            </div>
          </div>
        </section>
        
        {/* Power Management */}
        <section className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 shadow-sm overflow-hidden mb-8">
          <div className="px-gutter py-4 border-b border-outline-variant/20 bg-surface-container-low/50">
            <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Power Systems</h2>
          </div>
          <div className="divide-y divide-outline-variant/20">
            <div className="flex items-center justify-between p-gutter">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">solar_power</span>
                </div>
                <div>
                  <p className="text-body-lg font-body-lg font-semibold text-on-surface">Solar Panel Array</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Generating 14.2V</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success">bolt</span>
                <span className="text-body-sm font-body-sm text-success font-semibold">CHARGING</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-gutter">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">battery_5_bar</span>
                </div>
                <div>
                  <p className="text-body-lg font-body-lg font-semibold text-on-surface">Internal Battery</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Cycle 42/500</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-body-lg font-body-lg font-semibold text-on-surface">94%</p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Health Good</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* BottomNavBar (Móvil Únicamente) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 flex justify-around items-center h-16 bg-surface/85 backdrop-blur-xl border-t border-outline-variant/15 shadow-lg pb-safe">
        <Link to="/dashboard" className="flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">waves</span>
          <span className="text-[10px] uppercase font-bold mt-1">Estación</span>
        </Link>
        <Link to="/chat" className="flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">assistant</span>
          <span className="text-[10px] uppercase font-bold mt-1">Chatbot</span>
        </Link>
        <Link to="/hardware" className="flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 text-primary font-bold">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
          <span className="text-[10px] uppercase font-bold mt-1">Hardware</span>
        </Link>
      </nav>
    </div>
  );
}
