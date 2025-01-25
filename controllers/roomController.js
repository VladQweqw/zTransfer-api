const Rooms = require("../models/roomModel");
const Users = require("../models/userModel")

const bcrypt = require('bcrypt');

async function encryptPass(pass) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(pass, saltRounds);

    return hashed;
}

async function checkPassword(plain, hashed) {
    return await bcrypt.compare(plain, hashed);
}

function get_rooms(req, res) {    
    try {
        return Rooms.find().populate('author').then((response) => {
            return res.status(200).json(response)
        })
    }catch(e) {
        return res.status(400).json({
            error: "An error occured"
        })
    }
}

async function get_room_by_id(req, res) {
    const id = req.params.id;

    try {
        const room = await Rooms.findOne({_id: id}).populate('files');

        return res.status(200).json({
            data: room
        })
    }catch(er) {
        return res.status(400).json({
            error: "Invalid room ID"
        })
    }
}

async function post_room(req, res) {    
    const user_id = req.body.author;

    const user = await Users.findOne({_id: user_id})

    if(!user) {
        return res.status(400).json("Invalid user ID")
    }

    try {
        req.body.password = await encryptPass(req.body.password)

       const room = await Rooms.create(req.body);
       room.save();
    
       if(!user.joined_rooms.includes(room._id)) {
            await user.updateOne({
                $push: {joined_rooms: room._id}
            })
        }

        if(!room.peopleInside.includes(user._id)) {
            await room.updateOne({
                $push: {peopleInside: user._id}
            })
        }

       return res.status(201).json({
            message: "Room created!"
       })
    }catch(e) {        
        return res.status(400).json({
            error: "Invalid data"
        })
    }
}

async function enterRoom(req, res) {    
    const inp_pass = req.body.password;
    const room_id = req.params.id;

    const user_id = req.body.user_id;

    const user = await Users.findOne({_id: user_id})

    if(!user) {
        return res.status(400).json("Invalid user ID")
    }
        

    try {
       const room = await Rooms.findOne({_id: room_id});
       const room_hashed_pass = room.password;

       if(await checkPassword(inp_pass, room_hashed_pass)) {   
            if(!user.joined_rooms.includes(room._id)) {
                await user.updateOne({
                    $push: {joined_rooms: room._id}
                })
            }

            if(!room.peopleInside.includes(user._id)) {
                await room.updateOne({
                    $push: {peopleInside: user._id}
                })
            }
    
           return res.status(200).json("success")
       }else {
            return res.status(403).json("failed")
       }
       
    }catch(e) {        
        return res.status(400).json("Invalid room ID")
    }
}

module.exports = {
    get_rooms,
    post_room,
    enterRoom,
    get_room_by_id,
}