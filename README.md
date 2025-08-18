# CS 499 Final Project - Animal Shelter Management System

Full-Stack Web app created with React for managing animal shelter data. React frontend and a Django REST API backend with an integration to MongoDB.

## Project Overview

This project turns a simple Jupyter notebook dashboard into a modern deployable web application. The enhancement showcases:

- **Software Design & Engineering**: React.js frontend with Django REST API backend
- **Algorithms & Data Structures**: Efficient sorting, filtering, and pagination algorithms
- **Database Design**: MongoDB integration with MongoEngine ODM

## Project Structure

```
CS499/
├── index.html                    # Portfolio website
├── README.md                     # **This file (Setup Guide)**
├── aac_shelter_outcomes.csv      # **Test data **
├── originals/                    # Original artifacts
│   ├── ProjectTwoDashboard.ipynb # Original Dash/Plotly dashboard
│   ├── animal_shelter.py         # Basic MongoDB CRUD class
│   └── aac_shelter_outcomes.csv  # Data source
├── frontend/                     # React.js application
│   ├── README.md                 # **Frontend User Guide**
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── context/              # State management
│   │   ├── pages/                # Page components
│   │   └── services/             # API services
│   ├── package.json
│   └── public/
├── backend/                      # Django REST API
│   ├── README.md                 # **Backend User Guide**
│   ├── api/                      # Django app
│   │   ├── models.py             # Database models
│   │   ├── serializers.py        # API serializers
│   │   ├── urls.py               # URL routing
│   │   └── views/                # API views
│   ├── backend/                  # Django settings
│   ├── load_data.py              # Test Data loading script
│   └── requirements.txt          # Python dependencies
└── docs/                         # Project documentation
    ├── CS 499 Module One Assignment Ami Akagi.docx
    ├── 3-2 Milestone Two_ Enhancement One_ Software Design and Engineering.docx
    ├── 4-2 Milestone Three Narrative.docx
    └── 5-2 Milestone Four_ Enhancement Three_ Databases.docx
```

## Getting Started

### What You'll Need

Make sure you have the following installed on your system:

- **Python**: Version 3.8 or higher
- **Node.js**: Version 18 or higher
- **MongoDB**: Either a local installation or cloud instance
- **Git**: For cloning the repository

### Step 1: Get the Code

First, clone the repository to your local machine:

```bash
git clone https://github.com/Ami-0611/CS499.git
cd CS499
```

### Step 2: Set Up the Backend

The backend is a Django REST API that handles all the data operations. Here's how to get it running:

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
# **Test Data**
python load_data.py

# Start the development server
python manage.py runserver
```

### Step 3: Set Up the Frontend

The frontend is a React.js application that provides the user interface. Here's how to get it running:

```bash
# Navigate to the frontend directory
cd frontend

# Install all the required Node.js packages
npm install

# Start the development server
npm start
```

### Step 4: Access Application

Once both servers are running, you can access:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Portfolio Website**: Open `index.html` in your browser

## Documentation

### User Guides

For detailed instructions on how to use the application:

- **[Frontend User Guide](frontend/README.md)** - Everything you need to know about using the React.js application
- **[Backend User Guide](backend/README.md)** - Complete guide for working with the Django REST API

### API Documentation

- **Interactive API Browser**: http://localhost:8000/api/ (when the backend is running)
- **API Endpoints Reference**: See the [Backend User Guide](backend/README.md#api-endpoints) for detailed endpoint documentation

## MongoDB Setup

### Creating MongoDB Username and Password

If you don't know how to create a MongoDB username and password, follow these steps:

#### **Step 1: Install MongoDB (if not already installed)**

**For macOS (using Homebrew):**

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

**For Windows:**

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service and start automatically

**For Linux:**

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### **Step 2: Connect to MongoDB**

**Open MongoDB shell:**

```bash
# Connect to MongoDB (no authentication required initially)
mongosh
```

#### **Step 3: Create Database and User**

Once you're in the MongoDB shell, run these commands:

```javascript
// Switch to admin database
use admin

// Create a new database for your project
use AAC

// Create a user for your application
db.createUser({
  user: "aacuser", // this is your_mongo_username
  pwd: "Password123", // this is your_mongo_password
  roles: [
    { role: "readWrite", db: "AAC" },
    { role: "dbAdmin", db: "AAC" }
  ]
})

// Test the connection
db.auth("aacuser", "Password123")

// Exit MongoDB shell
exit
```

#### **Step 4: Enable Authentication**

**For macOS/Linux:**

```bash
# Stop MongoDB
brew services stop mongodb/brew/mongodb-community

# Edit MongoDB configuration
sudo nano /usr/local/etc/mongod.conf
```

**For Windows:**

1. Open MongoDB Compass or edit the configuration file manually
2. The config file is usually at: `C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg`

**Add authentication to config file:**

```yaml
security:
  authorization: enabled
```

**Restart MongoDB:**

```bash
# macOS/Linux
brew services start mongodb/brew/mongodb-community

# Windows: Restart MongoDB service from Services
```

#### **Step 5: Test Your Connection**

```bash
# Connect with authentication
mongosh -u aacuser -p Password123 --authenticationDatabase AAC
```

#### **Alternative: Quick Setup (No Authentication)**

If you want to skip authentication for development:

1. **Don't create any users**
2. **Don't enable authentication**
3. **Use these settings in your .env file:**

```bash
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=AAC
MONGO_USERNAME=
MONGO_PASSWORD=
```

#### **Troubleshooting**

**If you get "Authentication failed":**

```bash
# Check if user exists
mongosh
use AAC
db.getUsers()
```

**If MongoDB won't start:**

```bash
# Check MongoDB status
brew services list | grep mongodb

# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

**If you can't connect:**

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Check port 27017
lsof -i :27017
```

### Environment Variables

Create a `.env` file in the `backend/` directory with these settings:

```bash
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=AAC
MONGO_USERNAME=your_mongo_username
MONGO_PASSWORD=your_mongo_password
```

## Deployment

### Deploying the Backend to Heroku

1. **Create a new Heroku app:**

```bash
heroku create your-app-name
```

2. **Add MongoDB to your app:**

```bash
heroku addons:create mongolab:sandbox
```

3. **Deploy your code:**

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Deploying the Frontend to Netlify

1. **Build the production version:**

```bash
cd frontend
npm run build
```

2. **Deploy to Netlify:**

- Simply drag the `build/` folder to Netlify, or
- Connect your GitHub repository for automatic deployments

## Troubleshooting

### Common Issues and Solutions

**If MongoDB won't connect:**

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Test the connection
mongosh
```

**If Django gives you trouble:**

```bash
# Check your Django configuration
python manage.py check

# Reset the database if needed
python manage.py flush
```

**If React isn't working:**

```bash
# Clear the npm cache
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### Performance Tips

**For the Backend:**

- Create database indexes on frequently queried fields
- Cache API responses
- Implement large dataset based pagination

**For the Frontend:**

- Use component memoization for expensive components
- Implement lazy loading for large components
- Optimize images and other assets

## Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React.js Documentation](https://reactjs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## About the Author

**Ami Akagi** - CS 499 Final Project

- Southern New Hampshire University
- Computer Science Capstone

## License

This project was created for educational purposes as part of the CS 499 Final Project at Southern New Hampshire University.
