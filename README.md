# Animal Shelter Management System

A Django-based API for managing animal shelter data with MongoDB integration.

## Project Structure

```
project-root/
│
├── backend/          # Django backend API
│   ├── api/         # Django app with models, views, serializers
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views/
│   │       ├── dogs_views.py
│   │       ├── breed_views.py
│   │       └── rescue_views.py
│   ├── backend/     # Django project settings
│   ├── load_data.py # Data loading script
│   └── requirements.txt
├── aac_shelter_outcomes.csv  # CSV data file
└── README.md
```

## Prerequisites

- **Python**: Version 3.10+
- **Node.js**: Version 16+ (if frontend is included)
- **MongoDB**: Local or cloud instance (Atlas)
- **Git**: Installed for cloning repository

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

### 3. Activate Virtual Environment

**Mac/Linux:**

```bash
source venv/bin/activate
```

**Windows:**

```bash
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Check Django Configuration

```bash
python manage.py check
```

### 6. Run Migrations

```bash
python manage.py migrate
```

## MongoDB Setup

### Install MongoDB Community Edition

**macOS (using Homebrew):**

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

### Create Database and Collections

1. **Connect to MongoDB:**

```bash
mongosh
```

2. **Create and use database:**

```javascript
use AAC
```

3. **Create collections (optional - will be created automatically when data is inserted):**

```javascript
db.createCollection("dogs");
db.createCollection("breeds");
db.createCollection("rescue_types");
```

4. **Verify collections:**

```javascript
show collections
```

5. **Exit MongoDB shell:**

```javascript
exit;
```

### Environment Configuration (Optional)

Since the default configuration uses local MongoDB, a `.env` file is not required.

If needed, you can create a `.env` file in the `backend/` directory to customize settings:

```bash
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=AAC
MONGO_USERNAME=
MONGO_PASSWORD=
```

## Data Loading

### 1. Load Data

The CSV file is already located in the project root, so it can be used as is.

```bash
cd backend
python load_data.py
```

**Note**: `load_data.py` references `../aac_shelter_outcomes.csv`, so the CSV file must be placed in the project root.

## Running the Backend Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## API Endpoints

- `GET /api/dogs/` - List all dogs
- `GET /api/breeds/` - List all breeds
- `GET /api/rescue-types/` - List all rescue types

**Base URL**: `http://localhost:8000/api/`

## Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running:**

```bash
# macOS
brew services list | grep mongodb
```

2. **Test MongoDB connection:**

```bash
mongosh
# or
mongo
```

3. **Check MongoDB logs:**

```bash
# macOS
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Django Issues

1. **Check Django settings:**

```bash
python manage.py check
```

2. **Reset database (if needed):**

```bash
python manage.py flush
```

3. **Check installed packages:**

```bash
pip list
```

## Development

### Adding New Models

1. Create models in `backend/api/models.py`
2. Run migrations: `python manage.py makemigrations`
3. Apply migrations: `python manage.py migrate`

### API Development

- Views are in `backend/api/views/`
  - `dogs_views.py` - Dog-related views
  - `breed_views.py` - Breed-related views
  - `rescue_views.py` - Rescue type views
- Serializers are in `backend/api/serializers.py`
- URLs are configured in `backend/api/urls.py`
- Models are in `backend/api/models.py`
