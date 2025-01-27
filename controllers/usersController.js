const { model } = require('mongoose');
const Users = require('../models/userModel.js')
const bcrypt = require("bcrypt");

async function encryptPass(pass) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(pass, saltRounds);

    return hashed;
}

async function checkPassword(plain, hashed) {
    return await bcrypt.compare(plain, hashed);
}

async function get_users(req, res) {    
    try {
        Users.find().then((result) => {
            return res.status(200).json(result)
        })
    }catch(e) {
        return res.status(400).json({
            error: "An error occured"
        })
    }
}

async function get_user_by_id(req, res) {
    const id = req.params.id;

    try {
        Users.findOne({_id: id}).then((result) => {
            return res.status(200).json(result)
        }).catch((e) => {
            return res.status(400).json({
                error: "Invalid user ID"
            })
        })
    }catch(e) {
        return res.status(400).json({
            error: "An error occured"
        })
    }
}

async function get_rooms_by_users(req, res) {
    const id = req.params.id;

    try {
        Users.findOne({_id: id})
        .populate({
            path: "joined_rooms",
            populate: {
                path: "files",
                model: "file"
            }
        })
        .select("joined_rooms")
        .then((result) => {
            return res.status(200).json(result.joined_rooms)
        }).catch((e) => {
            console.log(e);
            return res.status(400).json({
                error: "Invalid user ID"
            })
        })
    }catch(e) {
        return res.status(400).json({
            error: "An error occured"
        })
    }
}

async function post_users(req, res) {    
    try {
        const user = await Users.findOne({username: req.body.username});
        
        if(!user) {
            req.body.password = await encryptPass(req.body.password);
            Users.create(req.body).then((response) => {
                return res.status(201).json(response)
            });
        }else {
            let isMatch = await checkPassword(req.body.password, user.password);
            if(isMatch) {
                return res.status(200).json(user)
            }else {
                return res.status(400).json({
                    error: "Invalid password"
                })
            }
        }
    }catch(e) {
        res.status(400).json({
            error: "Invalid data"
        })
    }
}

module.exports = {
    get_users,
    post_users,
    get_user_by_id,
    get_rooms_by_users
}