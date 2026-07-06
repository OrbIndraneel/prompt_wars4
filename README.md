# StadiumCompanion AI: FIFA World Cup 2026

## 1. Chosen Vertical
**Smart Stadium Operations & Venue Management**

## 2. Approach and Logic
StadiumCompanion AI is a GenAI-enabled operational intelligence dashboard designed for stadium staff, security, and venue managers during the FIFA World Cup 2026. The solution focuses on providing real-time oversight of crowd density, staff deployment, and active incidents. 

The core logic relies on:
- **Mock Data Engine**: A simulated real-time data feed representing stadium congestion metrics (e.g., North Gate density, VIP Lounge capacity) updating every few seconds to emulate live IoT sensor data.
- **Dynamic Thresholding**: Visual alert states (Normal, Warning, Critical) are logically calculated on the fly based on the density percentage, instantly altering the UI (via a premium Neumorphism design system) to grab the operator's attention.
- **Generative AI Integration**: Google's Gemini API is integrated as an "Ops Assistant AI". When staff encounter critical alerts, they can prompt the AI for strategic routing, staff reassignment, or emergency evacuation plans based on the live context of the stadium.

## 3. How the Solution Works
- **Overview Dashboard**: Displays high-level metrics (Total Attendance, Active Staff, Incidents) and a live feed of congestion in different stadium zones.
- **Visual Alert System**: Zones surpassing specific density thresholds turn yellow (Warning) or red (Critical), with animated progress bars reflecting the severity.
- **Ops Assistant Chatbox**: An interactive natural language interface where operators can type commands (e.g., "North Gate is congested"). The system intercepts this and uses the GenAI layer to process the contextual data and recommend actionable operations.
- **Additional Modules**: 
  - **Zone Maps**: Interactive spatial layout mapping (Placeholder).
  - **Staff Deployment**: Tracks security, medical, and cleaning crews, their active locations, and status (Active/Standby).
  - **Incidents Feed**: A categorized timeline of active alerts and reports prioritizing severe incidents.

## 4. Assumptions Made
- **Live Data Feed Accessibility**: We assume that during the actual event, IoT sensors, turnstile counters, and CCTV crowd analytics will provide the real-time density JSON payload that our current mock engine simulates.
- **AI Response Latency**: We assume the operational internet backbone of the stadium will provide low-latency access to the GenAI API (simulated via a 1.5s timeout in the mock).
- **Staff Devices**: The dashboard is designed to be responsive, assuming staff will access it via central command center desktop screens or robust tablet devices while on the move.
- **Pre-trained Knowledge**: We assume the GenAI model used (Gemini) can be provided with a robust system prompt detailing the specific architecture and emergency protocols of the World Cup stadiums to ensure accurate advice.

## 5. Setup & Running
1. `npm install`
2. `npm run dev`
3. Access at `http://localhost:5173`
