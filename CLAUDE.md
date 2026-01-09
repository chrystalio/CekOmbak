# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CekOmbak is a real-time maritime weather safety dashboard for Indonesian fishermen and maritime workers. It displays wave height, wind speed, wind direction, and weather status with visual safety indicators (Green/Yellow/Red) based on maritime safety thresholds.

## Tech Stack (Planned)

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Deployment**: Vercel (serverless functions + static hosting)
- **Data Source**: BMKG Maritime Public API (peta-maritim.bmkg.go.id)
- **State Management**: TanStack Query (useQuery for API lifecycle)
- **i18n**: i18next (Indonesian and English)
- **Storage**: localStorage (user preferences, favorite areas)

## Project Constraints

- **Zero Database**: All data fetched from BMKG API on-demand
- **Free Tier Only**: Must stay within Vercel free tier limits
- **Performance Target**: User can see wave height within 3 seconds
- **Mobile-First**: Designed for use at ports and on boats

## Development Workflow ⚠️ IMPORTANT

**This is a learning project.** The developer is learning React, TypeScript, and modern web development.

### Claude's Role: Guide, Don't Code

**DO:**
- ✅ Explain concepts clearly before implementation
- ✅ Provide step-by-step directions and hints
- ✅ Show examples and patterns to follow
- ✅ Review code written by the developer
- ✅ Explain WHY something works, not just HOW
- ✅ Ask questions to check understanding
- ✅ Suggest what to build next

**DON'T:**
- ❌ Write complete files/functions without being asked
- ❌ Auto-implement features without guidance first
- ❌ Skip explanations and jump straight to code
- ❌ Do all the work while the developer just watches

### Workflow Pattern

1. **Explain** the concept or feature
2. **Show** an example or pattern
3. **Guide** the developer to write the code themselves
4. **Review** and provide feedback
5. **Iterate** if needed

### Exception: Configuration Files

It's OK to directly create/modify configuration files (tailwind.config.js, package.json, etc.) since these are boilerplate and not learning-focused.

## Architecture

### Data Flow
1. **Primary Source**: BMKG Maritime Public API (https://peta-maritim.bmkg.go.id/public_api/perairan)
2. **Direct API Calls**: React app fetches data directly from BMKG API (no serverless proxy)
3. **Caching Layer**: TanStack Query handles caching, refetching, and request deduplication
4. **Client-side Persistence**: localStorage for "Favorite Area" to enable instant loading

**Note:** Using direct API calls for simplicity. BMKG API is public and allows CORS. A Vercel Serverless Function can be added later if needed for data filtering, caching, or if CORS becomes an issue.

### Folder Structure (Current)
```
/
├── src/
│   ├── components/      # UI components (cards, gauges, indicators)
│   ├── hooks/           # Custom React hooks (useMaritimeData, etc.)
│   ├── api/             # API client utilities (direct BMKG API calls)
│   ├── types/           # TypeScript type definitions
│   └── locales/         # i18n JSON resource files (id.json, en.json)
└── public/              # Static assets
```

**Optional for future:** `/api/` folder for Vercel Serverless Functions (if needed)

### Parameters Explanation
- **issued**: Publication or release time of the forecast by the station in UTC (format: YYYY-MM-DD hh:mm).
- **valid-from**: Start time of the forecast validity period in UTC (format: YYYY-MM-DD hh:mm).
- **valid-to**: End time of the forecast validity period in UTC (format: YYYY-MM-DD hh:mm).
- **time-desc**: Time description (Hari ini, Besok, H+2, H+3 (Today, Tomorrow, Day+2, Day+3)).
- **Weather**: (Cerah, Cerah Berawan, Berawan, Berawan Tebal, Asap, Kabut, Hujan Ringan, Hujan Sedang, Hujan Lebat, Hujan Lokal, Hujan Badai, (Clear, Mostly Clear, Cloudy, Overcast, Smoke, Fog, Light Rain, Moderate Rain, Heavy Rain, Localized Rain, Thunderstorms)).
- **weather-desc**: General weather description / Synoptic conditions.
- **warning_desc**: Early warning for severe weather.
- **station_remark**: Additional remarks from the station.
- **wave_cat**: Wave category: (Tenang, Rendah, Sedang, Tinggi, Sangat Tinggi, Ekstrem, Sangat Ekstrem (Calm, Low, Moderate, High, Very High, Extreme, Phenomenal/Very Extreme)).
- **wave_desc**: Average wave height range in meters.
- **wind_from**: Wind direction (From): North, North-Northeast, Northeast, East-Northeast, East, East-Southeast, Southeast, South-Southeast, South, South-Southwest, Southwest, West-Southwest, West, West-Northwest, Northwest, North-Northwest.
- **wind_to**: Wind direction (To): Utara ,Utara Timur Laut, Timur Laut, Timur Timur Laut, Timur, Timur Tenggara, Tenggara, Selatan Tenggara, Selatan, Selatan Barat Daya, Barat Daya, Barat Barat daya, Barat, Barat Barat Laut, Barat Laut, Utara Barat Laut. (North, North-Northeast, Northeast, East-Northeast, East, East-Southeast, Southeast, South-Southeast, South, South-Southwest, Southwest, West-Southwest, West, West-Northwest, Northwest, North-Northwest.)
- **wind_speed_min**: Minimum wind speed in knots.
- **wind_speed_max**: Maximum wind speed in knots.

### Area Code Reference
[BMKG Maritime Area Codes](wilayah_perairan.json)

### API Response Example
```json
// https://peta-maritim.bmkg.go.id/public_api/perairan/D.03_Perairan%20utara%20Kep.%20Anambas.json

{
  "code": "D.03",
  "name": "Perairan utara Kep. Anambas",
  "issued": "2026-01-08 23:34 UTC",
  "info": "Per 17 Februari 2025 layanan API ini sepenuhnya menggunakan data digital hasil pemodelan BMKG",
  "data": [
    {
      "valid_from": "2026-01-08 12:00 UTC",
      "valid_to": "2026-01-09 00:00 UTC",
      "time_desc": "Hari ini",
      "weather": "Berawan",
      "weather_desc": "Hari ini untuk Perairan utara Kep. Anambas diperkirakan berawan, dengan kecepatan angin pada umumnya 15 - 24 knot bertiup dari arah utara, tinggi gelombang laut berkisar 2.5 - 4.0 m",
      "warning_desc": "Waspada Gelombang Tinggi dan Angin Kencang",
      "station_remark": "Digital forecast by BMKG",
      "wave_cat": "Tinggi",
      "wave_desc": "2.5 - 4.0 m",
      "wind_from": "Utara",
      "wind_to": "Utara",
      "wind_speed_min": 15,
      "wind_speed_max": 24
    },
```

## Development Phases

### Phase 1: Foundation ✅ COMPLETED
- ✅ Initialize Vite + Tailwind project (Vite 7 + React 19 + TypeScript + SWC)
- ✅ Set up folder structure (components, hooks, api, locales)
- ✅ Integrate i18next with ID/EN locales (translation files created)
- ✅ Configure Tailwind CSS 4 with PostCSS
- ✅ Install TanStack Query for API state management
- ✅ Basic test UI to verify Tailwind is working

**Completed on:** 2026-01-09

### Phase 2: Data Integration 🚧 IN PROGRESS
- [ ] Create TypeScript types for BMKG API response
- [ ] Create API client utility for direct BMKG API calls
- [ ] Create custom hook with TanStack Query for API lifecycle (Loading → Success → Error)
- [ ] Update UI to display real maritime data from BMKG API

### Phase 3: UI/UX Polish
- [ ] Add "Safety Gauge" visual indicator for wave height
- [ ] Implement mobile-responsive layouts
- [ ] Add "Last Updated" timestamps
- [ ] Color-coded safety status indicators

### Phase 4: Launch & Optimization
- [ ] Deploy to Vercel production
- [ ] Run Lighthouse performance audit
- [ ] Handle edge cases (BMKG API downtime, network errors)

## Key Features

### Maritime Safety Indicators
Use clear, non-technical Indonesian terms:
- **Tenang** (Calm) - Green
- **Sedang** (Moderate) - Yellow
- **Sangat Tinggi** (Very High) - Red

### Area Selection
- Dropdown/search for maritime regions (Perairan Batam, Selat Singapura, Perairan Anambas)
- Optional: Auto-suggest nearest area based on GPS geolocation

### Data Display
- Current wave height
- Wind speed and direction
- Weather status
- Last updated timestamp

## Post-MVP Enhancements

- Integrate with https://www.mapcn.dev/ for geospatial data visualization
- Enhanced map-based area selection

## Important Notes

- No technical jargon in UI - use simple Indonesian terms
- Handle BMKG API failures gracefully with cached data or user-friendly error messages
- Optimize for slow mobile connections (common in maritime areas)
- Consider offline-first capabilities for reliability
