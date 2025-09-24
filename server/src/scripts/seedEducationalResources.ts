import mongoose from 'mongoose';
import EducationalResource from '../models/EducationalResource';
import dotenv from 'dotenv';

dotenv.config();

const sampleEducationalResources = [
  {
    title: "The Complete Guide to Mindful Eating",
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
      
      <h3>Getting Started</h3>
      <p>Start with one meal per day. Choose a quiet time when you can focus entirely on eating. Begin by taking three deep breaths before your first bite, and commit to eating without any distractions.</p>
    `,
    excerpt: "Learn how to develop a healthier relationship with food through mindful eating practices that improve digestion, portion control, and overall satisfaction.",
    category: "nutrition",
    tags: ["mindful eating", "digestion", "portion control", "wellness"],
    difficulty: "beginner",
    readTime: 8,
    author: "Dr. Sarah Johnson",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop",
    featured: true
  },
  {
    title: "5-Minute Morning Meditation Routine",
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
      
      <h3>Tips for Success</h3>
      <ul>
        <li>Choose a consistent time each morning</li>
        <li>Use a comfortable cushion or chair</li>
        <li>Don't judge your thoughts - just observe them</li>
        <li>Start with 2-3 minutes if 5 feels too long</li>
      </ul>
      
      <h3>Benefits</h3>
      <p>Regular morning meditation can reduce stress, improve focus, increase emotional regulation, and set a positive tone for your entire day.</p>
    `,
    excerpt: "A simple 5-minute morning meditation routine to start your day with clarity, focus, and inner peace. Perfect for beginners.",
    category: "meditation",
    tags: ["meditation", "morning routine", "mindfulness", "stress relief"],
    difficulty: "beginner",
    readTime: 5,
    author: "Mindful Living Institute",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    featured: true
  },
  {
    title: "Understanding Your Circadian Rhythm for Better Sleep",
    content: `
      <h2>What is Circadian Rhythm?</h2>
      <p>Your circadian rhythm is your body's internal 24-hour clock that regulates sleep-wake cycles, hormone production, and other physiological processes. Understanding and working with this natural rhythm can dramatically improve your sleep quality.</p>
      
      <h3>How Circadian Rhythm Works</h3>
      <p>The suprachiasmatic nucleus (SCN) in your brain acts as the master clock, responding to light and dark signals to regulate melatonin production. When it's dark, your body produces melatonin, making you sleepy. When it's light, melatonin production stops, making you alert.</p>
      
      <h3>Tips to Align with Your Circadian Rhythm</h3>
      <ul>
        <li><strong>Morning Light:</strong> Get 10-30 minutes of natural sunlight within an hour of waking</li>
        <li><strong>Consistent Sleep Schedule:</strong> Go to bed and wake up at the same time every day</li>
        <li><strong>Evening Wind-Down:</strong> Dim lights 2-3 hours before bed</li>
        <li><strong>Blue Light Management:</strong> Avoid screens 1 hour before bed or use blue light filters</li>
        <li><strong>Temperature:</strong> Keep your bedroom cool (65-68°F) for optimal sleep</li>
      </ul>
      
      <h3>Signs Your Circadian Rhythm is Off</h3>
      <ul>
        <li>Difficulty falling asleep or waking up</li>
        <li>Feeling tired during the day</li>
        <li>Irregular sleep patterns</li>
        <li>Mood changes or irritability</li>
      </ul>
    `,
    excerpt: "Learn how your body's internal clock affects sleep and discover practical strategies to align with your natural circadian rhythm for better rest.",
    category: "sleep",
    tags: ["circadian rhythm", "sleep hygiene", "melatonin", "sleep schedule"],
    difficulty: "intermediate",
    readTime: 12,
    author: "Sleep Science Institute",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-1dcf1b4b0b8e?w=800&h=400&fit=crop",
    featured: true
  },
  {
    title: "Stress Management Through Deep Breathing Techniques",
    content: `
      <h2>The Power of Breath</h2>
      <p>Breathing is the only autonomic function we can consciously control. By learning specific breathing techniques, you can activate your parasympathetic nervous system and reduce stress in real-time.</p>
      
      <h3>4-7-8 Breathing Technique</h3>
      <ol>
        <li>Inhale through your nose for 4 counts</li>
        <li>Hold your breath for 7 counts</li>
        <li>Exhale through your mouth for 8 counts</li>
        <li>Repeat 4-8 cycles</li>
      </ol>
      
      <h3>Box Breathing (4-4-4-4)</h3>
      <ol>
        <li>Inhale for 4 counts</li>
        <li>Hold for 4 counts</li>
        <li>Exhale for 4 counts</li>
        <li>Hold empty for 4 counts</li>
        <li>Repeat for 5-10 minutes</li>
      </ol>
      
      <h3>Diaphragmatic Breathing</h3>
      <p>Also known as belly breathing, this technique engages your diaphragm and promotes relaxation:</p>
      <ol>
        <li>Place one hand on your chest, one on your belly</li>
        <li>Breathe so only your belly hand moves</li>
        <li>Inhale slowly through your nose</li>
        <li>Exhale slowly through your mouth</li>
      </ol>
      
      <h3>When to Use These Techniques</h3>
      <ul>
        <li>Before important meetings or presentations</li>
        <li>During stressful situations</li>
        <li>When feeling anxious or overwhelmed</li>
        <li>As part of your daily stress prevention routine</li>
      </ul>
    `,
    excerpt: "Master powerful breathing techniques to manage stress in real-time. Learn the 4-7-8 method, box breathing, and diaphragmatic breathing for instant calm.",
    category: "stress-management",
    tags: ["breathing", "stress relief", "anxiety", "relaxation"],
    difficulty: "beginner",
    readTime: 7,
    author: "Dr. Michael Chen",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    featured: false
  },
  {
    title: "Building a Sustainable Exercise Routine",
    content: `
      <h2>Why Most Exercise Routines Fail</h2>
      <p>The key to a successful exercise routine isn't intensity or duration—it's consistency. Most people fail because they start too aggressively and burn out quickly.</p>
      
      <h3>The 80/20 Rule for Exercise</h3>
      <p>80% of your results come from 20% of your effort. Focus on:</p>
      <ul>
        <li><strong>Consistency over intensity:</strong> 20 minutes daily beats 2 hours once a week</li>
        <li><strong>Progressive overload:</strong> Gradually increase difficulty</li>
        <li><strong>Recovery:</strong> Rest days are as important as workout days</li>
        <li><strong>Enjoyment:</strong> Choose activities you actually like</li>
      </ul>
      
      <h3>Building Your Routine</h3>
      <h4>Week 1-2: Foundation (10-15 minutes daily)</h4>
      <ul>
        <li>Walking or light cardio</li>
        <li>Basic bodyweight exercises</li>
        <li>Stretching and mobility</li>
      </ul>
      
      <h4>Week 3-4: Progression (15-20 minutes daily)</h4>
      <ul>
        <li>Increase intensity gradually</li>
        <li>Add resistance training</li>
        <li>Include variety</li>
      </ul>
      
      <h4>Month 2+: Optimization (20-30 minutes daily)</h4>
      <ul>
        <li>Structured workouts</li>
        <li>Specific goals</li>
        <li>Periodization</li>
      </ul>
      
      <h3>Tips for Long-term Success</h3>
      <ul>
        <li>Start with just 5 minutes if needed</li>
        <li>Schedule exercise like any other appointment</li>
        <li>Prepare workout clothes the night before</li>
        <li>Track your progress</li>
        <li>Celebrate small wins</li>
      </ul>
    `,
    excerpt: "Learn how to build a sustainable exercise routine that you'll actually stick to. Discover the 80/20 rule and progressive approach to fitness.",
    category: "exercise",
    tags: ["fitness", "routine", "sustainability", "motivation"],
    difficulty: "beginner",
    readTime: 10,
    author: "Fitness Coach Maria",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    featured: false
  },
  {
    title: "Understanding Hormonal Health for Women",
    content: `
      <h2>The Complex World of Female Hormones</h2>
      <p>Women's health is deeply connected to hormonal balance throughout different life stages. Understanding these cycles can help you optimize your health, energy, and well-being.</p>
      
      <h3>Key Hormones and Their Functions</h3>
      <h4>Estrogen</h4>
      <ul>
        <li>Regulates menstrual cycle</li>
        <li>Maintains bone density</li>
        <li>Affects mood and energy</li>
        <li>Peaks during ovulation</li>
      </ul>
      
      <h4>Progesterone</h4>
      <ul>
        <li>Prepares body for pregnancy</li>
        <li>Promotes sleep and relaxation</li>
        <li>Balances estrogen effects</li>
        <li>Higher in luteal phase</li>
      </ul>
      
      <h4>Testosterone</h4>
      <ul>
        <li>Maintains muscle mass</li>
        <li>Supports bone health</li>
        <li>Affects libido and energy</li>
        <li>Peaks in early morning</li>
      </ul>
      
      <h3>Tracking Your Cycle</h3>
      <p>Understanding your menstrual cycle can help you:</p>
      <ul>
        <li>Optimize workout timing</li>
        <li>Plan important tasks</li>
        <li>Manage energy levels</li>
        <li>Identify hormonal imbalances</li>
      </ul>
      
      <h3>Signs of Hormonal Imbalance</h3>
      <ul>
        <li>Irregular periods</li>
        <li>Mood swings</li>
        <li>Weight changes</li>
        <li>Sleep disturbances</li>
        <li>Skin changes</li>
        <li>Low energy</li>
      </ul>
      
      <h3>Supporting Hormonal Health</h3>
      <ul>
        <li>Balanced nutrition with adequate protein and healthy fats</li>
        <li>Regular exercise (but not overtraining)</li>
        <li>Stress management</li>
        <li>Quality sleep</li>
        <li>Limiting alcohol and caffeine</li>
      </ul>
    `,
    excerpt: "A comprehensive guide to understanding female hormones, menstrual cycles, and how to support hormonal health for optimal well-being.",
    category: "hormones",
    tags: ["hormones", "menstrual cycle", "women's health", "hormonal balance"],
    difficulty: "intermediate",
    readTime: 15,
    author: "Dr. Lisa Rodriguez",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    featured: true
  }
];

const seedEducationalResources = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/HA';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing educational resources
    await EducationalResource.deleteMany({});
    console.log('Cleared existing educational resources');

    // Insert sample educational resources
    const resources = await EducationalResource.insertMany(sampleEducationalResources);
    console.log(`Created ${resources.length} educational resources`);

    console.log('Educational resources seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding educational resources:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding function if this file is executed directly
if (require.main === module) {
  seedEducationalResources();
}

export default seedEducationalResources;
