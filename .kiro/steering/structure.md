# Project Organization & Folder Structure

## Repository Structure

This is a monorepo containing both the Django backend and React frontend, organized as a comprehensive course with 9 progressive chapters.

```
django-react-course/
├── .git/                           # Git version control
├── .kiro/                          # Kiro AI assistant configuration
│   └── steering/                   # AI guidance rules
├── 01_Introduction_and_Setup/      # Chapter 1: Django basics
│   ├── exercise_scaffolding/       # Exercise templates and guides
│   └── README.md                   # Chapter documentation
├── 02_Models_and_PostgreSQL/       # Chapter 2: Database modeling
├── 03_Views_Templates_URLs/        # Chapter 3: Django MVT pattern
├── 04_Django_Forms/                # Chapter 4: Form handling
├── 05_Intro_to_DRF/               # Chapter 5: REST API development
├── 06_DRF_Authentication/          # Chapter 6: API security
├── 07_React_Frontend_Setup/        # Chapter 7: React fundamentals
├── 08_React_Django_Integration/    # Chapter 8: Full-stack integration
├── 09_Deployment/                  # Chapter 9: Production deployment
└── django_react_corso_esercizi/    # Main working project
    ├── manage.py                   # Django management script
    ├── db.sqlite3                  # SQLite database file
    ├── myproject_exercise/         # Django project configuration
    │   ├── __init__.py
    │   ├── settings.py             # Django settings
    │   ├── urls.py                 # URL routing
    │   ├── wsgi.py                 # WSGI configuration
    │   └── asgi.py                 # ASGI configuration
    └── pizzeria_app/               # Django application
        ├── __init__.py
        ├── admin.py                # Django admin configuration
        ├── apps.py                 # App configuration
        ├── models.py               # Database models
        ├── views.py                # View functions/classes
        ├── urls.py                 # App-specific URL patterns
        ├── serializers.py          # DRF serializers (added in Chapter 5)
        ├── forms.py                # Django forms (added in Chapter 4)
        ├── signals.py              # Django signals (added in Chapter 6)
        ├── migrations/             # Database migration files
        └── templates/              # HTML templates (Chapters 3-4)
            └── pizzeria_app/       # App-namespaced templates
```

## Chapter Organization Pattern

Each chapter follows a consistent structure:

### Chapter Directory Structure
```
XX_Chapter_Name/
├── README.md                       # Complete chapter documentation
├── exercise_scaffolding/           # Exercise templates and starter code
│   ├── exercise_1_name.py         # Individual exercise files
│   ├── exercise_2_name.py
│   └── ...
├── client_scaffold/                # React scaffolding (Chapters 7-8)
└── server_scaffold/                # Django scaffolding (Chapters 7-8)
```

### README.md Structure
Each chapter README contains:
- **Obiettivi di Apprendimento** (Learning Objectives)
- **Lezione Teorica** (Theoretical Lesson)
- **Esercizi Pratici** (Practical Exercises)

## Django Application Structure

### Core Django Files
- **`manage.py`** - Command-line utility for Django project management
- **`settings.py`** - Central configuration file for Django project
- **`urls.py`** - URL routing configuration (project-level)
- **`wsgi.py`** - WSGI application entry point for deployment

### Django App Structure (`pizzeria_app/`)
- **`models.py`** - Database model definitions (ORM)
- **`views.py`** - View functions and classes (business logic)
- **`urls.py`** - App-specific URL patterns
- **`admin.py`** - Django admin interface configuration
- **`serializers.py`** - DRF serializers for API endpoints
- **`forms.py`** - Django form classes for HTML forms
- **`signals.py`** - Django signal handlers
- **`migrations/`** - Database schema migration files
- **`templates/`** - HTML template files (namespaced by app)

## Naming Conventions

### Django Conventions
- **Project Name**: `myproject_exercise` (configuration package)
- **App Name**: `pizzeria_app` (main application)
- **Model Names**: PascalCase (e.g., `Libro`, `Autore`)
- **View Names**: snake_case (e.g., `lista_libri`, `dettaglio_libro`)
- **URL Names**: snake_case with app namespace (e.g., `pizzeria_app:lista_libri`)
- **Template Names**: snake_case (e.g., `lista_libri.html`)

### File Organization Patterns
- **Templates**: `app_name/templates/app_name/template_name.html`
- **Static Files**: `app_name/static/app_name/css|js|images/`
- **API URLs**: Prefixed with `/api/` (e.g., `/api/libri/`)
- **Authentication URLs**: `/api/auth/` (e.g., `/api/auth/login/`)

## React Frontend Structure (Chapters 7-8)

When the React frontend is added, it follows this structure:

```
frontend_react/                     # React application root
├── public/                         # Static assets
│   ├── index.html                  # HTML shell
│   └── favicon.ico
├── src/                            # React source code
│   ├── components/                 # Reusable React components
│   │   ├── ListaLibri.js          # Book list component
│   │   ├── AggiungiLibroForm.js   # Add book form
│   │   ├── Login.js               # Login component
│   │   └── Register.js            # Registration component
│   ├── context/                    # React Context providers
│   │   └── AuthContext.js         # Authentication state management
│   ├── App.js                      # Main App component
│   ├── App.css                     # App-specific styles
│   ├── index.js                    # React entry point
│   └── index.css                   # Global styles
├── package.json                    # Node.js dependencies and scripts
├── package-lock.json               # Exact dependency versions
└── build/                          # Production build output (generated)
```

## Development Workflow Structure

### Local Development
- **Django Server**: `http://localhost:8000/` (backend API)
- **React Server**: `http://localhost:3000/` (frontend development)
- **Database**: SQLite file in project root (`db.sqlite3`)

### API Endpoint Structure
- **Base API URL**: `/api/`
- **Authentication**: `/api/auth/login/`, `/api/auth/register/`
- **Resources**: `/api/libri/`, `/api/autori/`
- **Admin Interface**: `/admin/`

## Course Progression Logic

The folder structure reflects the learning progression:

1. **Chapters 1-4**: Traditional Django web application (MVT pattern)
2. **Chapters 5-6**: API development with Django REST Framework
3. **Chapters 7-8**: React frontend and full-stack integration
4. **Chapter 9**: Production deployment considerations

Each chapter builds upon the previous ones, with the main working project (`django_react_corso_esercizi/`) evolving throughout the course.