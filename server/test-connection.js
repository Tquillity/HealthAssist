const { MongoClient, ServerApiVersion } = require('mongodb');

// Test with your current credentials
const uri = "mongodb+srv://mikaelsundh:Moppemurse1!@cluster0.vcec5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    console.log('Testing MongoDB connection...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Test database access
    const db = client.db('HA');
    const collections = await db.listCollections().toArray();
    console.log('✅ Database access confirmed');
    console.log('Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    if (error.code === 8000) {
      console.log('\n🔧 Authentication failed. Please check:');
      console.log('1. Username and password in MongoDB Atlas');
      console.log('2. User permissions (should be "Read and write to any database")');
      console.log('3. Network access (your IP should be whitelisted)');
    }
  } finally {
    await client.close();
  }
}

testConnection();
