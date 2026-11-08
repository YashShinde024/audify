# Getting Started

This guide provides step-by-step instructions for cloning, configuring, running, and verifying the Audify application on your local machine.

---

## 1. Prerequisites

Before setting up the project, ensure your environment meets the following requirements:

- **Node.js**: `v20.x` or `v22.x` (Active or Maintenance LTS recommended).
- **Package Manager**: `npm` (v9 or v10) included with Node.js.
- **Git**: Installed and accessible in your shell.
- **Modern Web Browser**: A Chromium-based browser (Chrome, Edge, Brave), Firefox, or Safari supporting the W3C Web Audio API (`AudioContext`, `OfflineAudioContext`, and `AudioBuffer`).

To verify your installed versions:
```bash
node -v
npm -v
git --version
```

---

## 2. Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/YashShinde024/audify.git
cd audify
```

### Step 2: Install Dependencies
```bash
npm install
```
This installs all required packages including Next.js 16, React 19, Tailwind CSS v4, Motion, Zustand v5, and Phosphor Icons.

### Step 3: Environment Configuration (Optional)
Audify runs 100% in-browser without requiring external API keys. If you want to customize the site URL or test contact dispatch:
```bash
# Copy the example environment template
cp .env.example .env.local
```
*(On Windows PowerShell: `Copy-Item .env.example .env.local`)*

Refer to [Configuration Reference](./configuration.md) for details on available variables.

---

## 3. Running Locally

### Development Server
Start the Next.js development server with Turbopack:
```bash
npm run dev
```

The development server will launch at:
```text
http://localhost:3000
```
Open this URL in your web browser. You should see the Audify landing page with real-time harmonic canvas visualization and the interactive Studio preview.

---

## 4. Verification & Testing

To confirm that your local environment is functioning correctly, run the full verification pipeline:

```bash
# 1. Typecheck the entire TypeScript codebase
npx tsc --noEmit

# 2. Run all unit & integration tests (23 test suites, 301 tests)
npm test

# 3. Run the audio mathematical & DSP verification script
npx tsx scripts/verify-audio.ts

# 4. Verify ESLint rules
npm run lint

# 5. Build the production bundle
npm run build
```

Expected output:
- `tsc`: Exits with code 0.
- `vitest`: `23 passed (23)`, `301 passed (301)`.
- `verify-audio`: All DSP mathematical assertions report `✅ PASSED`.
- `next build`: Successfully generates all application routes.

---

## 5. Production Preview

To test the optimized production build locally:
```bash
# 1. Compile the production build
npm run build

# 2. Start the production server
npm start
```
Navigate to `http://localhost:3000` to inspect the production runtime.

---

## 6. Common Issues & Troubleshooting

### Port Conflict (Port 3000 in use)
If port 3000 is occupied by another process, Next.js will automatically attempt port 3001, or you can specify a port explicitly:
```bash
npm run dev -- -p 3002
```

### Audio Not Playing (Browser Autoplay Policy)
Modern browsers require user interaction before an `AudioContext` can output sound. Tapping or clicking any transport button (Play, Scrubber, or Volume) resumes the AudioContext automatically.

### Mobile Device Testing on Local Network
To test Audify on a mobile phone on your local Wi-Fi:
```bash
npm run dev -- -H 0.0.0.0
```
Find your machine's local IP address (e.g. `192.168.1.50`) and navigate to `http://192.168.1.50:3000` on your mobile browser.
