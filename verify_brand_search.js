const mongoose = require('mongoose');
const Model = require('./src/models/Model');
const Brand = require('./src/models/Brand');
require('dotenv').config();

async function verify() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle_app');
    console.log('Connected to MongoDB');

    // 1. Ensure Brand and Model exist
    let brand = await Brand.findOne({ name: 'Yamaha' });
    if (!brand) {
        // Ensure name is precisely what we expect
      brand = await Brand.create({ name: 'Yamaha', country: 'Japan' });
    }

    let model = await Model.findOne({ model: 'MT-25' });
    if (!model) {
      model = await Model.create({ 
        model: 'MT-25', 
        brand: brand._id,
        brand_name: 'Yamaha',
        type: 'Naked'
      });
    } else {
        // Ensure brand_name is set correctly for the test
        if (model.brand_name !== 'Yamaha') {
            model.brand_name = 'Yamaha';
            await model.save();
        }
    }

    // 2. Test Queries
    const queries = [
        'Yamaha MT-25', 
        'yamaha mt25', 
        'yamaha mt 25', 
        'Yamaha mt-25',
        'mt25', // Should still work
        'Yamaha' // Should match because it's part of the full string
    ];
    
    for (const q of queries) {
        // Imitate the controller logic
        const cleanQuery = q.replace(/[^a-zA-Z0-9]/g, '');
        const regexPattern = cleanQuery.split('').join('[\\s-]*');
        const regex = new RegExp(regexPattern, 'i');
        
        // Imitate aggregation logic
        const pipeline = [
            {
                $addFields: {
                    full_model_name: { 
                        $concat: [ 
                            { $ifNull: ["$brand_name", ""] }, 
                            " ", 
                            "$model" 
                        ] 
                    }
                }
            },
            { 
                $match: { 
                    full_model_name: { $regex: regex } 
                } 
            }
        ];

        const result = await Model.aggregate(pipeline);
        
        console.log(`Query: "${q}" -> Regex: "${regexPattern}" -> Matches: ${result.length}`);
        
        if (result.length === 0) {
            console.error(`FAILED: "${q}" should have matched MT-25 (Full Name: Yamaha MT-25)`);
        }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

verify();
