const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Do not return passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Authorization check (optional based on user request "Giriş yapmış kullanıcının sadece kendi verilerine erişebilmesi")
    if (req.user && req.user.id !== user.id) {
       // If you want strict owner access only:
       // return res.status(403).json({ message: 'Not authorized to view this user' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  // Role is explicitly excluded here to ensure new users always default to 'user'
  const { name, email, password, avatar_url } = req.body;

  // Simple Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  // Email format validation (basic regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (hashing done in model pre-save)
    const newUser = await User.create({ name, email, password, avatar_url });

    if (newUser) {
      res.status(201).json({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar_url: newUser.avatar_url,
        token: generateToken(newUser._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000);

    // Set token and expiration (10 minutes)
    user.resetPasswordToken = code;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Your password reset code is: ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        res.json({ message: 'Email sent' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.requestAccountDeletion = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000);

    // Set token and expiration (10 minutes)
    user.deleteAccountToken = code;
    user.deleteAccountExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Account Deletion Request',
      text: `You requested to delete your account. Your confirmation code is: ${code}. This code will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        res.json({ message: 'Verification email sent' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.confirmAccountDeletion = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      _id: req.user.id,
      deleteAccountToken: code,
      deleteAccountExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.upgradeToPremium = async (req, res) => {
  const { subscriptionType } = req.body;
  const userId = req.params.id;

  if (!['monthly', 'yearly'].includes(subscriptionType)) {
    return res.status(400).json({ message: 'Invalid subscription type. Must be monthly or yearly.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // EKLENEN KISIM: Kullanıcı zaten premium mu kontrol et
    if (user.isPremium) {
      return res.status(400).json({ message: 'User already premium' });
    }

    const now = new Date();
    let endDate = new Date(now);

    if (subscriptionType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (subscriptionType === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    user.isPremium = true;
    user.subscriptionType = subscriptionType;
    user.premiumStartDate = now;
    user.premiumEndDate = endDate;

    await user.save();

    res.json({
      message: `User upgraded to ${subscriptionType} premium`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        subscriptionType: user.subscriptionType,
        premiumStartDate: user.premiumStartDate,
        premiumEndDate: user.premiumEndDate
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSubscriptionPrices = (req, res) => {
  res.status(200).json([
    { "id": "1", "subscription_type": "Monthly", "price": 19.99 },
    { "id": "2", "subscription_type": "Yearly", "price": 99.99 }
  ]);
};

