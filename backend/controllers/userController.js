const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const db = require('../db');
dotenv.config();


dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


exports.register = async (req, res) => {
    try {
        const user = { username: req.body.username, password: req.body.password };
        const alreadyPresent = await db.query("SELECT * FROM users WHERE username = $1", [user.username]);

        if (alreadyPresent.rows.length === 0) {
            const password_hash = await bcrypt.hash(req.body.password, 10); // hashed password
             const newUser = await db.query("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *", [user.username , password_hash]); // returning * to get the inserted user details

            res.status(201).json({
                message: "Registration successful!",
                user: newUser.rows[0]
            });
        }
        else {
            res.status(401).send("User exists with this username!");
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error during registration");
    }
}


exports.login = async (req, res) => {

    // authenticate user here
    try {
        const user = await db.query("SELECT * FROM users WHERE username = $1", [req.body.username]);
        if (user.rows.length > 0) {
            if (await bcrypt.compare(req.body.password, user.rows[0].password_hash)) {

                const userPayload = { id: user.rows[0].id, username: user.rows[0].username };
                const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h'});

                res.status(200).json({
                    accessToken: accessToken,
                    message: "Login successful!"
                });
            }
            else {
                res.send("Wrong user details!");
            }
        }
        else res.status(404).send("User not found!");
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send("Went wrong something.");
    }
}