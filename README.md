# Hambantota International Port - HR Complaint Management System

Enterprise Mobile-First Human Resource Complaint & Grievance Management System built for **Hambantota International Port Group**.

---

## Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Material 3 enterprise design tokens
- **Typography**: Inter Font
- **Animations**: Framer Motion
- **Icons**: Lucide Icons & Material Symbols Rounded
- **Database / ORM**: MongoDB with Mongoose Schemas
- **Authentication**: JWT Auth API Routes & Auth Context

---

## Implemented Screens (Based on UI Design Specifications)

1. **Splash Screen** (`/splash`)
   - Port Emblem Badge, "Hambantota International Port", "HR Complaint Management"
   - Animated progress loader (`INITIALIZING SYSTEM`), version string `1.0.0`, secure gateway tag.

2. **Welcome Screen** (`/welcome`)
   - Header with `HIP HR`, vector meeting & port backdrop illustration.
   - Action buttons: `→ Login` and `+ Register`.
   - Confidential note (`✓ Encrypted & Confidential System`) and footer attribution.

3. **Employee Login Screen** (`/login`)
   - Anchor badge header (`Hambantota Port HUMAN RESOURCES`).
   - Inputs for **Employee Number** (`HIP-0000`) and **4-Digit PIN** (`••••`).
   - Remember Me toggle, Forgot PIN link, Register Now callout.
   - SSL encrypted environment badge and support footer links.

4. **Home Page Screen** (`/home`)
   - Greeting header with employee name (`Hello Deneth`), employee ID (`HMPT-1234`), notification bell badge, and avatar.
   - Hero banner card: `Complain Your Issue to HR` with sky blue `Start New Complaint ⊕` button.
   - 2x2 Categories Grid:
     - **OT Issues** (*Hours & Overtime*)
     - **HRIS System Errors** (*Portal Access*)
     - **No Pay Issues** (*Salary Deductions*)
     - **Other Issues** (*General Inquiry*)
   - Recent Complaints empty state card.
   - Floating Action Button (FAB) launching the interactive HR Live Support slide-up chat drawer.
   - Fixed Bottom Navigation (Home, My Complaints, Alerts, Profile).

5. **Notifications / Alerts Screen** (`/alerts`)
   - Header with back arrow, title `Hambantota Port HR`, user avatar.
   - `Notifications` section title with `MARK ALL AS READ` action.
   - Grouped notification feed matching the exact UI design:
     - `! HR Requested More Information`: Red icon, COMP-4829 (*Medical Certificate Missing*).
     - `↻ Complaint Status Changed`: COMP-4712 (`UNDER REVIEW` pill badge), COMP-4501 (`RESOLVED` peach badge).
     - `💬 New Complaint Updates`: COMP-4900 (*New Comment from HR*), COMP-4882 (*Document Attached*).

---

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev

# 3. Open browser at
http://localhost:3000
```
