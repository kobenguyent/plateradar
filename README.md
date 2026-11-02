# 🚗 PlateRadar

> **The Ultimate German & European License Plate Intelligence Platform**  
> *Check, decode, search, customize, and explore vehicle license plates with authentic FE-Schrift rendering and multi-country extensibility.*

[![Test Suite](https://img.shields.io/badge/Tests-42%20Passing-emerald)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://pages.github.com/)

---

## 🌟 Overview

**PlateRadar** is a modern, responsive web application engineered to parse, validate, and visually render vehicle registration plates (*Kraftfahrzeugkennzeichen*) of **Germany** with complete statutory fidelity under the *Fahrzeug-Zulassungsverordnung (FZV)* and *Straßenverkehrs-Zulassungs-Ordnung (StVZO)*.

Built from the ground up with a **modular multi-country architecture**, PlateRadar features full support for Germany (`DE`), Austria (`AT`), and Switzerland (`CH`), with an open plugin interface to easily extend coverage to all other European nations.

---

## ✨ Key Features

### 1. 🔍 Comprehensive German Plate Type Coverage
Covers every legal plate classification recognized in Germany:
* **Standard Euro Plates**: Blue Euroband with `D`, 12 stars, FE-Schrift typeface, and state/TÜV badges.
* **Electric Vehicles (`E-Kennzeichen`)**: Identifies battery (BEV), fuel-cell (FCEV), and plug-in hybrid (PHEV) exemptions under the *Electric Mobility Act (EmoG)* (bus lanes, free charging parking).
* **Historic Vehicles (`H-Kennzeichen`)**: Oldtimer vehicles at least 30 years old (§ 23 StVZO). Highlights permanent exemption from Low Emission Zones (*Umweltzone*).
* **Seasonal Plates (*Saisonkennzeichen*)**: Displays stacked operating months (e.g. `04/10`), pro-rated vehicle taxation, and off-season road restrictions.
* **Combined Plates**: Supports `E + Saison` and `H + Saison` combinations.
* **Short-Term Transfer Plates (*Kurzzeitkennzeichen*)**: Distinctive yellow date band on the right (valid for 5 days for vehicle transfers and test drives).
* **Export / Customs Plates (*Ausfuhrkennzeichen*)**: Distinctive red date band on the right for international transit.
* **Dealer & Collector Red Plates (*Rote Kennzeichen*)**: Red typography and border. `06` for dealerships and garages; `07` for vintage classic car collectors.
* **Tax-Exempt Green Plates (*Grüne Kennzeichen*)**: Green typography and border. Agricultural, forestry, and non-profit rescue trailers (§ 3 KraftStG).
* **Diplomatic Corps (*Diplomatenkennzeichen*)**:
  * Ambassador / Head of Mission: `0 [CountryCode]-1` (identifies over 80+ accredited foreign missions!).
  * Consular & Embassy staff: `B [CountryCode]-XXX` (Berlin) and `BN [CountryCode]-XXX` (Bonn).
* **Federal Authorities & Specialized Official Plates**:
  * **Bundeswehr**: `Y-XXXXXX` (German Armed Forces tricolor flag replaces EU strip).
  * **Federal Police (*Bundespolizei*)**: `BP XX-XXX`.
  * **Disaster Relief (*Technisches Hilfswerk*)**: `THW-XXXXX`.
  * **Federal Customs (*Bundeszollverwaltung*)**: `BWZ XX-XXX`.
  * **Supreme Constitutional Organs**: `0-1` (Federal President), `0-2` (Federal Chancellor), `0-3` (Foreign Minister), `0-4` (VP of Bundestag).
  * **State Police (*Landespolizei*)**: `NRW 4-XXXX`, `WI 4-XXXX`, `BW 1-XXXX`, `BY 4-XXXX`, etc.
* **Insurance Plates (*Versicherungskennzeichen*)**: Small 3-over-3 layout for mopeds, light quads, and e-scooters.
* **Pre-1995 Historical DIN Plates**: Grandfathered plates featuring the classic DIN 1451 font without EU strip.

### 2. 🛡️ Realistic Visual Plate Renderer
* **Authentic FE-Schrift Font**: Uses the genuine *Fälschungserschwerende Schrift* (forgery-hindering typeface) engineered to prevent illegal letter tampering.
* **Official State Seals (*Zulassungsplakette*)**: High-resolution vector coats of arms for all 16 German federal states, Austrian states, and Swiss cantons.
* **HU / TÜV Inspection Sticker**: Accurate 6-year cyclical color rotation (Green, Orange, Blue, Yellow, Brown, Pink) and angle rotation positioning the due month at 12 o'clock with the black arc indicator!
* **Aluminum Bevel & Embossing**: Stamped metal sheen, beveled rim, drop shadows, and optional screw caps.

### 3. 📂 400+ District Directory (Unterscheidungszeichen)
* Instant live search across all 400+ German district codes (from `A` for Augsburg to `ZZ` for Zeitz).
* Filterable by all 16 Federal States (*Bundesländer*).
* Highlights re-introduced historical district codes from the 2012 *Kennzeichenliberalisierung* (e.g. `WAN`, `CAS`, `MO`).
* One-click "Inspect" jump from directory into the live decoder.

### 4. 🎨 Plate Studio & Vector Exporter
* Custom-build any license plate configuration interactively.
* Tweak district, middle letters, digits, suffix, inspection year/month, and seasonal dates.
* One-click export to high-resolution vector **SVG**!

### 5. 🏆 Interactive Kennzeichen Quiz
* 10-question challenge testing your knowledge of German districts, diplomatic codes, legal exemptions, and plate history.
* Confetti celebration and score tracking.

### 6. 🚫 Prohibited Combination Detector
* Automatically flags combinations banned nationwide or state-wide under **§ 8 Abs. 1 FZV** (e.g. `HJ`, `KZ`, `NS`, `SA`, `SS`, `SD`, `AH 18`, `N-PD`).

### 7. 🌍 Multi-Country Extension Architecture
* Clean TypeScript adapter interface (`CountryAdapter`).
* **Germany (`DE`)**: Complete full-spectrum implementation.
* **Austria (`AT`)**: Standard, electric green lettering, federal police (`BP`), armed forces (`BH`), and state seals.
* **Switzerland (`CH`)**: 26 Cantons, Swiss national shield, and military plates (`M`).

---

## 🏗️ Project Architecture

```
plateradar/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions Pages deployment
├── public/
│   ├── badges/                 # Official state coats of arms (SVG)
│   │   ├── de/                 # All 16 German Bundesländer + Bundesadler
│   │   ├── at/                 # Austrian federal states
│   │   └── ch/                 # Swiss cantons
│   └── fonts/
│       ├── EuroPlate.ttf       # Authentic FE-Schrift font
│       └── AlteDIN1451.ttf     # Historical DIN 1451 font
├── src/
│   ├── __tests__/              # Vitest test suite (42 tests)
│   │   ├── parser-de.test.ts
│   │   ├── multi-country.test.ts
│   │   ├── districts.test.ts
│   │   └── tuev-colors.test.ts
│   ├── components/
│   │   ├── checker/            # Live plate decoder & analyzer
│   │   ├── districts/          # 400+ districts directory
│   │   ├── studio/             # Plate customizer & SVG generator
│   │   ├── quiz/               # Interactive gamified quiz
│   │   ├── knowledge/          # FZV statutory hub & regulations
│   │   ├── plate/              # Pixel-perfect PlateRenderer component
│   │   └── layout/             # Header, Navigation, Footer
│   ├── core/
│   │   ├── parser-de.ts        # German plate parser & validator
│   │   ├── parser-at.ts        # Austrian plate parser
│   │   ├── parser-ch.ts        # Swiss plate parser
│   │   └── country-registry.ts # Multi-country dispatcher
│   ├── data/
│   │   ├── districts-de.ts     # 400+ German districts
│   │   ├── districts-at.ts     # Austrian districts
│   │   ├── districts-ch.ts     # Swiss cantons
│   │   ├── diplomatic-codes-de.ts # Diplomatic mission codes (0 17-1, etc.)
│   │   ├── prohibited-combos-de.ts # § 8 FZV banned combinations
│   │   └── tuev-colors.ts      # 6-year TÜV color rotation
│   ├── types/
│   │   └── index.ts            # Core TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** v18+ (tested on Node v20/v26)
* **npm** v9+

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/plateradar.git
cd plateradar

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

PlateRadar includes a comprehensive unit and integration test suite powered by **Vitest**:

```bash
# Run test suite once
npm test

# Run tests in watch mode
npm run test:watch
```

**Test Coverage Highlights:**
* ✅ Standard, Electric, Historic, and Seasonal plate parsing
* ✅ Combined `E + Saison` and `H + Saison` permutations
* ✅ Short-term yellow (`04`) and export red date bands
* ✅ Highest federal officials (`0-1` to `0-4`)
* ✅ Diplomatic codes (`0 17-1`, `B 35-123`)
* ✅ Bundeswehr (`Y-`), Federal Police (`BP`), THW, Customs (`BWZ`), and State Police
* ✅ Prohibited combination detection under § 8 FZV
* ✅ 8-character maximum length validation
* ✅ Multi-country registry and adapters for Austria (`AT`) and Switzerland (`CH`)
* ✅ TÜV 6-year color rotation and month angular calculation

---

## 🌐 Deploying to GitHub Pages

PlateRadar is 100% static client-side and requires zero backend server:

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: initial commit of PlateRadar"
   git branch -M main
   git remote add origin https://github.com/<your-username>/plateradar.git
   git push -u origin main
   ```
2. In your GitHub repository:
   * Go to **Settings** > **Pages**.
   * Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push to `main` branch: The included `.github/workflows/deploy.yml` workflow will automatically run the test suite, build the static assets, and deploy to GitHub Pages!

---

## ⚖️ License & Credits

* Released under the [MIT License](LICENSE).
* Fonts: Open-source FE-Schrift (*EuroPlate*) and Alte DIN 1451.
* Badges: Public domain / official federal state coats of arms.
