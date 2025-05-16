const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findByEmail, createUser } = require('../models/userModel');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    console.log("Register request body:", req.body);

    const existingUser = await findByEmail(email);
    console.log("Existing user:", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: 'Email already used' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const newUser = await createUser({ name, email, password: hashedPassword, role });
    console.log("New user created:", newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.PASSWORD);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.ID, role: user.ROLE, email: user.EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.ID, name: user.NAME, email: user.EMAIL, role: user.ROLE } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

module.exports = { register, login };
