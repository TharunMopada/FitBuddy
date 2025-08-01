# 🏋️‍♀️FitBuddy – AI-Powered Fitness Tracker

FitBuddy is a full-stack fitness tracking platform designed to help users log workouts, monitor nutrition, set fitness goals, and receive AI-powered suggestions – all in one place.

> Built with a React + TypeScript frontend and a Django + Django REST Framework (DRF) backend, FitBuddy combines clean UI with scalable backend APIs.

---

🚀 Features

- ✅ User authentication with JWT
- 📅 Workout logging (type, duration, calories burned)
- 🍽️ Nutrition tracking (meals, macros, daily intake)
- 🎯 Goal setting and progress monitoring
- 📊 Personalized dashboard with visual insights
- 🤖 AI-based workout & meal suggestions (OpenAI)
- 🎥 Video tutorials and embedded media
- 📱 Mobile-responsive UI built with Tailwind CSS
- 🔐 Secure API endpoints with DRF & JWT
- 📦 Dockerized for scalable deployment
- 🧪 Unit testing (pytest / Django test client)

---

🛠️ Tech Stack

Frontend
- React + TypeScript
- Tailwind CSS
- Chart.js / Recharts
- Axios

Backend (Planned or Connected)
- Django 4.x
- Django REST Framework (DRF)
- SimpleJWT for authentication
- PostgreSQL
- Celery + Redis (for async tasks)
- OpenAI API (for AI suggestions)

Heroku for deployment

---
📷 Screenshots

| Dashboard | Log Workout | AI Assistant |
|----------|-------------|--------------|
| ![Dashboard](<img width="1911" height="867" alt="Screenshot 2025-08-01 110208" src="https://github.com/user-attachments/assets/c0abae5e-69d6-46df-a7cf-e31fc61d661d" />)
| ![Workout](<img width="1900" height="870" alt="Screenshot 2025-08-01 110246" src="https://github.com/user-attachments/assets/b7516327-d8fb-4cfa-b690-f4c9ba2764ae" />)
| ![AI](<img width="1918" height="873" alt="Screenshot 2025-08-01 110557" src="https://github.com/user-attachments/assets/e759fa68-9b37-46cb-8bbf-352e0fc0dc9c" />) |

---


---

## 📡 API Endpoints (Sample)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/register/ | User registration |
| POST   | /api/login/ | Login with JWT |
| GET    | /api/workouts/ | List workouts |
| POST   | /api/workouts/ | Log new workout |
| GET    | /api/nutrition/ | Daily meals |
| POST   | /api/goal/ | Set a goal |
| GET    | /api/dashboard/ | Progress summary |
| POST   | /api/ai/suggest/ | AI-based suggestion |

> Full API docs available via Swagger or Postman Collection

---

## 🔧 Getting Started

### Prerequisites

- Node.js + npm
- Python 3.9+
- PostgreSQL
- Docker (optional)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev



##🙋‍♂️ About Me
Tharun Mopada
Full Stack Developer | Django Enthusiast | React | AI-Driven Apps
