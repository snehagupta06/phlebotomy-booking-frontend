# 🩺 Mobile Phlebotomy – Frontend  

A modern React + TypeScript frontend for a home-visit phlebotomy (blood sample collection) booking application.  
Designed with a clean, healthcare-friendly UI and includes both user booking flows and admin management screens.

---

## 🚀 Features

### User Features
- Browse available areas and time slots
- Book home sample collection with name, phone, and address
- Redirects to booking status page after submission
- Auto-refresh booking status (PENDING → CONFIRMED / FAILED)
### Admin Features
- Create new areas
- Create time slots with date, start time, and capacity
- View all existing areas with their slots

---

## 🛠️ Tech Stack
- React + TypeScript  
- Vite  
- Tailwind CSS  
- React Router  
- Fetch API  

---
## 📁 Folder Structure

```
src/
 ├── api/              # API helper functions
 ├── components/       # UI components
 ├── contexts/         # Global state
 ├── pages/            # Home/Admin/Booking pages
 ├── App.tsx           # App routing
 └── main.tsx          # Application bootstrap
```
---

## ⚙️ Environment Variables

Create a `.env` file in the frontend root:

```
VITE_API_URL=http://localhost:4000
```

---

## ▶️ Running Locally

```bash
cd phlebotomy-booking-frontend
npm install
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## 🧱 Build for Production
```bash
npm run build
npm run preview
```

---

## 🔌 Expected Backend Endpoints

| Method | Route | Description |
|--------|--------|-------------|
| GET | /api/areas | List all areas |
| GET | /api/slots | List slots (filterable) |
| POST | /admin/areas | Create area |
| POST | /admin/slots | Create slot |
| GET | /admin/slots | Admin slot list |
| POST | /booking | Create booking |
| GET | /booking/:id | Get booking details |

---

## Booking Flow Summary
1. User selects area + date
2. User clicks Book → goes to booking form  
3. Form submits → creates booking  
4. Redirects to `/booking/:id`  
5. Page polls backend until status updates  

---

## 📝 License
Created for academic use. You may modify or extend the project.