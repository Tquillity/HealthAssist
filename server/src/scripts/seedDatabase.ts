import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Routine from '../models/Routine';
import Recipe from '../models/Recipe';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/HA';

// Sample routines data
const sampleRoutines = [
  {
    title: 'Morning Breathwork',
    description: 'A gentle breathing exercise to start your day with energy and clarity.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    category: 'breathwork',
    metadata: {
      context: 'morning',
      energy: 'medium',
      duration: '5min',
      difficulty: 'beginner',
      equipment: [],
      tags: ['energy', 'focus', 'calm']
    },
    instructions: {
      steps: [
        {
          step: 1,
          title: 'Find a comfortable position',
          description: 'Sit or stand with your spine straight and shoulders relaxed.',
          duration: '30 seconds'
        },
        {
          step: 2,
          title: 'Inhale deeply',
          description: 'Breathe in slowly through your nose for 4 counts.',
          duration: '4 seconds'
        },
        {
          step: 3,
          title: 'Hold your breath',
          description: 'Hold the breath gently for 4 counts.',
          duration: '4 seconds'
        },
        {
          step: 4,
          title: 'Exhale slowly',
          description: 'Release the breath through your mouth for 6 counts.',
          duration: '6 seconds'
        }
      ],
      tips: [
        'Keep your shoulders relaxed throughout',
        'Focus on the rhythm of your breathing',
        'If you feel lightheaded, return to normal breathing'
      ],
      contraindications: [
        'Avoid if you have respiratory conditions',
        'Stop if you feel dizzy or uncomfortable'
      ]
    },
    createdBy: 'system'
  },
  {
    title: 'Evening Meditation',
    description: 'A calming meditation practice to wind down and prepare for restful sleep.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    category: 'meditation',
    metadata: {
      context: 'evening',
      energy: 'low',
      duration: '15min',
      difficulty: 'beginner',
      equipment: [],
      tags: ['sleep', 'relaxation', 'mindfulness']
    },
    instructions: {
      steps: [
        {
          step: 1,
          title: 'Prepare your space',
          description: 'Find a quiet, comfortable place where you won\'t be disturbed.',
          duration: '1 minute'
        },
        {
          step: 2,
          title: 'Settle into position',
          description: 'Sit comfortably with your back straight or lie down if preferred.',
          duration: '1 minute'
        },
        {
          step: 3,
          title: 'Body scan',
          description: 'Slowly scan your body from head to toe, releasing tension.',
          duration: '5 minutes'
        },
        {
          step: 4,
          title: 'Focus on breathing',
          description: 'Gently focus on your natural breathing rhythm.',
          duration: '8 minutes'
        }
      ],
      tips: [
        'Dim the lights to signal to your body it\'s time to rest',
        'Use a meditation app or timer if helpful',
        'Don\'t judge your thoughts, just observe them'
      ],
      contraindications: []
    },
    createdBy: 'system'
  },
  {
    title: 'Energy Boost Stretches',
    description: 'Quick stretching routine to increase energy and improve circulation.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    category: 'stretching',
    metadata: {
      context: 'anytime',
      energy: 'high',
      duration: '10min',
      difficulty: 'beginner',
      equipment: [],
      tags: ['energy', 'flexibility', 'circulation']
    },
    instructions: {
      steps: [
        {
          step: 1,
          title: 'Neck rolls',
          description: 'Gently roll your head in slow circles, both directions.',
          duration: '1 minute'
        },
        {
          step: 2,
          title: 'Shoulder shrugs',
          description: 'Lift shoulders to ears, hold, then release.',
          duration: '1 minute'
        },
        {
          step: 3,
          title: 'Arm circles',
          description: 'Extend arms and make large circles forward and backward.',
          duration: '2 minutes'
        },
        {
          step: 4,
          title: 'Spinal twists',
          description: 'Sit and gently twist your spine left and right.',
          duration: '2 minutes'
        },
        {
          step: 5,
          title: 'Leg stretches',
          description: 'Stand and gently stretch your legs and calves.',
          duration: '4 minutes'
        }
      ],
      tips: [
        'Move slowly and mindfully',
        'Stop if you feel any pain',
        'Breathe deeply throughout'
      ],
      contraindications: [
        'Avoid if you have recent injuries',
        'Modify movements if you have mobility limitations'
      ]
    },
    createdBy: 'system'
  }
];

// Sample recipes data
const sampleRecipes = [
  {
    name: 'Quinoa Power Bowl',
    description: 'A nutritious and energizing breakfast bowl packed with protein and fiber.',
    imageUrl: 'https://images.unsplash.com/photo-1511690743698-d9d7f3f4c6f9?w=400',
    ingredients: [
      { name: 'Quinoa', quantity: 1, unit: 'cup', notes: 'cooked' },
      { name: 'Greek yogurt', quantity: 0.5, unit: 'cup' },
      { name: 'Blueberries', quantity: 0.5, unit: 'cup' },
      { name: 'Almonds', quantity: 2, unit: 'tbsp', notes: 'chopped' },
      { name: 'Honey', quantity: 1, unit: 'tbsp' },
      { name: 'Chia seeds', quantity: 1, unit: 'tsp' }
    ],
    instructions: [
      'Cook quinoa according to package instructions and let cool',
      'Mix quinoa with Greek yogurt in a bowl',
      'Top with blueberries, almonds, and chia seeds',
      'Drizzle with honey and serve'
    ],
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 45,
      fat: 8,
      fiber: 6,
      sugar: 12,
      sodium: 120,
      perServing: true
    },
    metadata: {
      category: 'breakfast',
      cuisine: 'Healthy',
      difficulty: 'easy',
      prepTime: 10,
      cookTime: 15,
      servings: 1,
      tags: ['protein', 'fiber', 'antioxidants'],
      dietaryTags: ['vegetarian', 'gluten-free']
    },
    isShared: true,
    householdId: 'sample-household',
    createdBy: 'system'
  },
  {
    name: 'Mediterranean Salmon',
    description: 'Light and healthy salmon with Mediterranean flavors.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    ingredients: [
      { name: 'Salmon fillet', quantity: 6, unit: 'oz' },
      { name: 'Olive oil', quantity: 2, unit: 'tbsp' },
      { name: 'Lemon', quantity: 1, unit: 'whole', notes: 'juiced' },
      { name: 'Garlic', quantity: 2, unit: 'cloves', notes: 'minced' },
      { name: 'Oregano', quantity: 1, unit: 'tsp', notes: 'dried' },
      { name: 'Cherry tomatoes', quantity: 1, unit: 'cup', notes: 'halved' },
      { name: 'Kalamata olives', quantity: 0.25, unit: 'cup', notes: 'pitted' }
    ],
    instructions: [
      'Preheat oven to 400°F (200°C)',
      'Mix olive oil, lemon juice, garlic, and oregano in a bowl',
      'Place salmon on a baking sheet and brush with the mixture',
      'Surround with tomatoes and olives',
      'Bake for 12-15 minutes until salmon flakes easily',
      'Serve immediately'
    ],
    nutrition: {
      calories: 280,
      protein: 35,
      carbs: 8,
      fat: 12,
      fiber: 2,
      sugar: 4,
      sodium: 380,
      perServing: true
    },
    metadata: {
      category: 'dinner',
      cuisine: 'Mediterranean',
      difficulty: 'easy',
      prepTime: 10,
      cookTime: 15,
      servings: 1,
      tags: ['omega-3', 'protein', 'antioxidants'],
      dietaryTags: ['gluten-free', 'dairy-free']
    },
    isShared: true,
    householdId: 'sample-household',
    createdBy: 'system'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Routine.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample routines
    const routines = await Routine.insertMany(sampleRoutines);
    console.log(`Inserted ${routines.length} routines`);

    // Insert sample recipes
    const recipes = await Recipe.insertMany(sampleRecipes);
    console.log(`Inserted ${recipes.length} recipes`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase();
