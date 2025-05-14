import User from '../models/user.js';
import { v4 as uuidv4 } from 'uuid';

export const sessions = {};

export const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = await User.create({ email, password, username });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (!user || !(await user.verifyPassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const apiKey = uuidv4();
        sessions[apiKey] = user.id;
        res.cookie('apiKey', apiKey, { httpOnly: true });
        res.json({ message: 'Login successful', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('apiKey');
    res.json({ message: 'Logout successful' });
};
