import User from '../models/user.js';
import SessionDao from "../dao/sessionDao.js";
import {raw} from "express";

export const sessions = {};

export const register = async (req, res) => {
    try {
        const {email, password, username} = req.body;
        const user = await User.create({email, password, username});
        res.status(201).json({message: 'User registered successfully', userId: user.id});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findByEmail(email);
        if (!user || !(await user.verifyPassword(password, user.password))) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const apiKey = await SessionDao.create(user);
        sessions[apiKey] = user.id;
        res.cookie('apiKey', apiKey, {httpOnly: true});
        res.json({message: 'Login successful', user_id: user.id});
    } catch (error) {
        res.status(500).json({error: 'Login failed'});
    }
};

export const logout = (req, res) => {
    const apiKey = req.cookies.apiKey;
    // console.log(apiKey)
    SessionDao.delete(apiKey);
    res.clearCookie('apiKey');
    res.json({message: 'Logout successful'});
};
