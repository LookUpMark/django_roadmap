# Capitolo 9: Performance Optimization e Caching in Django

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Identificare e risolvere bottleneck di performance nelle applicazioni Django
*   Implementare strategie di caching multi-livello con Redis
*   Ottimizzare query del database e risolvere il problema N+1
*   Configurare connection pooling e database optimization
*   Implementare async views e operazioni asincrone
*   Utilizzare profiling tools per monitoring delle performance
*   Configurare load balancing e scaling orizzontale
*   Implementare CDN e static file optimization

## Lezione Teorica

### Identificazione dei Bottleneck

Prima di ottimizzare, è fondamentale identificare dove si trovano i problemi di performance:

#### 1. Django Debug Toolbar
```python
# settings.py (Development)
INSTALLED_APPS = [
    # ...
    'debug_toolbar',
]

MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # ... altri middleware
]

INTERNAL_IPS = [
    '127.0.0.1',
]

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
    'SHOW_COLLAPSED': True,
}

# urls.py
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
```

#### 2. Django Silk per Production Profiling
```python
# settings.py
INSTALLED_APPS = [
    # ...
    'silk',
]

MIDDLEWARE = [
    'silk.middleware.SilkyMiddleware',
    # ... altri middleware
]

# Configurazione Silk
SILKY_PYTHON_PROFILER = True
SILKY_PYTHON_PROFILER_BINARY = True
SILKY_AUTHENTICATION = True
SILKY_AUTHORISATION = True

# urls.py
urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]
```

### Database Query Optimization

#### 1. Risoluzione del Problema N+1
```python
# ❌ Problema N+1 - Inefficiente
def lista_libri_inefficiente(request):
    libri = Libro.objects.all()  # 1 query
    for libro in libri:
        print(libro.autore.nome)  # N query aggiuntive!
    return render(request, 'libri.html', {'libri': libri})

# ✅ Soluzione con select_related
def lista_libri_ottimizzata(request):
    libri = Libro.objects.select_related('autore', 'categoria').all()  # 1 query con JOIN
    for libro in libri:
        print(libro.autore.nome)  # Nessuna query aggiuntiva
    return render(request, 'libri.html', {'libri': libri})

# ✅ Per relazioni Many-to-Many usa prefetch_related
def lista_libri_con_tags(request):
    libri = Libro.objects.prefetch_related('tags').select_related('autore')
    return render(request, 'libri.html', {'libri': libri})
```

#### 2. Custom QuerySets Ottimizzati
```python
# managers.py
from django.db import models

class LibroQuerySet(models.QuerySet):
    def with_author_and_category(self):
        return self.select_related('autore', 'categoria')
    
    def with_reviews_count(self):
        return self.annotate(
            reviews_count=models.Count('recensioni'),
            avg_rating=models.Avg('recensioni__rating')
        )
    
    def published_only(self):
        return self.filter(is_published=True)
    
    def by_category(self, category_name):
        return self.filter(categoria__nome__icontains=category_name)

class LibroManager(models.Manager):
    def get_queryset(self):
        return LibroQuerySet(self.model, using=self._db)
    
    def with_author_and_category(self):
        return self.get_queryset().with_author_and_category()
    
    def published_with_stats(self):
        return (self.get_queryset()
                .published_only()
                .with_author_and_category()
                .with_reviews_count())

# models.py
class Libro(models.Model):
    # ... campi del modello
    
    objects = LibroManager()
    
    class Meta:
        indexes = [
            models.Index(fields=['data_pubblicazione']),
            models.Index(fields=['categoria', 'is_published']),
            models.Index(fields=['autore', 'data_pubblicazione']),
        ]

# Uso ottimizzato
def api_libri_ottimizzata(request):
    libri = Libro.objects.published_with_stats().order_by('-data_pubblicazione')
    # Una sola query complessa invece di molte query semplici
```

#### 3. Database Indexes Strategici
```python
# models.py
class Libro(models.Model):
    titolo = models.CharField(max_length=200, db_index=True)  # Index singolo
    isbn = models.CharField(max_length=13, unique=True)  # Unique constraint
    data_pubblicazione = models.DateField(db_index=True)
    prezzo = models.DecimalField(max_digits=6, decimal_places=2)
    autore = models.ForeignKey(Autore, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    
    class Meta:
        # Index composti per query comuni
        indexes = [
            models.Index(fields=['categoria', 'data_pubblicazione']),
            models.Index(fields=['autore', 'is_published']),
            models.Index(fields=['prezzo', 'categoria']),
            # Index per full-text search (PostgreSQL)
            models.Index(fields=['titolo'], name='libro_titolo_gin', opclasses=['gin_trgm_ops']),
        ]
        
        # Constraint per performance e integrità
        constraints = [
            models.CheckConstraint(
                check=models.Q(prezzo__gte=0),
                name='prezzo_non_negativo'
            ),
            models.UniqueConstraint(
                fields=['autore', 'titolo'],
                name='unique_libro_per_autore'
            ),
        ]
```

### Caching Strategies

#### 1. Setup Redis per Caching
```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'SERIALIZER': 'django_redis.serializers.json.JSONSerializer',
            'COMPRESSOR': 'django_redis.compressors.zlib.ZlibCompressor',
        },
        'KEY_PREFIX': 'libreria',
        'TIMEOUT': 300,  # 5 minuti default
    },
    'sessions': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/2',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
    }
}

# Usa Redis per sessioni
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'sessions'
```

#### 2. View-Level Caching
```python
# views.py
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.utils.decorators import method_decorator

# Function-based view caching
@cache_page(60 * 15)  # Cache per 15 minuti
def lista_libri_cached(request):
    libri = Libro.objects.published_with_stats()
    return render(request, 'libri.html', {'libri': libri})

# Class-based view caching
@method_decorator(cache_page(60 * 15), name='dispatch')
class LibroListView(ListView):
    model = Libro
    template_name = 'libri.html'
    
    def get_queryset(self):
        return Libro.objects.published_with_stats()

# Caching condizionale
def libro_detail_conditional_cache(request, libro_id):
    cache_key = f'libro_detail_{libro_id}_{request.user.id}'
    cached_data = cache.get(cache_key)
    
    if cached_data is None:
        libro = get_object_or_404(
            Libro.objects.with_author_and_category(),
            id=libro_id
        )
        cached_data = {
            'libro': libro,
            'can_edit': libro.can_user_edit(request.user),
            'reviews': libro.recensioni.select_related('user')[:5]
        }
        cache.set(cache_key, cached_data, 60 * 30)  # 30 minuti
    
    return render(request, 'libro_detail.html', cached_data)
```

#### 3. Template Fragment Caching
```html
<!-- templates/libri.html -->
{% load cache %}

<div class="libri-container">
    {% cache 900 libri_sidebar request.user.id %}
        <!-- Sidebar con statistiche - cache per 15 minuti -->
        <div class="sidebar">
            <h3>Statistiche</h3>
            <p>Totale libri: {{ total_libri }}</p>
            <p>Nuovi questo mese: {{ nuovi_libri }}</p>
        </div>
    {% endcache %}
    
    <div class="libri-list">
        {% for libro in libri %}
            {% cache 600 libro_card libro.id libro.updated_at %}
                <!-- Card singolo libro - cache per 10 minuti -->
                <div class="libro-card">
                    <h4>{{ libro.titolo }}</h4>
                    <p>{{ libro.autore.nome }}</p>
                    <p>€ {{ libro.prezzo }}</p>
                </div>
            {% endcache %}
        {% endfor %}
    </div>
</div>
```

#### 4. Low-Level Caching per API
```python
# views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.cache import cache
import hashlib
import json

@api_view(['GET'])
def api_libri_cached(request):
    # Crea cache key basato su parametri query
    query_params = request.GET.dict()
    cache_key_data = json.dumps(query_params, sort_keys=True)
    cache_key = f"api_libri_{hashlib.md5(cache_key_data.encode()).hexdigest()}"
    
    # Prova a recuperare dalla cache
    cached_response = cache.get(cache_key)
    if cached_response is not None:
        return Response(cached_response)
    
    # Se non in cache, esegui query
    queryset = Libro.objects.published_with_stats()
    
    # Applica filtri
    categoria = query_params.get('categoria')
    if categoria:
        queryset = queryset.filter(categoria__nome__icontains=categoria)
    
    # Serializza dati
    serializer = LibroSerializer(queryset, many=True)
    response_data = {
        'count': queryset.count(),
        'results': serializer.data
    }
    
    # Salva in cache per 10 minuti
    cache.set(cache_key, response_data, 60 * 10)
    
    return Response(response_data)
```

### Database Connection Pooling

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'libreria_db',
        'USER': 'libreria_user',
        'PASSWORD': 'password',
        'HOST': '127.0.0.1',
        'PORT': '5432',
        'OPTIONS': {
            'MAX_CONNS': 20,
            'MIN_CONNS': 5,
        },
        'CONN_MAX_AGE': 600,  # 10 minuti
    }
}

# Per connection pooling avanzato con pgbouncer
# DATABASE_URL = 'postgres://user:pass@localhost:6432/dbname'
```

### Async Views e Operations

```python
# views.py
import asyncio
from django.http import JsonResponse
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

# Async view per operazioni I/O intensive
async def async_libro_stats(request):
    # Operazioni database asincrone
    total_libri = await database_sync_to_async(Libro.objects.count)()
    
    # Operazioni parallele
    tasks = [
        database_sync_to_async(Libro.objects.filter(data_pubblicazione__year=2023).count)(),
        database_sync_to_async(Autore.objects.count)(),
        database_sync_to_async(lambda: list(Libro.objects.values('categoria__nome').annotate(count=Count('id'))))(),
    ]
    
    libri_2023, total_autori, libri_per_categoria = await asyncio.gather(*tasks)
    
    return JsonResponse({
        'total_libri': total_libri,
        'libri_2023': libri_2023,
        'total_autori': total_autori,
        'libri_per_categoria': libri_per_categoria,
    })

# Async API endpoint
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
async def async_api_dashboard(request):
    # Recupera dati da multiple sources in parallelo
    cache_tasks = [
        sync_to_async(cache.get)('dashboard_stats'),
        sync_to_async(cache.get)('recent_activity'),
    ]
    
    db_tasks = [
        database_sync_to_async(Libro.objects.count)(),
        database_sync_to_async(User.objects.filter(is_active=True).count)(),
    ]
    
    # Esegui tutte le operazioni in parallelo
    cached_stats, cached_activity = await asyncio.gather(*cache_tasks)
    total_libri, active_users = await asyncio.gather(*db_tasks)
    
    dashboard_data = {
        'stats': cached_stats or {'libri': total_libri, 'users': active_users},
        'recent_activity': cached_activity or [],
        'timestamp': timezone.now().isoformat(),
    }
    
    return Response(dashboard_data)
```

### Performance Monitoring

#### 1. Custom Middleware per Monitoring
```python
# middleware.py
import time
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('performance')

class PerformanceMonitoringMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()
    
    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            
            # Log richieste lente
            if duration > 1.0:  # > 1 secondo
                logger.warning(
                    f"Slow request: {request.method} {request.path} "
                    f"took {duration:.2f}s"
                )
            
            # Aggiungi header con timing
            response['X-Response-Time'] = f"{duration:.3f}s"
            
            # Metriche per monitoring esterno
            if hasattr(request, 'user') and request.user.is_authenticated:
                user_type = 'authenticated'
            else:
                user_type = 'anonymous'
            
            # Invia metriche a sistema di monitoring
            # (Prometheus, DataDog, etc.)
            self.send_metrics({
                'path': request.path,
                'method': request.method,
                'status_code': response.status_code,
                'duration': duration,
                'user_type': user_type,
            })
        
        return response
    
    def send_metrics(self, data):
        # Implementa invio metriche al tuo sistema di monitoring
        pass
```

#### 2. Database Query Monitoring
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'db_queries': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'db_queries.log',
        },
        'performance': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'performance.log',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['db_queries'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'performance': {
            'handlers': ['performance'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Custom management command per analisi query
# management/commands/analyze_queries.py
from django.core.management.base import BaseCommand
from django.db import connection
from django.test.utils import override_settings

class Command(BaseCommand):
    help = 'Analyze database queries for performance issues'
    
    @override_settings(DEBUG=True)
    def handle(self, *args, **options):
        # Reset query log
        connection.queries_log.clear()
        
        # Esegui operazioni da testare
        from myapp.views import lista_libri_ottimizzata
        from django.test import RequestFactory
        
        factory = RequestFactory()
        request = factory.get('/libri/')
        lista_libri_ottimizzata(request)
        
        # Analizza query
        queries = connection.queries
        total_time = sum(float(q['time']) for q in queries)
        
        self.stdout.write(f"Total queries: {len(queries)}")
        self.stdout.write(f"Total time: {total_time:.3f}s")
        
        # Mostra query più lente
        slow_queries = [q for q in queries if float(q['time']) > 0.01]
        for query in slow_queries:
            self.stdout.write(f"Slow query ({query['time']}s): {query['sql'][:100]}...")
```

## Frontend di Test per Performance

Il frontend di test include:

### Performance Dashboard:
- **Response Time Monitoring** per ogni endpoint
- **Query Count Tracking** per identificare N+1 problems
- **Cache Hit Rate** visualization
- **Load Testing Interface** per stress testing

### Caching Test Interface:
- **Cache Management** tools per invalidare cache
- **Cache Statistics** viewer
- **Performance Comparison** con/senza cache

**Nota:** Il frontend è scritto in JavaScript ed è solo uno strumento di test - non è parte del curriculum Django.

## Esercizi Pratici

### Esercizio 1: Query Optimization
Ottimizza le query per:
- Lista libri con autori e categorie
- Dashboard con statistiche aggregate
- Search con full-text su PostgreSQL
- Pagination efficiente per grandi dataset

### Esercizio 2: Multi-Level Caching
Implementa caching strategy con:
- Database query caching
- Template fragment caching
- API response caching
- Static file caching con CDN

### Esercizio 3: Performance Monitoring
Configura monitoring completo con:
- Response time tracking
- Database query analysis
- Memory usage monitoring
- Error rate tracking

### Esercizio 4: Load Testing
Esegui load testing per:
- API endpoints sotto stress
- Database performance limits
- Cache effectiveness
- Scaling bottlenecks identification

## Risorse Aggiuntive

- [Django Performance Documentation](https://docs.djangoproject.com/en/stable/topics/performance/)
- [Database Optimization Guide](https://docs.djangoproject.com/en/stable/topics/db/optimization/)
- [Redis Caching Best Practices](https://redis.io/docs/manual/patterns/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

## Prossimi Passi

Nel prossimo capitolo approfondiremo:
- Deployment e DevOps per Django
- Containerizzazione con Docker
- CI/CD pipeline setup
- Production monitoring e maintenance