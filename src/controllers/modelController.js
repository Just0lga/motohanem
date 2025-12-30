const Model = require('../models/Model');

exports.getAllModels = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const pipeline = [
      // Lookup comments to get count and rating
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'model',
          as: 'comments_data'
        }
      },
      // Lookup favorites to get count
      {
        $lookup: {
          from: 'favorites',
          localField: '_id',
          foreignField: 'model',
          as: 'favorites_data'
        }
      },
      // Lookup brand to populate it (mimicking .populate('brand'))
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand'
        }
      },
      // Unwind brand array (since lookup returns an array)
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true
        }
      },
      // Add calculated fields
      {
        $addFields: {
          commentCount: { $size: '$comments_data' },
          favoriteCount: { $size: '$favorites_data' },
          averageRating: { 
            $ifNull: [
              { $avg: '$comments_data.rating' }, 
              0 
            ] 
          }
        }
      },
      // Project to remove heavy arrays and keep necessary fields
      {
        $project: {
          comments_data: 0,
          favorites_data: 0
        }
      },
      // Facet for pagination
      {
        $facet: {
          metadata: [{ $count: 'totalDocs' }],
          data: [{ $skip: skip }, { $limit: limit }]
        }
      }
    ];

    const result = await Model.aggregate(pipeline);
    
    const metadata = result[0].metadata[0] || { totalDocs: 0 };
    const docs = result[0].data;
    const totalDocs = metadata.totalDocs;

    res.json({
        docs,
        totalDocs,
        limit,
        totalPages: Math.ceil(totalDocs / limit),
        page,
        hasNextPage: page * limit < totalDocs,
        hasPrevPage: page > 1
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getModelsByBrand = async (req, res) => {
    try {
        const models = await Model.find({ brand: req.params.brandId });
        res.json(models);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getModelsByType = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const typeValue = req.params.typeValue;

    try {
        const totalDocs = await Model.countDocuments({ type: typeValue });
        const models = await Model.find({ type: typeValue }).populate('brand').skip(skip).limit(limit);
        
        res.json({
            docs: models,
            totalDocs,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            page,
            hasNextPage: page * limit < totalDocs,
            hasPrevPage: page > 1
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getModelsByOrigin = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const originValue = req.params.originValue;

    try {
        const totalDocs = await Model.countDocuments({ origin: originValue });
        const models = await Model.find({ origin: originValue }).populate('brand').skip(skip).limit(limit);
        
        res.json({
            docs: models,
            totalDocs,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            page,
            hasNextPage: page * limit < totalDocs,
            hasPrevPage: page > 1
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createModel = async (req, res) => {
  try {
    const newModel = new Model(req.body);
    await newModel.save();
    res.status(201).json(newModel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
