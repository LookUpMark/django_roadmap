# Capitolo 7: Sviluppo API REST Avanzate con Django REST Framework

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Progettare API REST professionali seguendo best practices
*   Implementare serializzazione avanzata con validazione custom
*   Utilizzare ViewSets e Generic Views per operazioni CRUD ottimizzate
*   Implementare filtering, searching, pagination e ordering
*   Gestire versioning delle API per backward compatibility
*   Documentare automaticamente le API con OpenAPI/Swagger
*   Testare le API in modo completo e professionale
*   Ottimizzare performance delle API per alta concorrenza

## Lezione Teorica

### Principi di Design API REST

Una API REST ben progettata segue principi fondamentali che la rendono intuitiva, scalabile e maintainable:

#### 1. Resource-Based URLs
```python
# ✅ Corretto - Resource-based
GET /api/v1/books/          # Lista libri
GET /api/v1/books/123/      # Dettaglio libro
POST /api/v1/books/         # Crea libro
PUT /api/v1/books/123/      # Aggiorna libro
DELETE /api/v1/books/123/   # Elimina libro

# ❌ Scorretto - Action-based
GET /api/v1/getBooks/
POST /api/v1/createBook/
```

#### 2. HTTP Status Codes Appropriati
```python
# views.py
from rest_framework import status
from rest_framework.response import Response

class BookViewSet(viewsets.ModelViewSet):
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )
```

#### 3. Consistent Response Format
```python
# serializers.py
class StandardResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    message = serializers.CharField(max_length=200)
    data = serializers.JSONField()
    errors = serializers.JSONField(required=False)
    
    @classmethod
    def success_response(cls, data, message="Success"):
        return {
            'success': True,
            'message': message,
            'data': data
        }
    
    @classmethod
    def error_response(cls, errors, message="Error occurred"):
        return {
            'success': False,
            'message': message,
            'errors': errors
        }
```

### Serializzazione Avanzata

#### Nested Serializers
```python
# serializers.py
class AutoreSerializer(serializers.ModelSerializer):
    libri_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Autore
        fields = ['id', 'nome', 'cognome', 'data_nascita', 'libri_count']
    
    def get_libri_count(self, obj):
        return obj.libri.count()

class LibroDetailSerializer(serializers.ModelSerializer):
    autore = AutoreSerializer(read_only=True)
    autore_id = serializers.IntegerField(write_only=True)
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    
    class Meta:
        model = Libro
        fields = [
            'id', 'titolo', 'isbn', 'data_pubblicazione',
            'numero_pagine', 'prezzo', 'autore', 'autore_id',
            'categoria_nome', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
```

#### Custom Validation
```python
# serializers.py
class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = '__all__'
    
    def validate_isbn(self, value):
        """Validazione custom per ISBN"""
        # Rimuovi trattini e spazi
        isbn_clean = value.replace('-', '').replace(' ', '')
        
        # Verifica lunghezza
        if len(isbn_clean) not in [10, 13]:
            raise serializers.ValidationError(
                "ISBN deve essere di 10 o 13 cifre"
            )
        
        # Verifica che sia numerico
        if not isbn_clean.isdigit():
            raise serializers.ValidationError(
                "ISBN deve contenere solo numeri"
            )
        
        # Verifica unicità
        if Libro.objects.filter(isbn=isbn_clean).exists():
            raise serializers.ValidationError(
                "Un libro con questo ISBN esiste già"
            )
        
        return isbn_clean
    
    def validate(self, data):
        """Validazione cross-field"""
        if data.get('data_pubblicazione'):
            if data['data_pubblicazione'] > timezone.now().date():
                raise serializers.ValidationError(
                    "La data di pubblicazione non può essere nel futuro"
                )
        
        if data.get('prezzo') and data.get('numero_pagine'):
            # Prezzo per pagina non può essere troppo alto
            prezzo_per_pagina = float(data['prezzo']) / data['numero_pagine']
            if prezzo_per_pagina > 1.0:
                raise serializers.ValidationError(
                    "Il prezzo per pagina sembra troppo alto"
                )
        
        return data
```

### ViewSets Avanzati

#### Custom Actions
```python
# views.py
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Count

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    
    @action(detail=True, methods=['post'])
    def set_favorite(self, request, pk=None):
        """Aggiungi/rimuovi libro dai preferiti"""
        libro = self.get_object()
        user = request.user
        
        favorite, created = Preferito.objects.get_or_create(
            user=user, libro=libro
        )
        
        if not created:
            favorite.delete()
            return Response({'status': 'removed from favorites'})
        
        return Response({'status': 'added to favorites'})
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Statistiche sui libri"""
        stats = {
            'total_books': Libro.objects.count(),
            'average_price': Libro.objects.aggregate(
                avg_price=Avg('prezzo')
            )['avg_price'],
            'books_by_category': Libro.objects.values('categoria__nome').annotate(
                count=Count('id')
            ),
            'recent_books': Libro.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count()
        }
        return Response(stats)
    
    @action(detail=True, methods=['get'])
    def similar_books(self, request, pk=None):
        """Libri simili basati su categoria e autore"""
        libro = self.get_object()
        similar = Libro.objects.filter(
            models.Q(categoria=libro.categoria) | 
            models.Q(autore=libro.autore)
        ).exclude(id=libro.id)[:5]
        
        serializer = LibroSerializer(similar, many=True)
        return Response(serializer.data)
```

#### Filtering e Search Avanzati
```python
# views.py
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
import django_filters

class LibroFilter(django_filters.FilterSet):
    prezzo_min = django_filters.NumberFilter(field_name="prezzo", lookup_expr='gte')
    prezzo_max = django_filters.NumberFilter(field_name="prezzo", lookup_expr='lte')
    anno_pubblicazione = django_filters.NumberFilter(
        field_name="data_pubblicazione", lookup_expr='year'
    )
    autore_nome = django_filters.CharFilter(
        field_name="autore__nome", lookup_expr='icontains'
    )
    
    class Meta:
        model = Libro
        fields = {
            'categoria': ['exact'],
            'numero_pagine': ['gte', 'lte'],
            'data_pubblicazione': ['gte', 'lte'],
        }

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.select_related('autore', 'categoria')
    serializer_class = LibroSerializer
    filter_backends = [
        DjangoFilterBackend, 
        filters.SearchFilter, 
        filters.OrderingFilter
    ]
    filterset_class = LibroFilter
    search_fields = ['titolo', 'isbn', 'autore__nome', 'autore__cognome']
    ordering_fields = ['data_pubblicazione', 'prezzo', 'created_at']
    ordering = ['-created_at']
```

### Pagination Personalizzata

```python
# pagination.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'count': self.page.paginator.count,
                'page_size': self.page_size,
                'current_page': self.page.number,
                'total_pages': self.page.paginator.num_pages,
            },
            'results': data
        })

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'myapp.pagination.CustomPageNumberPagination',
    'PAGE_SIZE': 20
}
```

### API Versioning

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1', 'v2'],
    'VERSION_PARAM': 'version'
}

# urls.py
from django.urls import path, include

urlpatterns = [
    path('api/v1/', include('myapp.urls.v1')),
    path('api/v2/', include('myapp.urls.v2')),
]

# views.py
class LibroViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.version == 'v2':
            return LibroV2Serializer
        return LibroSerializer
```

### Testing API Completo

```python
# tests/test_api.py
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from myapp.models import Libro, Autore

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def sample_autore():
    return Autore.objects.create(
        nome='Mario',
        cognome='Rossi',
        data_nascita='1980-01-01'
    )

@pytest.fixture
def sample_libro(sample_autore):
    return Libro.objects.create(
        titolo='Test Book',
        autore=sample_autore,
        isbn='1234567890',
        data_pubblicazione='2023-01-01',
        prezzo=19.99
    )

class TestLibroAPI:
    def test_list_libri(self, api_client, sample_libro):
        """Test lista libri"""
        response = api_client.get('/api/v1/libri/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['titolo'] == 'Test Book'
    
    def test_create_libro_authenticated(self, authenticated_client, sample_autore):
        """Test creazione libro con utente autenticato"""
        data = {
            'titolo': 'New Book',
            'autore': sample_autore.id,
            'isbn': '9876543210',
            'data_pubblicazione': '2023-06-01',
            'prezzo': 25.50
        }
        response = authenticated_client.post('/api/v1/libri/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Libro.objects.filter(titolo='New Book').exists()
    
    def test_create_libro_unauthenticated(self, api_client):
        """Test creazione libro senza autenticazione"""
        data = {'titolo': 'New Book'}
        response = api_client.post('/api/v1/libri/', data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_invalid_isbn(self, authenticated_client, sample_autore):
        """Test validazione ISBN"""
        data = {
            'titolo': 'Invalid Book',
            'autore': sample_autore.id,
            'isbn': '123',  # ISBN troppo corto
            'data_pubblicazione': '2023-06-01'
        }
        response = authenticated_client.post('/api/v1/libri/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'isbn' in response.data
    
    def test_filter_by_price(self, api_client, sample_libro):
        """Test filtering per prezzo"""
        response = api_client.get('/api/v1/libri/?prezzo_min=15&prezzo_max=25')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
    
    def test_search_books(self, api_client, sample_libro):
        """Test search functionality"""
        response = api_client.get('/api/v1/libri/?search=Test')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
```

## Frontend di Test (Già Pronto)

Per testare le API sviluppate, è disponibile un'applicazione Next.js completa in `frontend_test_client/` con:

### Funzionalità Disponibili:
- **Dashboard** per visualizzare statistiche API
- **Catalogo libri** con filtering e search
- **Form di creazione** libri con validazione
- **Autenticazione** completa
- **Testing interface** per tutti gli endpoint

### Come Utilizzare:
```bash
# Avvia il client di test
cd frontend_test_client
npm install
npm run dev
```

Il frontend è già configurato per:
- Chiamare le API Django su `http://127.0.0.1:8000`
- Gestire autenticazione JWT
- Mostrare errori di validazione
- Testare tutte le funzionalità API

**Nota:** Il frontend è scritto in JavaScript ed è solo uno strumento di test - non è parte del curriculum Django.

## Esercizi Pratici

### Esercizio 1: API Completa per Sistema Libreria
Implementa un'API REST completa con:
- ViewSets per Libri, Autori, Categorie
- Serializzazione avanzata con nested objects
- Filtering, search e pagination
- Custom actions per statistiche

### Esercizio 2: Sistema di Recensioni
Estendi l'API con:
- Modello Recensione (rating, commento, utente, libro)
- Endpoint per CRUD recensioni
- Calcolo rating medio per libro
- Filtering recensioni per rating

### Esercizio 3: API Versioning
Implementa versioning per:
- v1: API attuale
- v2: Aggiunge campo "disponibile" ai libri
- Backward compatibility garantita
- Documentazione per entrambe le versioni

### Esercizio 4: Performance Optimization
Ottimizza le API per:
- Query N+1 problem resolution
- Caching con Redis
- Database indexes appropriati
- Pagination efficiente per grandi dataset

## Risorse Aggiuntive

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [API Design Best Practices](https://restfulapi.net/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Testing REST APIs](https://realpython.com/test-driven-development-of-a-django-restful-api/)

## Prossimi Passi

Nel prossimo capitolo approfondiremo:
- Autenticazione e autorizzazione avanzate
- Security best practices per API
- Rate limiting e throttling
- Monitoring e logging delle API