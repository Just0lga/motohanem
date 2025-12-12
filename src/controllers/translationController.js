const Translation = require('../models/Translation');

/**
 * Get all translations formatted as a key-value pair object based on the requested language.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTranslations = async (req, res) => {
  try {
    const lang = req.headers['accept-language'] === 'en' ? 'en' : 'tr';
    const translations = await Translation.find({});

    const formattedTranslations = translations.reduce((acc, curr) => {
      acc[curr.key] = curr[lang] || curr.tr; // Fallback to 'tr' if specific lang is missing (though model enforces required)
      return acc;
    }, {});

    res.status(200).json(formattedTranslations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Create a new translation entry.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTranslation = async (req, res) => {
  try {
    const { key, tr, en, screen } = req.body;

    // Basic Validation
    if (!key || !tr || !en) {
      return res.status(400).json({ message: 'Key, tr (Turkish), and en (English) fields are required.' });
    }

    // Check if key already exists
    const existingTranslation = await Translation.findOne({ key });
    if (existingTranslation) {
      return res.status(400).json({ message: 'Translation with this key already exists.' });
    }

    const newTranslation = new Translation({
      key,
      tr,
      en,
      screen
    });

    await newTranslation.save();

    res.status(201).json(newTranslation);
  } catch (error) {
    console.error('Error creating translation:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTranslations,
  createTranslation
};
