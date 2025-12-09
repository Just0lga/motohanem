const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
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

// Root route
app.get('/', (req, res) => {
  res.send('Vehicle App Backend is running with MongoDB! Documentation at <a href="/api-docs">/api-docs</a>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
