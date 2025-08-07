# Technology Stack & Build System

## Backend Technologies

### Core Framework
- **Django 5.2.4** - Python web framework following MVT (Model-View-Template) architecture
- **Django REST Framework (DRF)** - Powerful toolkit for building Web APIs
- **Python 3.10+** - Programming language

### Database
- **SQLite** - Default development database (included with Django)
- **PostgreSQL** - Recommended production database with `psycopg2-binary` driver

### Authentication & Security
- **Token Authentication** - DRF token-based authentication
- **django-cors-headers** - Handle Cross-Origin Resource Sharing for React frontend
- **CSRF Protection** - Built-in Django security features

### Production Server
- **Gunicorn** - WSGI HTTP Server for production deployment

## Frontend Technologies

### Core Framework
- **React 18+** - JavaScript library for building user interfaces
- **JSX** - JavaScript syntax extension for React components
- **Create React App** - Build toolchain and development server

### State Management & Routing
- **React Hooks** - useState, useEffect for component state
- **Context API** - Global state management for authentication
- **React Router DOM** - Client-side routing for SPA navigation

### HTTP Client
- **Axios** - Promise-based HTTP client for API requests

### Build Tools
- **Node.js & npm** - JavaScript runtime and package manager
- **Webpack** - Module bundler (configured by Create React App)
- **Babel** - JavaScript transpiler (configured by Create React App)

## Development Environment

### Python Environment
- **Virtual Environment (venv)** - Isolated Python dependencies
- **pip** - Python package installer
- **requirements.txt** - Python dependency management

### Node.js Environment
- **package.json** - Node.js dependency and script management
- **package-lock.json** - Exact dependency versions

## Common Commands

### Django Backend Commands
```bash
# Environment setup
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows

# Django project management
pip install django djangorestframework
django-admin startproject myproject_exercise .
python manage.py startapp pizzeria_app
python manage.py runserver

# Database operations
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Static files (production)
python manage.py collectstatic

# Production server
gunicorn myproject_exercise.wsgi:application
```

### React Frontend Commands
```bash
# Project setup
npx create-react-app frontend_react
cd frontend_react
npm start

# Package management
npm install axios react-router-dom
npm install  # Install dependencies from package.json

# Production build
npm run build

# Testing
npm test
```

### Development Workflow
```bash
# Start Django development server (Terminal 1)
cd django_react_corso_esercizi
python manage.py runserver

# Start React development server (Terminal 2)
cd frontend_react
npm start
```

## Project Structure Conventions

### Django Structure
```
django_react_corso_esercizi/
├── manage.py
├── myproject_exercise/          # Project configuration
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── pizzeria_app/                # Django application
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── admin.py
└── requirements.txt
```

### React Structure
```
frontend_react/
├── public/
│   └── index.html
├── src/
│   ├── components/              # React components
│   ├── context/                 # Context providers
│   ├── App.js
│   └── index.js
├── package.json
└── build/                       # Production build output
```

## API Conventions

### REST API Endpoints
- **Base URL**: `http://localhost:8000/api/`
- **Authentication**: Token-based with `Authorization: Token <token>` header
- **Content-Type**: `application/json`
- **CORS**: Configured for `http://localhost:3000` (React dev server)

### Standard CRUD Operations
- `GET /api/books/` - List all books
- `POST /api/books/` - Create new book
- `GET /api/books/{id}/` - Retrieve specific book
- `PUT /api/books/{id}/` - Update specific book
- `DELETE /api/books/{id}/` - Delete specific book