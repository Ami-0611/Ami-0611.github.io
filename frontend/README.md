# Frontend User Guide - Animal Shelter Management System

A comprehensive guide for using and developing the React.js frontend application for the Animal Shelter Management System.

## Getting Started

Make sure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Latest version

### Setting Up the Frontend

Here's how to get the React.js application running on your local machine:

```bash
# Navigate to the frontend directory
cd frontend

# Install all the required packages
npm install

# Start the development server
npm start
```

Once everything is set up, you can access the application at `http://localhost:3000`

## User Guide

### Understanding the Dashboard

The frontend application gives you three main ways to view and work with your data, accessible through at the top of main data display area:

1. **Dashboard(Data List)** - The main data table showing all dogs
2. **Statistics** - Charts and analytics about your data
3. **Map** - A geographic view of where dogs are located

### Main Dashboard Features

#### Working with the Data Table

The main table is where you'll spend most of your time. Here's what you can do:

- **Sorting**: Click on any column header to sort by that field
  - You can sort by Name, Breed, Age, Color, Sex, Outcome, or Rescue Type
  - Click again to switch between ascending and descending order
- **Pagination**: When you have lots of data, use the page controls to navigate through it
- **Filter Search**: Type in the search box to filter data as you type
- **Responsive Design**: The interface works well on desktop, tablet, and mobile devices

#### Interactive Features

The dashboard is designed to be interactive and user-friendly:

- **View Details**: Click the "View" button to see detailed information about any dog
- **Add New Dog**: Use the "Add Dog" button to create new records
- **Edit Records**: Modify existing data through the detail modal that pops up
- **Delete Records**: Remove records with a confirmation dialog to prevent accidents
- **Manage Breeds**: Add, edit, and delete dog breeds from the breed management section
- **Manage Rescue Types**: Create and modify rescue type categories as needed

### Statistics Dashboard

#### Overview Cards

At the top of the statistics page, you'll see key numbers:

- **Total Dogs**: The complete count of all dogs in the system(If filter data, that number shows up)
- **Adoptions**: Number of dogs that were successfully adopted
- **Return to Owner**: Number of dogs returned to their original owners
- **Unique Breeds**: Count of different dog breeds in the system

#### Detailed Analytics

Dive deeper into your data with these analytics:

- **Age Distribution**: A visual breakdown showing how dogs are distributed by age groups
- **Sex Distribution**: Statistics comparing male vs female dogs
- **Top 10 Breeds**: Which breeds are most common, with exact counts
- **Outcome Distribution**: How many dogs were adopted, transferred, returned to owners, etc.

#### Interactive Charts

- **Progress Bars**: Check Percentage

### Map View

#### Geographic Features

The map view helps you understand where dogs are located:

- **Interactive Markers**: Click on any marker to view details about that dog
- **Location Clustering**: When there are many dogs in one area, markers are grouped together for better visibility
- **Zoom Controls**: Navigate through different zoom levels to see more or less detail
- **Search by Location**: Find dogs in specific areas or neighborhoods

#### Map Controls

The map comes with several useful controls:

- **Satellite View**: Switch between regular map view and satellite imagery
- **Street View**: Get detailed street-level information when available
- **Fullscreen Mode**: Immerse yourself in the map view
- **Location Sharing**: Share specific locations with others

### Filter System

The filter system helps you find exactly what you're looking for:

#### Age Filter

You can filter dogs by their age:

- **Young**: 6 months to 2 years old
- **Adult**: 2-7 years old
- **Senior**: 7+ years old

#### Color Filter

Find dogs by their color:

- **Single Colors**: Black, Brown, White, Red, and many others

#### Sex Filter

Filter by the dog's sex and neutering status:

- **Male (Neutered)**: Neutered male dogs
- **Male (Intact)**: Intact male dogs
- **Female (Spayed)**: Spayed female dogs
- **Female (Intact)**: Intact female dogs

#### Outcome Filter

See dogs based on their outcome:

- **Adoption**: Successfully adopted dogs
- **Transfer**: Dogs transferred to other facilities
- **Return to Owner**: Dogs returned to their original owners
- **Euthanasia**: Dogs that were euthanized
- **Other**: Miscellaneous outcomes

#### Breed Filter

Find specific breeds:

- **Search Breeds**: Quick access to the most breeds

#### Rescue Type Filter

Filter by the type of rescue work:

- **Water Rescue**: Dogs trained for water rescue operations
- **Mountain Rescue**: Dogs trained for mountain rescue
- **Disaster Rescue**: Dogs trained for disaster response
- **Add New Rescue**: Original Rescue Type

### Management Data

Managing your data of Breed and Resque Type

#### Breed Management

You can manage breed information:

- **Add New Breed**: Create new breed entries in the system
- **Edit Breeds**: Modify existing breed information
- **Delete Breeds**: Remove breeds that are no longer needed

#### Rescue Type Management

Manage different types of rescue operations:

- **Add Rescue Types**: Create new rescue type categories
- **Edit Types**: Modify rescue type descriptions
- **Delete Types**: Remove unused rescue types

## Development Guide

### Project Structure

Here's how the frontend code is organized:

```
frontend/
├── public/                 # Static files
│   ├── index.html          # Main HTML file
│   └── favicon.ico         # App icon
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── DogList.jsx     # Data table component
│   │   ├── FilterPanel.jsx # Filter controls
│   │   ├── Header.jsx      # Navigation header
│   │   └── ...             # Other components
│   ├── context/            # State management
│   │   └── DataContext.jsx # Global state
│   ├── pages/              # Page components
│   │   └── MainPage.jsx    # Main page layout
│   ├── services/           # API services
│   │   └── api.js          # API communication
│   ├── App.js              # Main app component
│   └── index.js            # App entry point
├── package.json            # Dependencies
└── README.md               # This file
```

## Troubleshooting

### Common Issues and Solutions

#### Build Errors

If you're having trouble building the application:

```bash
# Clear the cache and reinstall everything
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Issues

When the frontend isn't able to reach the backend something like:

- Make sure the backend server is running
- Check that the API URL is correct in your environment variables
- Verify that CORS is properly configured on the backend

#### Performance Issues

If the application seems slow:

- Use React DevTools Profiler to find bottlenecks
- Add support for component memoization for costly components
- Bundle size optimization with code splitting

### Debug Tools

#### React DevTools

The React DevTools browser extension is very helpful:

- Add the extension to your browser
- Use the Profiler to analyze performance
- Check the component structure to see how components are being organized

#### Network Tab

The browser's Network tab can help you debug API issues:

- Monitor API requests to see what's being sent and received
- Check response times to identify slow requests
- Debug CORS issues by looking at request headers

## Additional Resources

- [React.js Documentation](https://reactjs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/docs)
- [React Context API](https://reactjs.org/docs/context.html)
