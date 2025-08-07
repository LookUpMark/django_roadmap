# Capitolo 8: Autenticazione e Sicurezza Avanzate in Django

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Implementare sistemi di autenticazione moderni e sicuri
*   Configurare JWT authentication per API stateless
*   Gestire autorizzazioni granulari e role-based access control (RBAC)
*   Implementare OAuth2 e social authentication
*   Applicare security best practices per proteggere le applicazioni Django
*   Configurare rate limiting e throttling per prevenire abusi
*   Implementare audit logging per compliance e monitoring
*   Gestire session security e CSRF protection

## Lezione Teorica

### Sistemi di Autenticazione in Django

Django offre diversi sistemi di autenticazione, ognuno adatto a scenari specifici:

#### 1. Session-Based Authentication (Default Django)
```python
# settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    # ...
]

# Uso nelle views
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

@login_required
def protected_view(request):
    return render(request, 'protected.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
    return render(request, 'login.html')
```

#### 2. Token-Based Authentication (DRF)
```python
# settings.py
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'rest_framework.authtoken',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Generazione automatica token
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
```

#### 3. JWT Authentication (Moderno e Stateless)
```python
# settings.py
INSTALLED_APPS = [
    # ...
    'rest_framework_simplejwt',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
```

### Custom User Model

Per applicazioni professionali, è sempre consigliabile usare un custom user model:

```python
# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Campi per RBAC
    role = models.CharField(
        max_length=20,
        choices=[
            ('admin', 'Administrator'),
            ('librarian', 'Librarian'),
            ('reader', 'Reader'),
            ('guest', 'Guest'),
        ],
        default='reader'
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def has_role(self, role):
        return self.role == role
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_librarian(self):
        return self.role in ['admin', 'librarian']

# settings.py
AUTH_USER_MODEL = 'myapp.CustomUser'
```

### Autorizzazioni Granulari

#### Custom Permissions
```python
# models.py
class Libro(models.Model):
    # ... campi del modello
    
    class Meta:
        permissions = [
            ("can_publish", "Can publish books"),
            ("can_feature", "Can feature books"),
            ("can_bulk_import", "Can bulk import books"),
        ]

# permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission personalizzata per permettere solo ai proprietari
    di un oggetto di modificarlo.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions per qualsiasi richiesta
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions solo per il proprietario
        return obj.owner == request.user

class IsLibrarianOrReadOnly(permissions.BasePermission):
    """
    Permission per librarians e admin
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return (
            request.user.is_authenticated and 
            request.user.is_librarian()
        )

class CanManageBooks(permissions.BasePermission):
    """
    Permission basata su ruoli specifici
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Admin può fare tutto
        if request.user.is_admin():
            return True
        
        # Librarian può gestire libri
        if request.user.is_librarian():
            return request.method in ['GET', 'POST', 'PUT', 'PATCH']
        
        # Reader può solo leggere
        if request.user.has_role('reader'):
            return request.method in permissions.SAFE_METHODS
        
        return False

# views.py
class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    permission_classes = [IsAuthenticated, CanManageBooks]
    
    def get_permissions(self):
        """
        Permissions diverse per azioni diverse
        """
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.AllowAny]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated, IsLibrarianOrReadOnly]
        else:
            permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
        
        return [permission() for permission in permission_classes]
```

### OAuth2 e Social Authentication

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github',
]

SITE_ID = 1

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Configurazione Google OAuth2
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'OAUTH_PKCE_ENABLED': True,
    },
    'github': {
        'SCOPE': [
            'user:email',
        ],
    }
}

# Configurazione allauth
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_USERNAME_REQUIRED = False

# Custom adapter per gestire dati extra
# adapters.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        
        # Estrai dati extra dal provider
        extra_data = sociallogin.account.extra_data
        
        if sociallogin.account.provider == 'google':
            user.first_name = extra_data.get('given_name', '')
            user.last_name = extra_data.get('family_name', '')
            user.is_verified = extra_data.get('email_verified', False)
        
        user.save()
        return user

# settings.py
SOCIALACCOUNT_ADAPTER = 'myapp.adapters.CustomSocialAccountAdapter'
```

### Security Best Practices

#### 1. HTTPS e Security Headers
```python
# settings.py (Production)
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# CSRF Protection
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'

# Session Security
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_AGE = 3600  # 1 hour
```

#### 2. Rate Limiting e Throttling
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'login': '5/min',
        'register': '3/min',
    }
}

# Custom throttling
from rest_framework.throttling import UserRateThrottle

class LoginRateThrottle(UserRateThrottle):
    scope = 'login'

class RegisterRateThrottle(UserRateThrottle):
    scope = 'register'

# views.py
from rest_framework.decorators import throttle_classes

class AuthViewSet(viewsets.ViewSet):
    @throttle_classes([LoginRateThrottle])
    def login(self, request):
        # Login logic
        pass
    
    @throttle_classes([RegisterRateThrottle])
    def register(self, request):
        # Registration logic
        pass
```

#### 3. Input Validation e Sanitization
```python
# serializers.py
import re
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate_email(self, value):
        # Validazione email personalizzata
        validate_email(value)
        
        # Controlla domini bloccati
        blocked_domains = ['tempmail.com', '10minutemail.com']
        domain = value.split('@')[1].lower()
        if domain in blocked_domains:
            raise serializers.ValidationError("Email domain not allowed")
        
        return value.lower()
    
    def validate_username(self, value):
        # Solo caratteri alfanumerici e underscore
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers and underscores"
            )
        
        # Lunghezza minima e massima
        if len(value) < 3 or len(value) > 30:
            raise serializers.ValidationError(
                "Username must be between 3 and 30 characters"
            )
        
        return value
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user
```

### Audit Logging

```python
# models.py
class AuditLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50)
    resource_type = models.CharField(max_length=50)
    resource_id = models.CharField(max_length=50)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)
    
    class Meta:
        ordering = ['-timestamp']

# middleware.py
import json
from django.utils.deprecation import MiddlewareMixin
from .models import AuditLog

class AuditLogMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Log solo per API endpoints e azioni specifiche
        if (request.path.startswith('/api/') and 
            request.method in ['POST', 'PUT', 'PATCH', 'DELETE']):
            
            # Estrai informazioni dalla richiesta
            user = request.user if request.user.is_authenticated else None
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            # Determina azione e risorsa dal path
            path_parts = request.path.strip('/').split('/')
            if len(path_parts) >= 3:
                resource_type = path_parts[2]  # es: 'libri'
                resource_id = path_parts[3] if len(path_parts) > 3 else None
                
                action_map = {
                    'POST': 'create',
                    'PUT': 'update',
                    'PATCH': 'partial_update',
                    'DELETE': 'delete'
                }
                action = action_map.get(request.method, 'unknown')
                
                # Crea log entry
                AuditLog.objects.create(
                    user=user,
                    action=action,
                    resource_type=resource_type,
                    resource_id=resource_id or 'new',
                    ip_address=ip_address,
                    user_agent=user_agent,
                    details={
                        'status_code': response.status_code,
                        'method': request.method,
                        'path': request.path,
                    }
                )
        
        return response
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

# settings.py
MIDDLEWARE = [
    # ... altri middleware
    'myapp.middleware.AuditLogMiddleware',
]
```

## Frontend di Test

Il frontend di test in `frontend_test_client/` include:

### Funzionalità di Autenticazione:
- **Login/Logout** con JWT tokens
- **Registrazione** con validazione completa
- **Social Login** (Google, GitHub)
- **Password Reset** flow
- **Profile Management**

### Testing Security:
- **Rate Limiting** testing interface
- **Permission Testing** per diversi ruoli
- **Token Management** (refresh, expire)
- **Audit Log Viewer** per amministratori

**Nota:** Il frontend è scritto in JavaScript ed è solo uno strumento di test - non è parte del curriculum Django.

## Esercizi Pratici

### Esercizio 1: Sistema RBAC Completo
Implementa un sistema role-based access control con:
- Ruoli: Admin, Librarian, Reader, Guest
- Permissions granulari per ogni risorsa
- Middleware per controllo automatico
- Interface admin per gestione ruoli

### Esercizio 2: OAuth2 Integration
Configura autenticazione social con:
- Google OAuth2
- GitHub OAuth2
- Custom user creation logic
- Profile data synchronization

### Esercizio 3: Security Hardening
Implementa misure di sicurezza avanzate:
- Rate limiting personalizzato
- Input sanitization completa
- Security headers configuration
- Vulnerability scanning setup

### Esercizio 4: Audit System
Crea sistema di audit completo con:
- Logging di tutte le azioni sensibili
- Dashboard per monitoring
- Alert system per attività sospette
- Compliance reporting

## Risorse Aggiuntive

- [Django Authentication Documentation](https://docs.djangoproject.com/en/stable/topics/auth/)
- [Django REST Framework Authentication](https://www.django-rest-framework.org/api-guide/authentication/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## Prossimi Passi

Nel prossimo capitolo approfondiremo:
- Performance optimization e caching
- Database query optimization
- Async operations con Celery
- Monitoring e profiling delle applicazioni