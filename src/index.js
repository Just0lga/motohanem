const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const cors = require('cors');
const { startPremiumExpiryJob } = require('./services/cronService');

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start Cron Jobs
startPremiumExpiryJob();

const rateLimit = require('express-rate-limit');

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many requests, please try again later'
  }
});

// Middleware
app.use(globalLimiter);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/users', require('./routes/users'));
app.use('/vehicles', require('./routes/vehicles'));
app.use('/brands', require('./routes/brands'));
app.use('/models', require('./routes/models'));
app.use('/comments', require('./routes/comments'));
app.use('/favorites', require('./routes/favorites'));
app.use('/translations', require('./routes/translations'));
app.use('/api/v1/update', require('./routes/updateRoutes'));
app.use('/types-of-motorcycle', require('./routes/typesOfMotorcycle'));
app.use('/countries', require('./routes/countries'));
app.use('/revenuecat', require('./routes/revenuecat'));

// Root route
app.get('/', (req, res) => {
  res.send('Vehicle App Backend is running with MongoDB! Documentation at <a href="/api-docs">/api-docs</a>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
