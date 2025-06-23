const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error('Error connecting to database:', err));

// POST API to store user data
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;

        const user = new User({ name, email, age });
        await user.validate();

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation error: ${error.message}` });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
