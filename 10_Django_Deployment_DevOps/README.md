# Capitolo 10: Deployment e DevOps per Django

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Preparare applicazioni Django per deployment in produzione
*   Containerizzare applicazioni Django con Docker
*   Configurare reverse proxy con Nginx
*   Implementare CI/CD pipeline con GitHub Actions
*   Deployare su cloud providers (AWS, DigitalOcean, Railway)
*   Configurare monitoring e logging in produzione
*   Gestire database migrations in produzione
*   Implementare backup e disaster recovery strategies

## Lezione Teorica

### Preparazione per la Produzione

#### 1. Settings Configuration
```python
# settings/base.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Security
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = False
ALLOWED_HOSTS = []

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
    }
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# settings/development.py
from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Development database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# settings/production.py
from .base import *

DEBUG = False
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

# Security settings
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Session security
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/django.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['file', 'console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

#### 2. Environment Variables Management
```python
# .env.example
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_NAME=libreria_prod
DB_USER=libreria_user
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AWS S3 (if using)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name

# utils/env.py
import os
from django.core.exceptions import ImproperlyConfigured

def get_env_variable(var_name, default=None):
    """Get environment variable or raise exception"""
    try:
        return os.environ[var_name]
    except KeyError:
        if default is not None:
            return default
        error_msg = f"Set the {var_name} environment variable"
        raise ImproperlyConfigured(error_msg)
```

### Containerizzazione con Docker

#### 1. Dockerfile Multi-stage
```dockerfile
# Dockerfile
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN addgroup --system app && adduser --system --group app

# Set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Change ownership of the app directory
RUN chown -R app:app /app

# Switch to app user
USER app

# Collect static files
RUN python manage.py collectstatic --noinput --settings=myproject.settings.production

# Production stage
FROM python:3.11-slim as production

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install runtime dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN addgroup --system app && adduser --system --group app

# Copy from base stage
COPY --from=base /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=base /usr/local/bin /usr/local/bin
COPY --from=base --chown=app:app /app /app

# Switch to app user
USER app

WORKDIR /app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python manage.py check --deploy --settings=myproject.settings.production || exit 1

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--worker-class", "gevent", "myproject.wsgi:application"]
```

#### 2. Docker Compose per Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: libreria_dev
      POSTGRES_USER: libreria_user
      POSTGRES_PASSWORD: dev_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DEBUG=True
      - DB_HOST=db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  celery:
    build: .
    command: celery -A myproject worker -l info
    volumes:
      - .:/app
    environment:
      - DEBUG=True
      - DB_HOST=db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

#### 3. Docker Compose per Production
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./staticfiles:/app/staticfiles
      - ./media:/app/media
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  web:
    build:
      context: .
      target: production
    environment:
      - DJANGO_SETTINGS_MODULE=myproject.settings.production
      - SECRET_KEY=${SECRET_KEY}
      - DB_HOST=db
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./staticfiles:/app/staticfiles
      - ./media:/app/media
      - ./logs:/var/log/django
    depends_on:
      - db
      - redis
    restart: unless-stopped

  celery:
    build:
      context: .
      target: production
    command: celery -A myproject worker -l info
    environment:
      - DJANGO_SETTINGS_MODULE=myproject.settings.production
      - SECRET_KEY=${SECRET_KEY}
      - DB_HOST=db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    restart: unless-stopped

volumes:
  postgres_data:
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream django {
        server web:8000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Static files
        location /static/ {
            alias /app/staticfiles/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Media files
        location /media/ {
            alias /app/media/;
            expires 1y;
        }

        # API endpoints with rate limiting
        location /api/auth/login/ {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://django;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://django;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Django application
        location / {
            proxy_pass http://django;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### CI/CD Pipeline

#### 1. GitHub Actions Workflow
```yaml
# .github/workflows/django.yml
name: Django CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Cache pip dependencies
      uses: actions/cache@v3
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
        restore-keys: |
          ${{ runner.os }}-pip-
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install coverage
    
    - name: Run migrations
      env:
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379/0
      run: |
        python manage.py migrate --settings=myproject.settings.test
    
    - name: Run tests with coverage
      env:
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379/0
      run: |
        coverage run --source='.' manage.py test --settings=myproject.settings.test
        coverage xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
    
    - name: Run linting
      run: |
        pip install flake8 black isort
        flake8 .
        black --check .
        isort --check-only .

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run security checks
      run: |
        pip install safety bandit
        safety check
        bandit -r . -x tests/

  deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      env:
        DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
        DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
        DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
      run: |
        # Setup SSH
        mkdir -p ~/.ssh
        echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
        chmod 600 ~/.ssh/deploy_key
        
        # Deploy script
        ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST << 'EOF'
          cd /var/www/libreria
          git pull origin main
          docker-compose -f docker-compose.prod.yml down
          docker-compose -f docker-compose.prod.yml build
          docker-compose -f docker-compose.prod.yml up -d
          docker-compose -f docker-compose.prod.yml exec -T web python manage.py migrate --noinput
          docker-compose -f docker-compose.prod.yml exec -T web python manage.py collectstatic --noinput
        EOF
```

### Database Migrations in Production

```python
# management/commands/safe_migrate.py
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection
import time

class Command(BaseCommand):
    help = 'Safely run migrations in production'
    
    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Show what would be migrated')
        parser.add_argument('--backup', action='store_true', help='Create backup before migration')
    
    def handle(self, *args, **options):
        if options['backup']:
            self.stdout.write('Creating database backup...')
            self.create_backup()
        
        if options['dry_run']:
            self.stdout.write('Dry run - showing pending migrations:')
            call_command('showmigrations', '--plan')
            return
        
        # Check for long-running queries
        self.check_database_load()
        
        # Run migrations
        self.stdout.write('Running migrations...')
        start_time = time.time()
        
        try:
            call_command('migrate', '--noinput')
            duration = time.time() - start_time
            self.stdout.write(
                self.style.SUCCESS(f'Migrations completed in {duration:.2f} seconds')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Migration failed: {e}')
            )
            raise
    
    def create_backup(self):
        # Implement backup logic
        import subprocess
        import os
        
        db_name = os.environ.get('DB_NAME')
        backup_file = f"backup_{int(time.time())}.sql"
        
        subprocess.run([
            'pg_dump', 
            '-h', os.environ.get('DB_HOST'),
            '-U', os.environ.get('DB_USER'),
            '-d', db_name,
            '-f', f'/backups/{backup_file}'
        ])
        
        self.stdout.write(f'Backup created: {backup_file}')
    
    def check_database_load(self):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT count(*) 
                FROM pg_stat_activity 
                WHERE state = 'active' AND query NOT LIKE '%pg_stat_activity%'
            """)
            active_queries = cursor.fetchone()[0]
            
            if active_queries > 10:
                self.stdout.write(
                    self.style.WARNING(
                        f'High database load detected: {active_queries} active queries'
                    )
                )
```

### Monitoring e Logging

#### 1. Health Check Endpoint
```python
# views.py
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
import redis
import time

def health_check(request):
    """Health check endpoint per load balancer"""
    health_data = {
        'status': 'healthy',
        'timestamp': time.time(),
        'checks': {}
    }
    
    # Database check
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
        health_data['checks']['database'] = 'ok'
    except Exception as e:
        health_data['checks']['database'] = f'error: {str(e)}'
        health_data['status'] = 'unhealthy'
    
    # Redis check
    try:
        cache.set('health_check', 'ok', 30)
        cache.get('health_check')
        health_data['checks']['redis'] = 'ok'
    except Exception as e:
        health_data['checks']['redis'] = f'error: {str(e)}'
        health_data['status'] = 'unhealthy'
    
    # Disk space check
    import shutil
    total, used, free = shutil.disk_usage('/')
    free_percent = (free / total) * 100
    
    if free_percent < 10:
        health_data['checks']['disk'] = f'warning: {free_percent:.1f}% free'
        health_data['status'] = 'degraded'
    else:
        health_data['checks']['disk'] = 'ok'
    
    status_code = 200 if health_data['status'] == 'healthy' else 503
    return JsonResponse(health_data, status=status_code)
```

#### 2. Structured Logging
```python
# logging_config.py
import logging.config

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            'class': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(name)s %(levelname)s %(message)s'
        },
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'json',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/django/django.log',
            'maxBytes': 1024*1024*10,  # 10MB
            'backupCount': 5,
            'formatter': 'json',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
        'myapp': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
    },
}

logging.config.dictConfig(LOGGING_CONFIG)
```

## Frontend di Test per Deployment

Il frontend di test include:

### Deployment Dashboard:
- **Health Check Monitor** per tutti i servizi
- **Deployment Status** tracking
- **Performance Metrics** in real-time
- **Error Rate Monitoring**

### DevOps Tools:
- **Database Migration** interface
- **Cache Management** tools
- **Log Viewer** con filtering
- **Backup Management** interface

**Nota:** Il frontend è scritto in JavaScript ed è solo uno strumento di test - non è parte del curriculum Django.

## Esercizi Pratici

### Esercizio 1: Docker Setup Completo
Containerizza l'applicazione con:
- Multi-stage Dockerfile ottimizzato
- Docker Compose per development e production
- Health checks e restart policies
- Volume management per persistenza

### Esercizio 2: CI/CD Pipeline
Implementa pipeline completa con:
- Automated testing su multiple Python versions
- Security scanning con bandit e safety
- Code quality checks con flake8, black, isort
- Automated deployment su staging e production

### Esercizio 3: Production Monitoring
Configura monitoring completo con:
- Health check endpoints
- Structured logging con JSON format
- Error tracking con Sentry
- Performance monitoring con APM tools

### Esercizio 4: Backup e Recovery
Implementa strategia backup con:
- Automated database backups
- File storage backup (media files)
- Disaster recovery procedures
- Backup testing e validation

## Risorse Aggiuntive

- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [PostgreSQL Backup and Recovery](https://www.postgresql.org/docs/current/backup.html)

## Conclusione del Corso

Congratulazioni! Hai completato il corso completo di Django backend development. Ora sei in grado di:

✅ **Sviluppare API REST professionali** con Django e DRF
✅ **Implementare autenticazione e sicurezza** enterprise-grade
✅ **Ottimizzare performance** per applicazioni scalabili
✅ **Deployare in produzione** con best practices DevOps
✅ **Monitorare e mantenere** applicazioni in produzione

### Prossimi Passi Consigliati:
1. **Contribuisci a progetti open source** Django
2. **Specializzati in aree specifiche** (microservices, ML integration, etc.)
3. **Ottieni certificazioni** cloud provider
4. **Mentora altri sviluppatori** nella community Django