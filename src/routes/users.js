const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 999, // Limit each IP to 999 login requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests, please try again later',
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         avatar_url:
 *           type: string
 *           description: The user avatar url
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         isPremium:
 *           type: boolean
 *           description: Whether the user is a premium member
 *         subscriptionType:
 *           type: string
 *           enum: [monthly, yearly]
 *           description: The type of subscription
 *         premiumStartDate:
 *           type: string
 *           format: date-time
 *           description: The start date of the premium membership
 *         premiumEndDate:
 *           type: string
 *           format: date-time
 *           description: The end date of the premium membership
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     security:              
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:              
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.post('/', userController.createUser);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user email
 *               password:
 *                 type: string
 *                 description: The user password
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *       429:
 *         description: Too many requests, please try again later
 */
router.post('/login', strictLimiter, userController.login);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user email
 *     responses:
 *       200:
 *         description: Email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */
router.post('/forgot-password', userController.forgotPassword);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset user password with code
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user email
 *               code:
 *                 type: string
 *                 description: The 6-digit code
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Some server error
 */
// Protected Routes
/**
 * @swagger
 * /users/request-account-deletion:
 *   post:
 *     summary: Request to delete account (sends email)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */
router.post('/request-account-deletion', protect, userController.requestAccountDeletion);

/**
 * @swagger
 * /users/confirm-account-deletion:
 *   post:
 *     summary: Confirm account deletion with code
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: The 6-digit confirmation code
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Some server error
 */
router.post('/confirm-account-deletion', protect, userController.confirmAccountDeletion);

/**
 * @swagger
 * /users/subscription-prices:
 *   get:
 *     summary: Retrieve subscription prices
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of subscription prices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The subscription ID
 *                   subscription_type:
 *                     type: string
 *                     description: The subscription type
 *                   price:
 *                     type: number
 *                     description: The price
 */
router.get('/subscription-prices', userController.getSubscriptionPrices);


// Protected Routes
router.get('/', protect, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */
router.get('/:id', protect, userController.getUserById);

/**
 * @swagger
 * /users/{id}/upgrade:
 *   post:
 *     summary: Upgrade user to premium (Helper for testing)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionType
 *             properties:
 *               subscriptionType:
 *                 type: string
 *                 enum: [monthly, yearly]
 *                 description: The type of subscription
 *     responses:
 *       200:
 *         description: User upgraded successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid subscription type
 */
router.post('/:id/upgrade', protect, userController.upgradeToPremium);

module.exports = router;
