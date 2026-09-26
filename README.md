# 🐖 PorciWeight - Mobile Swine Weight & Growth Estimator
> **Estimador Móvil de Peso y Tiempos de Crecimiento Porcino**
> Bilingual (English / Español) AI-assisted computer vision and biometrics mobile application for livestock farmers, agronomists, and veterinarians.

[![Language](https://img.shields.io/badge/Language-English%20%7C%20Espa%C3%B1ol-emerald.svg)](#features)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Mobile%20PWA%20%7C%20Web-purple.svg)](#running-locally)

---

## 🌟 Key Features

1. **Instant Pig Photo Analysis & Capture**:
   - 📸 **Take Photo directly with device camera** (uses `capture="environment"` for mobile cameras).
   - 📁 **Upload Photo** from phone gallery or desktop.
   - 📹 **Live Camera Viewfinder** with lateral swine alignment grid.
   - 🐷 **Built-in Sample Pigs**: 1-tap presets for Weaner (18 kg), Grower (52 kg), Market Finisher (108 kg), and Sow (215 kg).

2. **Computer Vision & Interactive Biometric Canvas**:
   - Automated swine silhouette recognition.
   - Dynamic landmark pins on image: **Snout**, **Withers / Shoulder**, **Backline**, **Rump / Tail Base**, and **Heart Girth Band**.
   - Draggable pins for direct manual refinement over the pig image.

3. **Livestock Biometric Calculations (FAO & Iowa State Swine Extension)**:
   - Live Weight calculation in both **Kilograms (kg)** and **Pounds (lbs)**.
   - $95\%$ Confidence Interval ($\pm 3.8\%$).
   - Estimated Carcass Dressing Weight ($74.5\%$ commercial yield).
   - Body Condition Score (BCS 1 to 5) modifier.
   - Breed adjustments: Commercial White (Yorkshire/Landrace), Duroc, Pietrain, Berkshire, Iberian, Potbellied.

4. **Comprehensive Swine Time Estimates & Growth Trajectory**:
   - ⏳ **Estimated Pig Age**: Calculates chronological age in weeks and days using the swine Gompertz biological growth equation:
     $$W(t) = W_{\max} \cdot \exp(-\exp(-k(t - t_0)))$$
   - 📅 **Days to Market Weight**: Calculates exact days and weeks remaining until commercial slaughter weight (default $115\text{ kg} / 253\text{ lbs}$).
   - 🎯 **Projected Ready Date**: Projects target calendar slaughter/market date.
   - 📈 **Average Daily Gain (ADG)**: Dynamic daily gain rate based on growth stage ($0.35$ to $0.92\text{ kg/day}$).
   - 🌾 **Remaining Feed Needed**: Projects total kilograms/pounds of feed required to reach market weight using Feed Conversion Ratio (FCR).
   - 📊 **Market Readiness Progress Bar**: Visual percentage towards target slaughter weight.

5. **Full Bilingual Support (English 🇺🇸 / Español 🇪🇸)**:
   - One-tap instant toggle in the top bar.
   - $100\%$ translated UI, tooltips, biometric parameters, growth stages, veterinary advice, and export reports.

6. **Farm Log & Report Export**:
   - Saves scans in local storage.
   - Export printable report as text/data file.

---

## ⏱️ Time Estimates Summary

### 1. Biological Swine Growth Time Estimates
| Growth Phase | Typical Weight | Typical Age | Expected ADG (Gain/day) | Feed Conversion (FCR) |
|---|---|---|---|---|
| **Piglet / Lechón** | $1.5 - 10\text{ kg}$ | $0 - 4\text{ wks}$ | $0.35\text{ kg/day}$ ($0.77\text{ lb/d}$) | $1.3 : 1$ |
| **Nursery / Destetado** | $10 - 28\text{ kg}$ | $4 - 10\text{ wks}$ | $0.55\text{ kg/day}$ ($1.21\text{ lb/d}$) | $1.8 : 1$ |
| **Grower / Crecimiento** | $28 - 65\text{ kg}$ | $10 - 16\text{ wks}$ | $0.78\text{ kg/day}$ ($1.72\text{ lb/d}$) | $2.4 : 1$ |
| **Finisher / Cebo** | $65 - 110\text{ kg}$ | $16 - 22\text{ wks}$ | $0.92\text{ kg/day}$ ($2.03\text{ lb/d}$) | $2.9 : 1$ |
| **Market Ready / Faena** | $110 - 130\text{ kg}$ | $22 - 26\text{ wks}$ | $0.85\text{ kg/day}$ ($1.87\text{ lb/d}$) | $3.2 : 1$ |

### 2. Software Development & Execution Time Estimates
- **Environment & Toolchain Setup**: ~45 seconds
- **Biometric Core & i18n Translation Engine**: ~60 seconds
- **Computer Vision Canvas & Mobile UI**: ~60 seconds
- **Local Server Execution & Testing**: ~10 seconds
- **Total Delivery Time**: ~2.5 to 3 minutes

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)

### Quick Start
```bash
# 1. Clone or enter the project directory
cd pig-weight-estimator

# 2. Start the local server
node server.js
# or: npm start
```

Once started:
- Open your computer browser at: **`http://localhost:3000`**
- To test on your mobile phone on the same Wi-Fi, open the displayed network IP address: **`http://<YOUR-IP>:3000`**

---

## 📱 Mobile Installation (PWA)
1. Open the URL in Safari (iOS) or Chrome (Android).
2. Tap **Share** -> **"Add to Home Screen"** (**"Agregar a Inicio"**).
3. The app will launch in full-screen native mobile mode with camera access!

---

## 🛠️ Project Structure
```
pig-weight-estimator/
├── package.json          # Project configuration & npm scripts
├── server.js             # Zero-dependency HTTP static server with network IP discovery
├── public/
│   ├── index.html        # Responsive mobile app interface with mobile frame simulator
│   ├── manifest.json     # Progressive Web App manifest
│   ├── css/
│   │   └── app.css       # Custom styles, range sliders, and animations
│   ├── js/
│   │   ├── i18n.js       # Complete English & Spanish translation dictionaries
│   │   ├── estimator.js  # Swine morphometrics, Gompertz growth curve, and time estimates
│   │   ├── vision.js     # HTML5 Canvas computer vision and landmark pins
│   │   └── app.js        # Event orchestrator, camera handler, and farm history
│   └── assets/
│       └── samples/      # Preset sample pig illustrations (Weaner, Grower, Finisher, Sow)
└── README.md             # Project documentation
```

---

## 📄 License
MIT License. Open-source for farmers, developers, and researchers worldwide.
