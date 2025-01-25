const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: "file",
    }],
    peopleInside: [{
        type: Schema.Types.ObjectId,
        ref: "user",
    }]
}, {
    timestamps: true
})


const Rooms = mongoose.model('room', RoomSchema)
module.exports = Rooms