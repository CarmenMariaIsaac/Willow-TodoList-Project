Willow – Full-Stack To-Do List Application
Willow is a full-stack productivity application designed to help users organize daily activities through tasks, goals, notes, and schedules.
It integrates a React frontend with a Django REST Framework backend to create a smooth and efficient personal planning experience.

📘 Repository
GitHub: Willow-Todolist-Project

🌿 Overview
Willow provides an all-in-one platform for managing productivity.
It enables users to track tasks, set daily goals, schedule events, and maintain notes — all enhanced with a gamified XP and level-up system to encourage consistency and focus.

✨ Features
User Authentication: Register and log in with JWT-based authentication
Task Management: Add, edit, delete, and mark tasks as complete
Daily Goals: Track key objectives for each day
Schedule Planner: Manage events with start and end times
Notes Section: Write daily notes or reflections
Gamification: Earn XP, level up, and maintain streaks for motivation
Theme Support: Toggle between light and dark mode
Calendar Overview: Monthly display of all tasks and events
Responsive Design: Optimized for both desktop and mobile devices

🛠️ Technology Stack
Frontend:
React (Functional Components & Hooks)
React Router
React Big Calendar
Moment.js
Lucide React Icons
Custom CSS (Tailwind-inspired design system)

Backend:
Django 5
Django REST Framework
Djoser (Authentication)
SimpleJWT (JWT Token Authentication)
Django-CORS-Headers
SQLite3 (development database)

⚙️ Installation and Local Setup
1️⃣ Clone the Repository
git clone https://github.com/CarmenMariaIsaac/Willow-Todolist-Project.git
cd Willow-Todolist-Project

2️⃣ Backend Setup
cd backend
python -m venv env
source env/bin/activate        # On Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

The backend runs on http://localhost:8000

3️⃣ Frontend Setup
Open a new terminal:
cd frontend
npm install
npm start

The frontend runs on http://localhost:3000

Environment Variables:
In your backend directory, create a file named .env and add:
SECRET_KEY=your_django_secret_key
DEBUG=True

The app uses default CORS settings allowing connections from:
http://localhost:3000
http://127.0.0.1:3000

🧩 API Endpoints
Endpoint	Method	Description
/auth/users/	POST	Register a new user
/auth/jwt/create/	POST	Obtain JWT tokens
/api/tasks/	GET / POST	Retrieve or create tasks
/api/tasks/{id}/	PATCH / DELETE	Update or delete a task
/api/tasks/{id}/complete/	POST	Mark a task as completed
/api/focus-items/	GET / POST	Manage daily goals
/api/schedule-events/	GET / POST	Manage schedule events
/api/notes/	GET / POST	Manage daily notes

🗂️ Project Structure
Willow-Todolist-Project/
├── backend/
│   ├── backend/            # Django project configuration
│   ├── tasks/              # Application logic (models, serializers, views)
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Home, Tasks, Calendar, Login
    │   ├── layout/         # Layout and routing
    │   └── App.css         # Global styles
    └── package.json

Development Notes:
The backend uses Django REST Framework for APIs.
Authentication is handled using Djoser with SimpleJWT.
Frontend communicates with the backend using secure JWT headers.
Default database is SQLite3 (for local testing).
The UI supports both light and dark themes.

Current Status
This project is currently under local development.
Deployment configurations (for platforms like Render, Railway, or Vercel) will be added in a future update.

License
This project is licensed under the MIT License.
You are free to use, modify, and distribute it with proper attribution.

👤 Author
Developed by: Carmen Maria Isaac
Email: carmenmariaisaacr@gmail.com
GitHub: https://github.com/CarmenMariaIsaac
