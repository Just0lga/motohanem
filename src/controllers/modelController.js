const mongoose = require('mongoose');
const Model = require('../models/Model');
const Favorite = require('../models/Favorite');
const Comment = require('../models/Comment');

exports.getMostFavorited = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const pipeline = [
            // Lookup favorites (Left Join)
            {
                $lookup: {
                    from: 'favorites',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'favorites_data'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'comments_data'
                }
            },
            // Calculate count
            {
                $addFields: {
                    favoriteCount: { $size: '$favorites_data' },
                    commentCount: { $size: '$comments_data' },
                    averageRating: { 
                        $ifNull: [ { $avg: '$comments_data.rating' }, 0 ]
                    }
                }
            },
            // Remove the heavy arrays
            {
                $project: {
                    favorites_data: 0,
                    comments_data: 0
                }
            },
            // Sort by count descending
            { $sort: { favoriteCount: -1 } },
            // Pagination
            {
                $facet: {
                    metadata: [{ $count: 'totalDocs' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            },
            { $unwind: '$metadata' },
            {
                $project: {
                    totalDocs: '$metadata.totalDocs',
                    data: 1
                }
            }
        ];

        const aggregationResult = await Model.aggregate(pipeline);

        if (!aggregationResult.length) {
             return res.json({
                docs: [],
                totalDocs: 0,
                limit,
                totalPages: 0,
                page,
                hasNextPage: false,
                hasPrevPage: false
            });
        }

        const { totalDocs, data } = aggregationResult[0];

        // Populate brand details
        const docs = await Model.populate(data, { path: 'brand' });

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

exports.getMostCommented = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const pipeline = [
            // Lookup comments (Left Join)
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'comments_data'
                }
            },
            {
                $lookup: {
                    from: 'favorites',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'favorites_data'
                }
            },
            // Calculate count
            {
                $addFields: {
                    commentCount: { $size: '$comments_data' },
                    favoriteCount: { $size: '$favorites_data' },
                    averageRating: { 
                        $ifNull: [ { $avg: '$comments_data.rating' }, 0 ]
                    }
                }
            },
            // Remove heavy arrays
            {
                $project: {
                    comments_data: 0,
                    favorites_data: 0
                }
            },
            // Sort by count descending
            { $sort: { commentCount: -1 } },
            // Pagination
            {
                $facet: {
                    metadata: [{ $count: 'totalDocs' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            },
            { $unwind: '$metadata' },
            {
                $project: {
                    totalDocs: '$metadata.totalDocs',
                    data: 1
                }
            }
        ];

        const aggregationResult = await Model.aggregate(pipeline);

        if (!aggregationResult.length) {
            return res.json({
                docs: [],
                totalDocs: 0,
                limit,
                totalPages: 0,
                page,
                hasNextPage: false,
                hasPrevPage: false
            });
        }

        const { totalDocs, data } = aggregationResult[0];

        // Populate brand details
        const docs = await Model.populate(data, { path: 'brand' });

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

exports.getHighestRated = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const pipeline = [
            // Lookup comments (Left Join)
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'comments_data'
                }
            },
            {
                $lookup: {
                    from: 'favorites',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'favorites_data'
                }
            },
            // Calculate average rating, handling nulls
            {
                $addFields: {
                    averageRating: { 
                        $ifNull: [ { $avg: '$comments_data.rating' }, 0 ]
                    },
                    commentCount: { $size: '$comments_data' },
                    favoriteCount: { $size: '$favorites_data' }
                }
            },
            // Remove heavy arrays
            {
                $project: {
                    comments_data: 0,
                    favorites_data: 0
                }
            },
            // Sort by rating descending
            { $sort: { averageRating: -1 } },
            // Pagination
            {
                $facet: {
                    metadata: [{ $count: 'totalDocs' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            },
            { $unwind: '$metadata' },
            {
                $project: {
                    totalDocs: '$metadata.totalDocs',
                    data: 1
                }
            }
        ];

        const aggregationResult = await Model.aggregate(pipeline);

        if (!aggregationResult.length) {
            return res.json({
                docs: [],
                totalDocs: 0,
                limit,
                totalPages: 0,
                page,
                hasNextPage: false,
                hasPrevPage: false
            });
        }

        const { totalDocs, data } = aggregationResult[0];

        // Populate brand details
        const docs = await Model.populate(data, { path: 'brand' });

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
        const pipeline = [
            {
                $match: {
                   brand: new mongoose.Types.ObjectId(req.params.brandId)
                }
            },
            // Lookup comments
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'comments_data'
                }
            },
            // Lookup favorites
            {
                $lookup: {
                    from: 'favorites',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'favorites_data'
                }
            },
            // Calculate stats
            {
                $addFields: {
                    commentCount: { $size: '$comments_data' },
                    favoriteCount: { $size: '$favorites_data' },
                    averageRating: { 
                        $ifNull: [ { $avg: '$comments_data.rating' }, 0 ]
                    }
                }
            },
            // Remove heavy arrays
            {
                $project: {
                    comments_data: 0,
                    favorites_data: 0
                }
            }
        ];

        const models = await Model.aggregate(pipeline);
        // Populate brand (optional but good for consistency if needed, though we already know the brand)
        // const populatedModels = await Model.populate(models, { path: 'brand' });
        
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
        const pipeline = [
            { $match: { type: typeValue } },
            // Lookup comments
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'comments_data'
                }
            },
            // Lookup favorites
            {
                $lookup: {
                    from: 'favorites',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'favorites_data'
                }
            },
            // Lookup brand
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            {
                $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Calculate stats
            {
                $addFields: {
                    commentCount: { $size: '$comments_data' },
                    favoriteCount: { $size: '$favorites_data' },
                    averageRating: { 
                        $ifNull: [ { $avg: '$comments_data.rating' }, 0 ]
                    }
                }
            },
            // Remove heavy arrays
            {
                $project: {
                    comments_data: 0,
                    favorites_data: 0
                }
            },
            // Pagination
            {
                $facet: {
                    metadata: [{ $count: 'totalDocs' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            }
        ];

        const aggregationResult = await Model.aggregate(pipeline);

        if (!aggregationResult.length) {
            return res.json({
                docs: [],
                totalDocs: 0,
                limit,
                totalPages: 0,
                page,
                hasNextPage: false,
                hasPrevPage: false
            });
        }

        const { totalDocs, data: docs } = aggregationResult[0].metadata.length > 0 
            ? { totalDocs: aggregationResult[0].metadata[0].totalDocs, data: aggregationResult[0].data }
            : { totalDocs: 0, data: [] };

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
}

exports.getModelsByOrigin = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const originValue = req.params.originValue;

    try {
        const pipeline = [
            { $match: { origin: originValue } },
            // Lookup comments
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'comments_data'
                }
            },
            // Lookup favorites
            {
                $lookup: {
                    from: 'favorites',
                    localField: '_id',
                    foreignField: 'model',
                    as: 'favorites_data'
                }
            },
            // Lookup brand
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            {
                $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Calculate stats
            {
                $addFields: {
                    commentCount: { $size: '$comments_data' },
                    favoriteCount: { $size: '$favorites_data' },
                    averageRating: { 
                        $ifNull: [ { $avg: '$comments_data.rating' }, 0 ]
                    }
                }
            },
            // Remove heavy arrays
            {
                $project: {
                    comments_data: 0,
                    favorites_data: 0
                }
            },
            // Pagination
            {
                $facet: {
                    metadata: [{ $count: 'totalDocs' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            }
        ];

        const aggregationResult = await Model.aggregate(pipeline);

        if (!aggregationResult.length) {
            return res.json({
                docs: [],
                totalDocs: 0,
                limit,
                totalPages: 0,
                page,
                hasNextPage: false,
                hasPrevPage: false
            });
        }

        const { totalDocs, data: docs } = aggregationResult[0].metadata.length > 0
            ? { totalDocs: aggregationResult[0].metadata[0].totalDocs, data: aggregationResult[0].data }
            : { totalDocs: 0, data: [] };

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
