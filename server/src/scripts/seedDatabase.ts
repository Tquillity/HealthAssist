import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Routine from '../models/Routine';
import Recipe from '../models/Recipe';
import User from '../models/User';
import EducationalResource from '../models/EducationalResource';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/HA';

// Sample routines data
const sampleRoutines = [
  {
    title: 'Morning Breathwork',
    description:
      'Start your day with energizing breathwork to boost energy and focus',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    category: 'breathwork' as const,
    metadata: {
      context: 'morning' as const,
      energy: 'high' as const,
      duration: '5min' as const,
      difficulty: 'beginner' as const,
      equipment: [],
      tags: ['energy', 'focus', 'morning'],
    },
    instructions: {
      steps: [
        {
          step: 1,
          title: 'Find Comfortable Position',
          description: 'Sit or stand comfortably with spine straight',
          duration: '30 seconds',
        },
        {
          step: 2,
          title: 'Deep Breathing',
          description:
            'Take 10 deep breaths, inhaling for 4 counts, exhaling for 4 counts',
          duration: '2 minutes',
        },
        {
          step: 3,
          title: 'Energizing Breaths',
          description:
            'Take 5 quick, sharp inhales through nose, then one long exhale',
          duration: '1 minute',
        },
      ],
      tips: [
        'Keep shoulders relaxed',
        'Focus on the breath',
        'If you feel lightheaded, slow down',
      ],
      contraindications: ['Not recommended if you have respiratory issues'],
    },
    isActive: true,
    createdBy: 'system',
  },
  {
    title: 'Evening Meditation',
    description:
      'Calming meditation to wind down and prepare for restful sleep',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    category: 'meditation' as const,
    metadata: {
      context: 'evening' as const,
      energy: 'low' as const,
      duration: '15min' as const,
      difficulty: 'beginner' as const,
      equipment: [],
      tags: ['sleep', 'calm', 'evening', 'mindfulness'],
    },
    instructions: {
      steps: [
        {
          step: 1,
          title: 'Prepare Space',
          description: 'Find a quiet, comfortable space with dim lighting',
          duration: '1 minute',
        },
        {
          step: 2,
          title: 'Body Scan',
          description:
            'Slowly scan your body from head to toe, releasing tension',
          duration: '5 minutes',
        },
        {
          step: 3,
          title: 'Mindful Breathing',
          description:
            'Focus on your breath, letting thoughts pass without judgment',
          duration: '8 minutes',
        },
        {
          step: 4,
          title: 'Gratitude',
          description: "Think of three things you're grateful for today",
          duration: '1 minute',
        },
      ],
      tips: [
        'Use a meditation app if helpful',
        "Don't worry if your mind wanders",
        'Consistency is more important than perfection',
      ],
      contraindications: [],
    },
    isActive: true,
    createdBy: 'system',
  },
  {
    title: 'Quick Energy Boost',
    description: '5-minute routine to increase energy and alertness',
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    category: 'exercise' as const,
    metadata: {
      context: 'anytime' as const,
      energy: 'high' as const,
      duration: '5min' as const,
      difficulty: 'beginner' as const,
      equipment: [],
      tags: ['energy', 'quick', 'movement'],
    },
    instructions: {
      steps: [
        {
          step: 1,
          title: 'Jumping Jacks',
          description: '30 jumping jacks to get blood flowing',
          duration: '1 minute',
        },
        {
          step: 2,
          title: 'Arm Circles',
          description: 'Large arm circles forward and backward',
          duration: '1 minute',
        },
        {
          step: 3,
          title: 'Squats',
          description: '15 bodyweight squats',
          duration: '1 minute',
        },
        {
          step: 4,
          title: 'Stretching',
          description: 'Reach arms overhead and stretch side to side',
          duration: '2 minutes',
        },
      ],
      tips: [
        'Modify intensity based on your energy level',
        'Focus on form over speed',
        'Listen to your body',
      ],
      contraindications: ['Not recommended if you have joint issues'],
    },
    isActive: true,
    createdBy: 'system',
  },
];

// Sample recipes data
const sampleRecipes = [
  {
    name: 'Green Smoothie Bowl',
    description:
      'Nutritious and energizing smoothie bowl perfect for breakfast',
    imageUrl:
      'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400',
    ingredients: [
      { name: 'Banana', quantity: 1, unit: 'medium' },
      { name: 'Spinach', quantity: 1, unit: 'cup' },
      { name: 'Almond milk', quantity: 1, unit: 'cup' },
      { name: 'Chia seeds', quantity: 1, unit: 'tbsp' },
      { name: 'Honey', quantity: 1, unit: 'tsp' },
    ],
    instructions: [
      'Add all ingredients to blender',
      'Blend until smooth and creamy',
      'Pour into bowl and add toppings',
      'Serve immediately',
    ],
    nutrition: {
      calories: 250,
      protein: 8,
      carbs: 45,
      fat: 6,
      fiber: 12,
      sugar: 28,
      sodium: 120,
      perServing: true,
    },
    metadata: {
      category: 'breakfast' as const,
      cuisine: 'Healthy',
      difficulty: 'easy' as const,
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      tags: ['healthy', 'quick', 'vegetarian'],
      dietaryTags: ['vegetarian', 'gluten-free'],
    },
    isShared: true,
    householdId: 'sample_household',
    createdBy: 'system',
  },
  {
    name: 'Mediterranean Quinoa Bowl',
    description: 'Protein-rich quinoa bowl with fresh vegetables and herbs',
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    ingredients: [
      { name: 'Quinoa', quantity: 1, unit: 'cup' },
      { name: 'Cherry tomatoes', quantity: 1, unit: 'cup' },
      { name: 'Cucumber', quantity: 1, unit: 'medium' },
      { name: 'Red onion', quantity: 0.25, unit: 'cup' },
      { name: 'Feta cheese', quantity: 0.5, unit: 'cup' },
      { name: 'Olive oil', quantity: 2, unit: 'tbsp' },
      { name: 'Lemon juice', quantity: 1, unit: 'tbsp' },
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Dice cucumber and slice cherry tomatoes',
      'Thinly slice red onion',
      'Mix all vegetables with cooked quinoa',
      'Drizzle with olive oil and lemon juice',
      'Top with feta cheese and serve',
    ],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 10,
      fiber: 6,
      sugar: 8,
      sodium: 280,
      perServing: true,
    },
    metadata: {
      category: 'lunch' as const,
      cuisine: 'Mediterranean',
      difficulty: 'easy' as const,
      prepTime: 15,
      cookTime: 15,
      servings: 2,
      tags: ['healthy', 'protein', 'vegetarian'],
      dietaryTags: ['vegetarian', 'gluten-free'],
    },
    isShared: true,
    householdId: 'sample_household',
    createdBy: 'system',
  },
  {
    name: 'Grilled Salmon with Roasted Vegetables',
    description:
      'Healthy and flavorful salmon with seasonal roasted vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    ingredients: [
      { name: 'Salmon fillet', quantity: 4, unit: 'oz' },
      { name: 'Broccoli', quantity: 1, unit: 'cup' },
      { name: 'Sweet potato', quantity: 1, unit: 'medium' },
      { name: 'Olive oil', quantity: 2, unit: 'tbsp' },
      { name: 'Garlic', quantity: 2, unit: 'clove' },
      { name: 'Lemon', quantity: 0.5, unit: 'piece' },
      { name: 'Salt', quantity: 0.5, unit: 'tsp' },
      { name: 'Black pepper', quantity: 0.25, unit: 'tsp' },
    ],
    instructions: [
      'Preheat oven to 400°F (200°C)',
      'Cut sweet potato into cubes and broccoli into florets',
      'Toss vegetables with olive oil, garlic, salt, and pepper',
      'Roast vegetables for 20-25 minutes until tender',
      'Season salmon with salt, pepper, and lemon juice',
      'Grill salmon for 4-5 minutes per side',
      'Serve salmon over roasted vegetables',
    ],
    nutrition: {
      calories: 420,
      protein: 35,
      carbs: 25,
      fat: 18,
      fiber: 6,
      sugar: 8,
      sodium: 450,
      perServing: true,
    },
    metadata: {
      category: 'dinner' as const,
      cuisine: 'American',
      difficulty: 'medium' as const,
      prepTime: 15,
      cookTime: 30,
      servings: 1,
      tags: ['healthy', 'protein', 'omega-3'],
      dietaryTags: ['gluten-free', 'dairy-free'],
    },
    isShared: true,
    householdId: 'sample_household',
    createdBy: 'system',
  },
  {
    name: 'Overnight Oats',
    description:
      'Creamy and nutritious overnight oats perfect for busy mornings',
    imageUrl:
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    ingredients: [
      { name: 'Rolled oats', quantity: 0.5, unit: 'cup' },
      { name: 'Greek yogurt', quantity: 0.25, unit: 'cup' },
      { name: 'Almond milk', quantity: 0.5, unit: 'cup' },
      { name: 'Chia seeds', quantity: 1, unit: 'tbsp' },
      { name: 'Honey', quantity: 1, unit: 'tbsp' },
      { name: 'Berries', quantity: 0.5, unit: 'cup' },
      { name: 'Almonds', quantity: 1, unit: 'tbsp' },
    ],
    instructions: [
      'Mix oats, chia seeds, and yogurt in a jar',
      'Add almond milk and honey, stir well',
      'Cover and refrigerate overnight',
      'In the morning, top with berries and almonds',
      'Serve cold or at room temperature',
    ],
    nutrition: {
      calories: 320,
      protein: 15,
      carbs: 45,
      fat: 8,
      fiber: 10,
      sugar: 20,
      sodium: 80,
      perServing: true,
    },
    metadata: {
      category: 'breakfast' as const,
      cuisine: 'Healthy',
      difficulty: 'easy' as const,
      prepTime: 10,
      cookTime: 0,
      servings: 1,
      tags: ['healthy', 'make-ahead', 'fiber'],
      dietaryTags: ['vegetarian', 'gluten-free'],
    },
    isShared: true,
    householdId: 'sample_household',
    createdBy: 'system',
  },
  {
    name: 'Vegetable Stir Fry',
    description: 'Quick and colorful vegetable stir fry with tofu',
    imageUrl:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    ingredients: [
      { name: 'Tofu', quantity: 8, unit: 'oz' },
      { name: 'Bell peppers', quantity: 2, unit: 'medium' },
      { name: 'Broccoli', quantity: 1, unit: 'cup' },
      { name: 'Carrots', quantity: 2, unit: 'medium' },
      { name: 'Soy sauce', quantity: 3, unit: 'tbsp' },
      { name: 'Sesame oil', quantity: 1, unit: 'tbsp' },
      { name: 'Garlic', quantity: 3, unit: 'clove' },
      { name: 'Ginger', quantity: 1, unit: 'tbsp' },
      { name: 'Rice', quantity: 1, unit: 'cup' },
    ],
    instructions: [
      'Press and cube tofu, then pan-fry until golden',
      'Cut all vegetables into bite-sized pieces',
      'Heat sesame oil in a large wok or pan',
      'Add garlic and ginger, stir for 30 seconds',
      'Add vegetables and stir-fry for 5-7 minutes',
      'Add tofu and soy sauce, cook for 2 more minutes',
      'Serve over cooked rice',
    ],
    nutrition: {
      calories: 380,
      protein: 20,
      carbs: 45,
      fat: 12,
      fiber: 8,
      sugar: 12,
      sodium: 800,
      perServing: true,
    },
    metadata: {
      category: 'dinner' as const,
      cuisine: 'Asian',
      difficulty: 'easy' as const,
      prepTime: 15,
      cookTime: 15,
      servings: 2,
      tags: ['healthy', 'vegetarian', 'quick'],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
    },
    isShared: true,
    householdId: 'sample_household',
    createdBy: 'system',
  },
  {
    name: 'Greek Yogurt Parfait',
    description:
      'Layered parfait with Greek yogurt, granola, and fresh berries',
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    ingredients: [
      { name: 'Greek yogurt', quantity: 1, unit: 'cup' },
      { name: 'Granola', quantity: 0.25, unit: 'cup' },
      { name: 'Mixed berries', quantity: 0.5, unit: 'cup' },
      { name: 'Honey', quantity: 1, unit: 'tbsp' },
      { name: 'Almonds', quantity: 1, unit: 'tbsp' },
      { name: 'Chia seeds', quantity: 1, unit: 'tsp' },
    ],
    instructions: [
      'Layer half the yogurt in a glass or bowl',
      'Add half the berries and drizzle with honey',
      'Sprinkle with half the granola and chia seeds',
      'Repeat the layers',
      'Top with almonds and serve immediately',
    ],
    nutrition: {
      calories: 280,
      protein: 18,
      carbs: 35,
      fat: 8,
      fiber: 6,
      sugar: 25,
      sodium: 120,
      perServing: true,
    },
    metadata: {
      category: 'snack' as const,
      cuisine: 'Healthy',
      difficulty: 'easy' as const,
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      tags: ['healthy', 'protein', 'quick'],
      dietaryTags: ['vegetarian', 'gluten-free'],
    },
    isShared: true,
    householdId: 'sample_household',
    createdBy: 'system',
  },
  {
    name: 'Havrefrallor med russin (Batch)',
    description:
      'Glutenfria, mjuka frallor. Görs i stor batch för att säkra frukost/mellanmål (Infrastruktur). Måste svalna helt innan de skärs.',
    imageUrl:
      'https://images.unsplash.com/photo-1621262985392-3507d39162fa?w=400', // Generic gluten free bun image placeholder
    ingredients: [
      {
        name: 'Jäst (eller torrjäst)',
        quantity: 75,
        unit: 'g',
        notes: 'Eller 2 tsk torrjäst',
      },
      { name: 'Vatten', quantity: 2400, unit: 'g', notes: '30-37°C' },
      { name: 'Olja', quantity: 6, unit: 'msk' },
      { name: 'Havremjöl', quantity: 1050, unit: 'g' },
      {
        name: 'Fullkornsrismjöl',
        quantity: 600,
        unit: 'g',
        notes: 'Alt. bovete/durra',
      },
      { name: 'Psylliumhusk', quantity: 120, unit: 'g' },
      { name: 'Salt', quantity: 6, unit: 'tsk' },
      { name: 'Russin', quantity: 375, unit: 'g', notes: 'Valfritt' },
    ],
    instructions: [
      'Rör ut jästen i vattnet i en bunke (30-37°C). Tillsätt oljan.',
      'Mät upp och blanda alla torra ingredienser. Tillsätt till degvätskan och rör hastigt ihop till en slät smet. Blanda i russin.',
      'Vänta ca 10 min för att tillåta degen att svälla maximalt.',
      'Forma små bröd med fuktade händer eller klicka ut på plåt. Pudra med mjöl.',
      'Låt jäsa under bakduk 75-160 minuter (ska öka 30-40%).',
      'Värm ugnen till 225°C och grädda i 20-25 min.',
      'VIKTIGT: Låt svalna helt på galler innan du äter dem (annars klibbar de).',
    ],
    nutrition: {
      calories: 180, // Estimated per bun
      protein: 4,
      carbs: 35,
      fat: 3,
      fiber: 4,
      sugar: 5,
      sodium: 150,
      perServing: true,
    },
    metadata: {
      category: 'breakfast' as const, // Mapped to existing enums
      cuisine: 'Nordic/Health',
      difficulty: 'easy' as const,
      prepTime: 15, // Active time
      cookTime: 25, // Oven time
      servings: 36, // Using servings field for yield count as fallback
      tags: ['gluten-free', 'batch-cooking', 'infrastructure', 'freezable'],
      dietaryTags: ['gluten-free', 'vegan', 'dairy-free'],
    },
    // NEW LEAN FIELDS
    yield: {
      amount: 36,
      unit: 'st',
    },
    leanInfo: {
      batchEfficiency: 'High' as const,
      activeWorkTime: 15,
      passiveTime: 115, // 10 min swell + ~90 min rise + 15 min cooling buffer implies wait time
      leanRole: 'Infrastructure' as const,
    },
    isShared: true,
    householdId: 'sample_household',
    createdBy: 'system',
  },
  {
    name: 'Fröknäcke (Grundrecept)',
    description:
      'Glutenfritt, krispigt fröknäcke. Detta är bassatsen för en plåt. Håller mycket länge i skafferiet och är perfekt infrastruktur-mat.',
    imageUrl:
      'https://images.unsplash.com/photo-1596952202868-245bd122e269?w=400',
    ingredients: [
      { name: 'Solrosfrön', quantity: 1.5, unit: 'dl' },
      { name: 'Pumpafrön', quantity: 1.5, unit: 'dl' },
      { name: 'Sesamfrön', quantity: 1, unit: 'dl' },
      { name: 'Linfrön', quantity: 1, unit: 'dl' },
      { name: 'Maizena', quantity: 1, unit: 'dl' },
      { name: 'Majsmjöl', quantity: 1, unit: 'dl' },
      { name: 'Salt', quantity: 0.5, unit: 'tsk' },
      { name: 'Rapsolja', quantity: 1, unit: 'dl' },
      { name: 'Kokande vatten', quantity: 2, unit: 'dl' },
      {
        name: 'Flingsalt',
        quantity: 1,
        unit: 'nypa',
        notes: 'Att strö ovanpå',
      },
    ],
    instructions: [
      'Sätt ugnen på 160°C Varmluft.',
      'Blanda alla torra ingredienser (frön, maizena, majsmjöl, salt) i en bunke.',
      'Tillsätt rapsolja och det kokande vattnet. Rör om till en jämn smet.',
      'Häll ut smeten på en plåt klädd med bakplåtspapper.',
      'Tryck ut smeten tunt och jämnt över hela plåten (tips: lägg ett extra bakplåtspapper ovanpå och kavla/tryck ut för jämnhet).',
      'Strö över flingsalt.',
      'Grädda i ca 1 timme. Låt svalna helt innan du bryter i bitar.',
    ],
    nutrition: {
      // Estimated values per single batch/sheet
      calories: 2300, // Total for the whole sheet
      protein: 75,
      carbs: 160,
      fat: 175,
      fiber: 40,
      sugar: 0,
      sodium: 1500,
      perServing: false, // Values represent total yield (1 sheet)
    },
    metadata: {
      category: 'snack' as const,
      cuisine: 'Nordic',
      difficulty: 'easy' as const,
      prepTime: 10, // Active time for 1 sheet
      cookTime: 60,
      servings: 10, // Approx pieces per sheet
      tags: ['gluten-free', 'pantry-staple', 'infrastructure'],
      dietaryTags: ['gluten-free', 'vegan', 'dairy-free'],
    },
    // LEAN METRICS (Base Unit)
    yield: {
      amount: 1,
      unit: 'plåt',
    },
    leanInfo: {
      batchEfficiency: 'Medium' as const, // Efficiency increases when scaled up by software
      activeWorkTime: 10,
      passiveTime: 60,
      leanRole: 'Infrastructure' as const,
    },
    isShared: true,
    householdId: 'sample_household',
    createdBy: 'system',
  },
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

    // Create sample routines
    const routines = await Routine.insertMany(sampleRoutines);
    console.log(`Created ${routines.length} routines`);

    // Create sample recipes
    const recipes = await Recipe.insertMany(sampleRecipes);
    console.log(`Created ${recipes.length} recipes`);

    // Create sample educational resources
    const sampleEducationalResources = [
      {
        title: 'The Complete Guide to Mindful Eating',
        content: `
          <h2>What is Mindful Eating?</h2>
          <p>Mindful eating is the practice of being fully present and aware during meals. It involves paying attention to the colors, smells, flavors, and textures of your food, as well as your body's hunger and satiety cues.</p>
          
          <h3>Benefits of Mindful Eating</h3>
          <ul>
            <li>Improved digestion</li>
            <li>Better portion control</li>
            <li>Reduced emotional eating</li>
            <li>Increased satisfaction with meals</li>
            <li>Better relationship with food</li>
          </ul>
          
          <h3>How to Practice Mindful Eating</h3>
          <ol>
            <li>Eat without distractions (no TV, phone, or computer)</li>
            <li>Chew slowly and thoroughly</li>
            <li>Pay attention to hunger and fullness cues</li>
            <li>Notice the colors, smells, and textures of your food</li>
            <li>Express gratitude for your meal</li>
          </ol>
        `,
        excerpt:
          'Learn how to develop a healthier relationship with food through mindful eating practices that improve digestion, portion control, and overall satisfaction.',
        category: 'nutrition',
        tags: ['mindful eating', 'digestion', 'portion control', 'wellness'],
        difficulty: 'beginner',
        readTime: 8,
        author: 'Dr. Sarah Johnson',
        imageUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
        featured: true,
      },
      {
        title: '5-Minute Morning Meditation Routine',
        content: `
          <h2>Start Your Day with Intention</h2>
          <p>This simple 5-minute morning meditation routine will help you start your day with clarity, focus, and inner peace. Perfect for beginners and busy schedules.</p>
          
          <h3>The Routine</h3>
          <ol>
            <li><strong>Minute 1:</strong> Find a comfortable seated position and close your eyes</li>
            <li><strong>Minute 2:</strong> Take 10 deep breaths, focusing on the rise and fall of your chest</li>
            <li><strong>Minute 3:</strong> Body scan from head to toe, releasing any tension</li>
            <li><strong>Minute 4:</strong> Set an intention for your day</li>
            <li><strong>Minute 5:</strong> Slowly open your eyes and take three more deep breaths</li>
          </ol>
        `,
        excerpt:
          'A simple 5-minute morning meditation routine to start your day with clarity, focus, and inner peace. Perfect for beginners.',
        category: 'meditation',
        tags: ['meditation', 'morning routine', 'mindfulness', 'stress relief'],
        difficulty: 'beginner',
        readTime: 5,
        author: 'Mindful Living Institute',
        imageUrl:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        featured: true,
      },
      {
        title: 'Understanding Your Circadian Rhythm for Better Sleep',
        content: `
          <h2>What is Circadian Rhythm?</h2>
          <p>Your circadian rhythm is your body's internal 24-hour clock that regulates sleep-wake cycles, hormone production, and other physiological processes.</p>
          
          <h3>Tips to Align with Your Circadian Rhythm</h3>
          <ul>
            <li><strong>Morning Light:</strong> Get 10-30 minutes of natural sunlight within an hour of waking</li>
            <li><strong>Consistent Sleep Schedule:</strong> Go to bed and wake up at the same time every day</li>
            <li><strong>Evening Wind-Down:</strong> Dim lights 2-3 hours before bed</li>
            <li><strong>Blue Light Management:</strong> Avoid screens 1 hour before bed or use blue light filters</li>
          </ul>
        `,
        excerpt:
          "Learn how your body's internal clock affects sleep and discover practical strategies to align with your natural circadian rhythm for better rest.",
        category: 'sleep',
        tags: [
          'circadian rhythm',
          'sleep hygiene',
          'melatonin',
          'sleep schedule',
        ],
        difficulty: 'intermediate',
        readTime: 12,
        author: 'Sleep Science Institute',
        imageUrl:
          'https://images.unsplash.com/photo-1541781774459-1dcf1b4b0b8e?w=800&h=400&fit=crop',
        featured: true,
      },
    ];

    const educationalResources = await EducationalResource.insertMany(
      sampleEducationalResources
    );
    console.log(`Created ${educationalResources.length} educational resources`);

    // Create a sample user for testing
    const userEmail = process.env.SEED_USER_EMAIL || 'test@example.com';
    const userPassword = process.env.SEED_USER_PASSWORD || 'password123';
    const existingUser = await User.findOne({
      $or: [{ email: userEmail }, { username: 'testuser' }],
    });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userPassword, 12);
      const sampleUser = new User({
        username: 'testuser',
        email: userEmail,
        password: hashedPassword,
        householdId: 'sample_household',
        role: 'user',
        profile: {
          firstName: 'Test',
          lastName: 'User',
          timezone: 'UTC',
        },
        preferences: {
          energy: 'medium',
          preferredContext: 'anytime',
          routineDuration: '15min',
          dietaryRestrictions: [],
          healthGoals: ['energy', 'sleep'],
        },
      });
      await sampleUser.save();
      console.log(`Created sample user: ${userEmail} / ${userPassword}`);
    } else {
      // Update existing user with new password
      const hashedPassword = await bcrypt.hash(userPassword, 12);
      existingUser.email = userEmail;
      existingUser.password = hashedPassword;
      existingUser.role = 'user';
      await existingUser.save();
      console.log(`Updated sample user: ${userEmail} / ${userPassword}`);
    }

    // Create an admin user
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@healthhub.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { username: 'admin' }],
    });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const adminUser = new User({
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        householdId: 'admin_household',
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          timezone: 'UTC',
        },
        preferences: {
          energy: 'high',
          preferredContext: 'anytime',
          routineDuration: '30min',
          dietaryRestrictions: [],
          healthGoals: ['energy', 'sleep', 'fitness'],
        },
      });
      await adminUser.save();
      console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
    } else {
      // Update existing admin user with new password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      existingAdmin.email = adminEmail;
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`Updated admin user: ${adminEmail} / ${adminPassword}`);
    }

    console.log('Database seeding completed successfully!');
    console.log('\nSample user credentials:');
    console.log(`Email: ${userEmail}`);
    console.log(`Password: ${userPassword}`);
    console.log('\nAdmin user credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase();
