# Backend User Guide - Animal Shelter Management System

A comprehensive guide for using and developing the Django REST API backend for the Animal Shelter Management System.

## Quick Start

Make sure you have the following installed:

- **Python**: Version 3.8 or higher
- **MongoDB**: Either a local installation or cloud instance
- **pip**: Python package manager

### Getting Started

Here's how to set up the backend on your local machine:

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment to isolate dependencies
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install all the required Python packages
pip install -r requirements.txt

# Set up the database tables
python manage.py migrate

# Load some sample data to get started
python load_data.py

# Start the development server
python manage.py runserver
```

Once the server is running, your API will be available at `http://localhost:8000/api/`

## User Guide

### Understanding the API

The backend provides a RESTful API for managing animal shelter data. It handles three main types of information:

- **Dogs**: Complete records for all dogs in the shelter
- **Breeds**: Information about different dog breeds
- **Rescue Types**: Categories for different types of rescue operations

### Authentication

Right now, the API works without authentication for development purposes. When you're ready to deploy to production, you should consider adding:

- JWT Authentication
- API Key authentication
- OAuth2 integration

### Base URL

All API endpoints start with `/api/`:

```
http://localhost:8000/api/
```

## API Endpoints

### Working with Dogs

#### Get All Dogs

```http
GET /api/dogs/
```

**You can filter the results using these parameters:**

- `breed`: Filter by breed name
- `outcome_type`: Filter by outcome (Adoption, Transfer, etc.)
- `age_min`: Minimum age in weeks
- `age_max`: Maximum age in weeks
- `color`: Filter by color
- `sex`: Filter by sex
- `page`: Page number for pagination
- `page_size`: Number of items per page
- `ordering`: Sort field (e.g., `name`, `-age_upon_outcome_in_weeks`)

**Example request:**

```bash
curl "http://localhost:8000/api/dogs/?breed=Labrador&outcome_type=Adoption&page=1&page_size=10"
```

**What you'll get back:**

```json
{
  "count": 150,
  "next": "http://localhost:8000/api/dogs/?page=2",
  "previous": null,
  "results": [
    {
      "id": "507f1f77bcf86cd799439011",
      "animal_id": "A123456",
      "name": "Buddy",
      "breed": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Labrador Retriever"
      },
      "age_upon_outcome_in_weeks": 52.0,
      "color": "Black",
      "sex_upon_outcome": "Neutered Male",
      "outcome_type": "Adoption",
      "rescue_type": {
        "id": "507f1f77bcf86cd799439013",
        "name": "Water Rescue"
      },
      "location_lat": 30.2672,
      "location_long": -97.7431
    }
  ]
}
```

#### Get a Specific Dog

```http
GET /api/dogs/{id}/
```

**Example request:**

```bash
curl "http://localhost:8000/api/dogs/507f1f77bcf86cd799439011/"
```

#### Add a New Dog

```http
POST /api/dogs/
```

**What to send:**

```json
{
  "animal_id": "A789012",
  "name": "Max",
  "breed": "507f1f77bcf86cd799439012",
  "age_upon_outcome_in_weeks": 26.0,
  "color": "Brown",
  "sex_upon_outcome": "Spayed Female",
  "outcome_type": "Adoption",
  "rescue_type": "507f1f77bcf86cd799439013",
  "location_lat": 30.2672,
  "location_long": -97.7431
}
```

**Example request:**

```bash
curl -X POST "http://localhost:8000/api/dogs/" \
  -H "Content-Type: application/json" \
  -d '{
    "animal_id": "A789012",
    "name": "Max",
    "breed": "507f1f77bcf86cd799439012",
    "age_upon_outcome_in_weeks": 26.0,
    "color": "Brown",
    "sex_upon_outcome": "Spayed Female",
    "outcome_type": "Adoption",
    "rescue_type": "507f1f77bcf86cd799439013"
  }'
```

#### Update a Dog

```http
PUT /api/dogs/{id}/
```

**Example request:**

```bash
curl -X PUT "http://localhost:8000/api/dogs/507f1f77bcf86cd799439011/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Buddy Updated",
    "outcome_type": "Transfer"
  }'
```

#### Delete a Dog

```http
DELETE /api/dogs/{id}/
```

**Example request:**

```bash
curl -X DELETE "http://localhost:8000/api/dogs/507f1f77bcf86cd799439011/"
```

### Working with Breeds

#### Get All Breeds

```http
GET /api/breeds/
```

**You can filter using these parameters:**

- `name`: Filter by breed name
- `page`: Page number
- `page_size`: Items per page
- `ordering`: Sort field

#### Add a New Breed

```http
POST /api/breeds/
```

**What to send:**

```json
{
  "name": "Golden Retriever"
}
```

#### Update a Breed

```http
PUT /api/breeds/{id}/
```

#### Delete a Breed

```http
DELETE /api/breeds/{id}/
```

### Working with Rescue Types

#### Get All Rescue Types

```http
GET /api/rescue-types/
```

#### Add a New Rescue Type

```http
POST /api/rescue-types/
```

**What to send:**

```json
{
  "name": "Search and Rescue"
}
```

#### Update a Rescue Type

```http
PUT /api/rescue-types/{id}/
```

#### Delete a Rescue Type

```http
DELETE /api/rescue-types/{id}/
```

## Data Models

### Dog Model

Here's what a dog record looks like:

```python
{
    "id": "ObjectId (auto-generated)",
    "animal_id": "string (unique, required)",
    "name": "string (max 100 chars)",
    "breed": "ObjectId (reference to Breed, required)",
    "age_upon_outcome_in_weeks": "float",
    "color": "string (max 100 chars)",
    "sex_upon_outcome": "string (max 50 chars)",
    "outcome_type": "string (choices: Adoption, Transfer, Return to Owner, Euthanasia)",
    "rescue_type": "ObjectId (reference to RescueType, required)",
    "location_lat": "float",
    "location_long": "float",
    "created_at": "datetime (auto-generated)",
    "updated_at": "datetime (auto-updated)"
}
```

### Breed Model

Here's what a breed record looks like:

```python
{
    "id": "ObjectId (auto-generated)",
    "name": "string (unique, required, max 100 chars)",
    "created_at": "datetime (auto-generated)",
    "updated_at": "datetime (auto-updated)"
}
```

### RescueType Model

Here's what a rescue type record looks like:

```python
{
    "id": "ObjectId (auto-generated)",
    "name": "string (required, max 100 chars)",
    "created_at": "datetime (auto-generated)",
    "updated_at": "datetime (auto-updated)"
}
```

## Development Guide

### Project Structure

Here's how the backend code is organized:

```
backend/
├── api/                    # Django app
│   ├── models.py           # Database models
│   ├── serializers.py      # API serializers
│   ├── urls.py             # URL routing
│   ├── views/              # API views
│   │   ├── dogs_views.py   # Dog-related views
│   │   ├── breed_views.py  # Breed-related views
│   │   └── rescue_views.py # Rescue type views
│   └── tests.py            # Unit tests
├── backend/                # Django project settings
│   ├── settings.py         # Django settings
│   ├── urls.py             # Main URL configuration
│   └── wsgi.py             # WSGI configuration
├── load_data.py            # Data loading script
├── requirements.txt        # Python dependencies
└── README.md               # User Guide
```

### Best Practices for API Development

#### Error Handling

Here's how to handle errors gracefully:

```python
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        response.data['status_code'] = response.status_code
        response.data['message'] = str(exc)

    return response

# In settings.py
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'api.utils.custom_exception_handler',
}
```

#### Validation

Add custom validation to ensure data quality:

```python
# Custom validators
from rest_framework import serializers

def validate_age_upon_outcome_in_weeks(value):
    if value < 0:
        raise serializers.ValidationError("Age cannot be negative")
    if value > 1000:
        raise serializers.ValidationError("Age seems unrealistic")
    return value

class DogSerializer(serializers.ModelSerializer):
    age_upon_outcome_in_weeks = serializers.FloatField(
        validators=[validate_age_upon_outcome_in_weeks]
    )

    class Meta:
        model = Dog
        fields = '__all__'
```

#### Pagination

Control how many results are returned:

```python
# Custom pagination
from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    page_query_param = 'page'

# In views
class DogViewSet(viewsets.ModelViewSet):
    pagination_class = CustomPagination
    # ... other configurations
```

### Testing

#### Unit Tests

Here's how to write tests for your API:

```python
# api/tests.py
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Dog, Breed, RescueType

class DogAPITestCase(APITestCase):
    def setUp(self):
        self.breed = Breed(name="Labrador").save()
        self.rescue_type = RescueType(name="Water Rescue").save()
        self.dog = Dog(
            animal_id="A123456",
            name="Buddy",
            breed=self.breed,
            rescue_type=self.rescue_type
        ).save()

    def test_get_dogs(self):
        response = self.client.get('/api/dogs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_dog(self):
        data = {
            'animal_id': 'A789012',
            'name': 'Max',
            'breed': str(self.breed.id),
            'rescue_type': str(self.rescue_type.id)
        }
        response = self.client.post('/api/dogs/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
```

## Database Setup

### Installing MongoDB

**On macOS (using Homebrew):**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Lint:**

```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**On Windows:**
Download and install from the [MongoDB website](https://www.mongodb.com/try/download/community)

### Configuring the Database

**For Local MongoDB:**

```bash
# Connect to MongoDB
mongosh

# Create the database
use AAC

# Test the connection
db.runCommand({ping: 1})

# Check what collections exist
show collections
```

**For MongoDB Atlas (Cloud):**

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the settings in `backend/backend/settings.py`

### Environment Variables

Create a `.env` file in the `backend/` directory with these settings:

```bash
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=AAC
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password
DJANGO_SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Loading Data

#### Load Sample Data

```bash
cd backend
python load_data.py
```

#### Load Your Own Data

If you have your own data to load:

```python
# load_custom_data.py
import pandas as pd
from api.models import Dog, Breed, RescueType

def load_custom_data():
    # Read your CSV file
    df = pd.read_csv('your_data.csv')

    # Create breeds and rescue types
    breeds = {}
    rescue_types = {}

    for _, row in df.iterrows():
        # Create breed if it doesn't exist
        if row['breed'] not in breeds:
            breed = Breed(name=row['breed']).save()
            breeds[row['breed']] = breed

        # Create rescue type if it doesn't exist
        if row['rescue_type'] not in rescue_types:
            rescue_type = RescueType(name=row['rescue_type']).save()
            rescue_types[row['rescue_type']] = rescue_type

        # Create the dog record
        Dog(
            animal_id=row['animal_id'],
            name=row['name'],
            breed=breeds[row['breed']],
            rescue_type=rescue_types[row['rescue_type']],
            age_upon_outcome_in_weeks=row['age_weeks'],
            color=row['color'],
            sex_upon_outcome=row['sex'],
            outcome_type=row['outcome_type']
        ).save()

if __name__ == "__main__":
    load_custom_data()
```

## Troubleshooting

### Common Issues and Solutions

**If MongoDB won't connect:**

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Test the connection
mongosh

# Check the logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

**If Django gives you trouble:**

```bash
# Check your Django configuration
python manage.py check

# Reset the database if needed
python manage.py flush

# Check what packages are installed
pip list

# Run migrations
python manage.py makemigrations
python manage.py migrate
```

**If the API isn't working:**

```bash
# Test the API endpoints
curl http://localhost:8000/api/dogs/

# Check Django logs
python manage.py runserver --verbosity=2
```

### Performance Tips

**Database Optimization:**

```python
# Add indexes for fields you query frequently
class Dog(Document):
    # ... fields ...

    meta = {
        'collection': 'dogs',
        'indexes': [
            'animal_id',
            'name',
            'breed',
            'outcome_type',
            ('breed', 'outcome_type'),
            ('age_upon_outcome_in_weeks', 'outcome_type'),
        ]
    }
```

**Caching:**

```python
# Redis caching
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

**API Response Optimization:**

```python
# Only select the fields you need
class DogViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Dog.objects.only('name', 'breed', 'outcome_type')
```

## Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoEngine Documentation](https://docs.mongoengine.org/)
- [Django Documentation](https://docs.djangoproject.com/)

## API Documentation

### Interactive API Documentation

When you're running the development server, you can visit:

- **Django REST Framework Browsable API**: http://localhost:8000/api/
- **API Root**: http://localhost:8000/api/

### Postman Collection

If you use Postman for testing, you can import this collection:

```json
{
  "info": {
    "name": "Animal Shelter API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Dogs",
      "item": [
        {
          "name": "Get All Dogs",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/dogs/"
          }
        },
        {
          "name": "Create Dog",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/dogs/",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"animal_id\": \"A123456\",\n  \"name\": \"Buddy\",\n  \"breed\": \"{{breed_id}}\",\n  \"rescue_type\": \"{{rescue_type_id}}\"\n}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    }
  ]
}
```
