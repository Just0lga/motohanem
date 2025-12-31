const mongoose = require('mongoose');
const Model = require('./src/models/Model');
const Brand = require('./src/models/Brand');
require('dotenv').config();

async function reproduce() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle_app');
    console.log('Connected to MongoDB');

    // 1. Ensure Brand and Model exist
    let brand = await Brand.findOne({ name: 'Yamaha' });
    if (!brand) {
      brand = await Brand.create({ name: 'Yamaha', country: 'Japan' }); // Minimal fields
      console.log('Created Brand Yamaha');
    }

    let model = await Model.findOne({ model: 'MT-25' });
    if (!model) {
      model = await Model.create({ 
        model: 'MT-25', 
        brand: brand._id,
        brand_name: 'Yamaha',
        type: 'Naked',
        // Minimal required fields to satisfy Schema if strictly required, 
        // but checking Model.js shows only brand and model are strictly required (required: true).
      });
      console.log('Created Model MT-25');
    }

    // 2. Test Queries
    const queries = ['MT-25', 'mt-25', 'mt', 'mt25', 'mt2'];
    
    for (const q of queries) {
        // Imitate the NEW controller logic
        const cleanQuery = q.replace(/[^a-zA-Z0-9]/g, '');
        const regexPattern = cleanQuery.split('').join('[\\s-]*');
        const regex = new RegExp(regexPattern, 'i');
        
        const result = await Model.find({ model: { $regex: regex } });
        
        console.log(`Query: "${q}" -> Regex: "${regexPattern}" -> Matches: ${result.length}`);
        
        if (result.length === 0) {
            console.error(`FAILED: "${q}" should have matched MT-25`);
        }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

reproduce();
