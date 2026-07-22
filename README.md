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
- **Database / ORM**: MongoDB Atlas with Mongoose Schemas
- **Authentication**: JWT Auth API Routes & Auth Context
- **Internationalization (i18n)**: English & Sinhala (සිංහල)

---

## Easy Vercel Deployment Guide

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: **`Deneth0077/ZPMC-Complain-`**
3. Under **Environment Variables**, add the following 3 variables:

| Variable Key | Recommended Value |
|---|---|
| `MONGODB_URI` | `mongodb+srv://movies:hrissusdb@cluster0.wh95jya.mongodb.net/hambantota_port_hr?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `hambantota_port_hr_jwt_secret_2026_key` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app-name.vercel.app` |

4. Click **Deploy**! Vercel will build and publish your project in under 1 minute.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev

# 3. Open browser at
http://localhost:3000
```
