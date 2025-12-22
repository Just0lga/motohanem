const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Docker ortamında MONGO_URI, Dokploy tarafından sağlanacak.
    // Localhost fallback'ini sadece yerel geliştirmede kullanın.
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Hata: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;