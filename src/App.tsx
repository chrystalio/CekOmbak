import { useState } from 'react';
import { useMaritimeData } from './hooks/useMaritimeData';
import { parseBMKGDate, formatToIndonesian } from './utils/dateUtils';

// Safety status mapper based on wave category
const getSafetyStatus = (waveCat: string) => {
  const category = waveCat.toLowerCase();

  // Safe: Calm and Low waves
  if (category.includes('tenang') || category.includes('rendah')) {
    return {
      color: 'safe',
      label: 'Aman',
      glowClass: 'glow-safe',
      ringColor: 'ring-safe/30',
      textColor: 'text-safe',
      bgColor: 'bg-safe/10',
    };
  }

  // Caution: Moderate waves only
  if (category.includes('sedang')) {
    return {
      color: 'caution',
      label: 'Waspada',
      glowClass: 'glow-caution',
      ringColor: 'ring-caution/30',
      textColor: 'text-caution',
      bgColor: 'bg-caution/10',
    };
  }

  // Danger: High, Very High, Extreme waves
  return {
    color: 'danger',
    label: 'Bahaya',
    glowClass: 'glow-danger',
    ringColor: 'ring-danger/30',
    textColor: 'text-danger',
    bgColor: 'bg-danger/10',
  };
};

// Convert wind direction to degrees
const windToDegrees = (direction: string): number => {
  const map: Record<string, number> = {
    'utara': 0, 'north': 0,
    'timur laut': 45, 'northeast': 45, 'utara timur laut': 22.5,
    'timur': 90, 'east': 90,
    'tenggara': 135, 'southeast': 135, 'timur tenggara': 112.5,
    'selatan': 180, 'south': 180,
    'barat daya': 225, 'southwest': 225, 'selatan barat daya': 202.5,
    'barat': 270, 'west': 270,
    'barat laut': 315, 'northwest': 315, 'utara barat laut': 337.5,
  };
  return map[direction.toLowerCase().trim()] || 0;
};

function App() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const { data, isLoading, isError, error } = useMaritimeData(
    'D.03',
    'Perairan utara Kep. Anambas'
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-ocean-deep ocean-grid flex items-center justify-center p-6">
        <div className="data-panel p-8 max-w-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 border-2 border-safe border-t-transparent animate-spin" />
            <div>
              <p className="text-slate-100 text-sm font-bold uppercase tracking-wider">Memuat Data</p>
              <p className="text-slate-500 text-xs font-mono mt-1">Mengambil data maritim...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-ocean-deep ocean-grid flex items-center justify-center p-6">
        <div className="data-panel p-8 max-w-md border-l-4 border-danger">
          <div className="flex items-start gap-4">
            <span className="text-danger text-3xl">✕</span>
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-2 uppercase tracking-tight">Gagal Memuat Data</h2>
              <p className="text-slate-400 text-sm font-mono">{error?.message || 'Terjadi kesalahan sistem'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TypeScript: data is guaranteed to be defined here after loading/error checks
  if (!data) return null;

  const currentForecast = data.data[selectedDayIndex];
  const status = getSafetyStatus(currentForecast.wave_cat);
  const windDeg = windToDegrees(currentForecast.wind_from);

  return (
    <div className="min-h-screen bg-ocean-deep ocean-grid">
      {/* Main Container */}
      <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-12">

        {/* Header */}
        <header className="mb-8 slide-in-1 border-l-2 border-slate-700 pl-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-1 tracking-tight font-mono">
                CekOmbak
              </h1>
              <p className="text-slate-400 text-sm md:text-base font-mono">
                {data.name}
              </p>
            </div>

            {/* Status Badge - Sharp Industrial */}
            <div className={`status-${status.color} px-4 py-3 flex items-center gap-2 font-bold text-sm uppercase tracking-wider font-mono`}>
              <span>
                {status.label}
              </span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mt-3 border-t border-slate-800 pt-2">
            <span className="text-slate-600">▸</span>
            <span>
              {formatToIndonesian(parseBMKGDate(data.issued))} WIB
            </span>
          </div>
        </header>

        {/* Day Selector - Industrial Segmented Control */}
        <div className="mb-8 slide-in-2">
          <div className="data-panel p-2">
            <div className="grid grid-cols-4 gap-1">
              {data.data.map((forecast, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`
                    relative px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider
                    transition-all duration-300 border border-slate-700
                    ${
                      selectedDayIndex === index
                        ? 'bg-cyan-500/20 text-cyan-100 border-cyan-500/50'
                        : 'bg-slate-900/30 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                    }
                  `}
                >
                  {/* Active Indicator Bar */}
                  {selectedDayIndex === index && (
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-400" />
                  )}

                  <div className="text-center">
                    <div className="text-[10px] opacity-70 mb-1">
                      {forecast.time_desc}
                    </div>
                    <div className="text-xs">
                      {forecast.wave_cat}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div key={selectedDayIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fade-in">

          {/* Wave Height Card - Featured */}
          <section className="data-panel p-6 md:p-8 md:col-span-2 slide-in-2">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
              <span className={`text-2xl ${status.textColor}`}>🌊</span>
              <h2 className="text-slate-100 font-bold text-xs uppercase tracking-widest">
                Kondisi Gelombang
              </h2>
            </div>

            {/* Data Display */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-5xl md:text-7xl font-bold text-slate-100 tracking-tight">
                {currentForecast.wave_desc}
              </span>
            </div>

            <div className={`inline-block status-${status.color} px-4 py-1 font-bold text-xs uppercase tracking-wider mb-4`}>
              {currentForecast.wave_cat}
            </div>

            {/* Warning Description */}
            {currentForecast.warning_desc && (
              <div className="warning-panel p-4 mt-4">
                <div className="flex items-start gap-3">
                  <span className="text-danger text-lg shrink-0 mt-0.5">⚠</span>
                  <div>
                    <div className="text-danger font-bold text-xs uppercase tracking-wider mb-1">Peringatan</div>
                    <p className="text-slate-200 text-sm leading-relaxed font-mono">
                      {currentForecast.warning_desc}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Weather Card */}
          <section className="data-panel p-6 md:col-span-2 slide-in-4">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <span className="text-2xl text-slate-400">☁</span>
              <h2 className="text-slate-100 font-bold text-xs uppercase tracking-widest">
                Kondisi Cuaca
              </h2>
            </div>

            <div className="text-2xl font-bold text-slate-100 mb-4 font-mono">
              {currentForecast.weather}
            </div>

            {currentForecast.weather_desc && (
              <div className="border-l-2 border-slate-700 pl-4 py-2">
                <p className="text-slate-400 text-sm leading-relaxed">
                  {currentForecast.weather_desc}
                </p>
              </div>
            )}
          </section>

          {/* Wind Speed Card */}
          <section className="data-panel p-6 slide-in-3">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
              <span className="text-2xl text-cyan-400">→</span>
              <h2 className="text-slate-100 font-bold text-xs uppercase tracking-widest">
                Kecepatan Angin
              </h2>
            </div>

            {/* Split Display: Min/Max Readout */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* MIN Speed */}
              <div className="border border-slate-700 bg-slate-900/30 p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/30" />
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">
                  Minimum
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-slate-300 tracking-tight">
                    {currentForecast.wind_speed_min}
                  </span>
                  <span className="text-slate-500 text-xs font-bold uppercase">kt</span>
                </div>
              </div>

              {/* MAX Speed */}
              <div className="border border-slate-700 bg-slate-900/30 p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">
                  Maximum
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-cyan-100 tracking-tight">
                    {currentForecast.wind_speed_max}
                  </span>
                  <span className="text-cyan-400 text-xs font-bold uppercase">kt</span>
                </div>
              </div>
            </div>
          </section>

          {/* Wind Direction Card */}
          <section className="data-panel p-6 slide-in-4">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
              <span className="text-2xl text-cyan-400">🧭</span>
              <h2 className="text-slate-100 font-bold text-xs uppercase tracking-widest">
                Arah Angin
              </h2>
            </div>

            <div className="flex items-center gap-6">
              {/* Simple Directional Arrow */}
              <div
                className="relative w-20 h-20 shrink-0 transition-transform duration-700 ease-out border-2 border-slate-700 flex items-center justify-center"
                style={{ transform: `rotate(${windDeg}deg)` }}
              >
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <path
                    d="M 40 10 L 40 50 M 40 10 L 30 20 M 40 10 L 50 20"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    fill="none"
                  />
                  <circle cx="40" cy="60" r="3" fill="#10B981" />
                </svg>
              </div>

              {/* Direction Info */}
              <div className="flex-1">
                <div className="text-2xl font-bold text-slate-100 mb-2 uppercase tracking-tight font-mono">
                  {currentForecast.wind_from}
                </div>
                <div className="text-slate-500 text-sm font-mono border-l-2 border-slate-700 pl-3">
                  {windDeg}° N
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer - Maritime Control Panel Style */}
        <footer className="mt-20 relative">
          {/* Top Technical Separator */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-700" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-700" />

          <div className="pt-12 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              {/* Data Source Panel */}
              <div className="data-panel p-5 group hover:border-l-safe transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-safe animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-bold mb-2 font-mono">
                      Data Source
                    </div>
                    <a
                      href="https://peta-maritim.bmkg.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 text-sm font-mono hover:text-safe transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>BMKG Peta Maritim</span>
                      <span className="text-slate-600 group-hover:text-safe transition-colors">↗</span>
                    </a>
                    <div className="text-slate-600 text-xs font-mono mt-1">
                      Official Maritime Forecast
                    </div>
                  </div>
                </div>
              </div>

              {/* System Info Panel */}
              <div className="data-panel p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-cyan-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-bold mb-2 font-mono">
                      System Status
                    </div>
                    <div className="text-slate-300 text-sm font-mono">
                      v1.0.0 • ONLINE
                    </div>
                    <div className="text-slate-600 text-xs font-mono mt-1">
                      Real-time Maritime Monitor
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer Panel */}
              <div className="data-panel p-5 group hover:border-l-cyan-500 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-slate-600 group-hover:bg-cyan-500 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-bold mb-2 font-mono">
                      Developed By
                    </div>
                    <a
                      href="https://github.com/chrystalio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 text-sm font-mono hover:text-cyan-500 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>Kristoff</span>
                      <span className="text-slate-600 group-hover:text-cyan-500 transition-colors">↗</span>
                    </a>
                    <div className="text-slate-600 text-xs font-mono mt-1">
                      Made with ☕ & curiosity
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Technical Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1.5 font-mono text-[10px] text-slate-600">
                  <span className="text-slate-700">▸</span>
                  <span>CekOmbak</span>
                  <span className="text-slate-300">/</span>
                  <span>{new Date().getFullYear()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-600">
                <span className="hidden sm:inline">COORDINATES</span>
                <span className="text-slate-500">1°N 104°E</span>
                <div className="w-1.5 h-1.5 bg-slate-700 ml-2" />
              </div>
            </div>
          </div>

          {/* Bottom Corner Accents */}
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-800" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-800" />
        </footer>
      </div>
    </div>
  );
}

export default App;
