const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with better error handling
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// Call the connect function
connectDB();

// Basic route to test the server
app.get('/', (req, res) => {
  res.json({ message: 'WorldWise API is running!' });
});

// City Model
const citySchema = new mongoose.Schema({
  cityName: { type: String, required: true },
  country: { type: String, required: true },
  emoji: String,
  date: { type: Date, default: Date.now },
  notes: String,
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

const City = mongoose.model('City', citySchema);

// Routes
// Get all cities
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await City.find().sort({ date: -1 });
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Error fetching cities', error: error.message });
  }
});

// Add a new city
app.post('/api/cities', async (req, res) => {
  try {
    const newCity = new City(req.body);
    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (error) {
    console.error('Error creating city:', error);
    res.status(400).json({ message: 'Error creating city', error: error.message });
  }
});

// Delete a city
app.delete('/api/cities/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({ message: 'City deleted successfully', city });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ message: 'Error deleting city', error: error.message });
  }
});

// Get a specific city
app.get('/api/cities/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json(city);
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ message: 'Error fetching city', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});