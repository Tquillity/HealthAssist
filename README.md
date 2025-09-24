# HealthAssist

A comprehensive Progressive Web App (PWA) designed as a centralized health and food database for personalized wellness management. This application consolidates best practices across nutrition, sleep hygiene, meditation, exercise, and other health domains.

## Features

### MVP (V1) - Core Functionality
- **Personalized User Profiles**: Household-linked accounts with selective data sharing
- **Routine Database & Todo-Lottery**: Graphical routine cards with random selection based on preferences
- **Recipe Database**: User-contributed recipes with nutritional information
- **Automated Meal Planning**: Weekly meal plan generation with household sharing
- **Offline Accessibility**: Basic caching for core functionality
- **PWA Support**: Installable on mobile devices and desktop

### Planned Features (V2-V4)
- Mood and energy journaling
- Progress tracking and analytics
- Educational resources section
- Goal setting and milestones
- Hormone cycle tracking
- Smart pantry management
- AI-powered insights (Grok API integration)

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Framer Motion for animations
- PWA capabilities

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- RESTful API design
- TypeScript throughout

## Project Structure

```
HA/
├── client/                 # React frontend
│   ├── public/
│   │   ├── manifest.json   # PWA manifest
│   │   └── sw.js          # Service worker
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── types/         # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
└── server/                 # Node.js backend
    ├── src/
    │   ├── controllers/    # Route controllers
    │   ├── models/         # Database models
    │   ├── routes/         # API routes
    │   ├── middleware/     # Custom middleware
    │   └── scripts/        # Database seeding
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HA
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit the .env file with your configuration
   nano server/.env
   ```

4. **Configure MongoDB**
   - For local development: Ensure MongoDB is running locally
   - For production: Use MongoDB Atlas connection string

5. **Seed the database** (optional)
   ```bash
   cd server
   npm run build
   node dist/scripts/seedDatabase.js
   ```

### Development

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the frontend client**
   ```bash
   cd client
   npm start
   ```
   Client will run on http://localhost:3000

### Production Build

1. **Build the backend**
   ```bash
   cd server
   npm run build
   npm start
   ```

2. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Routines
- `GET /api/routines` - Get all routines (with filtering)
- `GET /api/routines/:id` - Get routine by ID
- `POST /api/routines/lottery` - Random routine selection
- `GET /api/routines/meta/categories` - Get filter metadata

### Recipes
- `GET /api/recipes` - Get all recipes (with filtering)
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Meal Plans
- `GET /api/meal-plans` - Get meal plans
- `POST /api/meal-plans/generate` - Generate new meal plan
- `GET /api/meal-plans/:id/grocery-list` - Get grocery list

## Database Models

### User
- Personal information and preferences
- Household association
- Authentication data

### Routine
- Wellness routine details
- Metadata for filtering (context, energy, duration)
- Step-by-step instructions

### Recipe
- Recipe information and ingredients
- Nutritional data
- Dietary tags and categories

### MealPlan
- Weekly meal planning
- Household preferences
- Grocery list generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

### Phase 1: MVP (Current)
- [x] Project setup and structure
- [x] Database models and API
- [x] Authentication system
- [x] Basic frontend components
- [x] Routine lottery system
- [ ] Recipe management
- [ ] Meal planning
- [ ] PWA configuration

### Phase 2: Enhanced Features
- [ ] User journaling
- [ ] Progress tracking
- [ ] Educational resources
- [ ] Goal setting

### Phase 3: Advanced Features
- [ ] Analytics dashboard
- [ ] External integrations
- [ ] Hormone tracking
- [ ] Smart recommendations

### Phase 4: AI Integration
- [ ] Grok API integration
- [ ] Personalized insights
- [ ] Advanced analytics
- [ ] Predictive features

## Support

For questions or support, please open an issue in the repository or contact the development team.
